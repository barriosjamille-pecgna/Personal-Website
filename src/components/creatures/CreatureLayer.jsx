import { useEffect, useRef } from "react";
import { useTheme } from "../../theme/ThemeContext";

// A single canvas drives every flying creature + their click particles.
// This intentionally avoids one-DOM-node-per-creature: with a dozen+
// creatures each carrying glow filters, that approach thrashes layout
// and paint. A single rAF loop drawing to canvas keeps this cheap
// regardless of creature count.

const rand = (a, b) => a + Math.random() * (b - a);

function makeCreature(kind, w, h) {
  return {
    kind, // 'butterfly' | 'dragonfly' | 'firefly' | 'wisp'
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-0.4, 0.4),
    vy: rand(-0.4, 0.4),
    angle: rand(0, Math.PI * 2),
    wingPhase: rand(0, Math.PI * 2),
    glow: rand(0.4, 1),
    glowDir: 1,
    turnTimer: rand(60, 180),
    startledUntil: 0,   // firefly: glow off until this timestamp
    fleeing: false,
    scale: rand(0.85, 1.2),
    hue: rand(0, 1),
  };
}

function spawnBurst(particles, x, y, colorList) {
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const speed = rand(0.6, 2.2);
    particles.push({
      x, y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 0.4,
      life: 1,
      decay: rand(0.012, 0.025),
      size: rand(1.5, 3.5),
      color: colorList[Math.floor(rand(0, colorList.length))],
    });
  }
}

export default function CreatureLayer() {
  const canvasRef = useRef(null);
  const { theme, reducedMotion } = useTheme();
  const themeRef = useRef(theme);
  const reducedRef = useRef(reducedMotion);
  themeRef.current = theme;
  reducedRef.current = reducedMotion;

  const creaturesRef = useRef([]);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed creatures once. Kind is picked at draw-time based on theme,
    // not baked in, so light<->dark just changes how each one is drawn.
    const primaryCount = isMobile ? 3 : 7;
    const secondaryCount = isMobile ? 2 : 4;
    creaturesRef.current = [
      ...Array.from({ length: primaryCount }, () => makeCreature("primary", w, h)),
      ...Array.from({ length: secondaryCount }, () => makeCreature("secondary", w, h)),
    ];

    function onMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    function onLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    function onClick(e) {
      const mx = e.clientX, my = e.clientY;
      const list = creaturesRef.current;
      const isDark = themeRef.current.mode === "dark";
      for (const c of list) {
        const d = Math.hypot(c.x - mx, c.y - my);
        if (d < 26) {
          if (c.kind === "primary" && !isDark) {
            // butterfly: shake + pixie dust burst
            spawnBurst(particlesRef.current, c.x, c.y, themeRef.current.creatures.butterflyPalette);
            c.turnTimer = 0;
          } else if (c.kind === "secondary" && !isDark) {
            // dragonfly: pixie dust burst
            spawnBurst(particlesRef.current, c.x, c.y, themeRef.current.creatures.dragonflyPalette);
          } else if (c.kind === "primary" && isDark) {
            // firefly: glow off temporarily, startled
            c.startledUntil = performance.now() + rand(1200, 2000);
          } else if (c.kind === "secondary" && isDark) {
            // wisp: dissolve into particles, then respawn elsewhere
            spawnBurst(particlesRef.current, c.x, c.y, themeRef.current.creatures.dragonflyPalette);
            c.x = rand(0, w);
            c.y = rand(0, h);
            c.fleeing = true;
          }
          break;
        }
      }
    }
    window.addEventListener("click", onClick);

    function step() {
      const t = performance.now();
      const isDark = themeRef.current.mode === "dark";
      const reduced = reducedRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const c of creaturesRef.current) {
        const mx = mouseRef.current.x, my = mouseRef.current.y;
        const distToMouse = Math.hypot(c.x - mx, c.y - my);
        const isSecondary = c.kind === "secondary";

        if (!reduced) {
          // Randomized wandering: occasionally pick a new heading.
          c.turnTimer -= 1;
          if (c.turnTimer <= 0) {
            c.angle += rand(-0.9, 0.9);
            c.turnTimer = rand(70, 200);
          }

          // Cursor reaction: secondary creatures (dragonfly/wisp) flee;
          // primary creatures gently steer away, more curious than scared.
          if (distToMouse < (isSecondary ? 140 : 90)) {
            const away = Math.atan2(c.y - my, c.x - mx);
            const push = isSecondary ? 0.35 : 0.12;
            c.angle = c.angle * (1 - push) + away * push;
          }

          const speed = isSecondary ? 1.7 : 0.9;
          c.vx = c.vx * 0.9 + Math.cos(c.angle) * speed * 0.1;
          c.vy = c.vy * 0.9 + Math.sin(c.angle) * speed * 0.1;
          c.x += c.vx;
          c.y += c.vy;
          c.wingPhase += isSecondary ? 0.5 : 0.22;

          // Wrap around edges softly
          const margin = 40;
          if (c.x < -margin) c.x = w + margin;
          if (c.x > w + margin) c.x = -margin;
          if (c.y < -margin) c.y = h + margin;
          if (c.y > h + margin) c.y = -margin;
        }

        // Glow pulse (fireflies especially)
        c.glow += c.glowDir * 0.008;
        if (c.glow > 1) { c.glow = 1; c.glowDir = -1; }
        if (c.glow < 0.35) { c.glow = 0.35; c.glowDir = 1; }

        drawCreature(ctx, c, isDark, t, themeRef.current);
      }

      // Particles (pixie dust bursts)
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015; // gentle gravity
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5 }}
    />
  );
}

function drawCreature(ctx, c, isDark, t, theme) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.scale(c.scale, c.scale);

  if (c.kind === "primary" && !isDark) {
    drawButterfly(ctx, c, theme);
  } else if (c.kind === "secondary" && !isDark) {
    drawDragonfly(ctx, c, theme);
  } else if (c.kind === "primary" && isDark) {
    drawFirefly(ctx, c, t, theme);
  } else {
    drawWisp(ctx, c, t, theme);
  }

  ctx.restore();
}

function drawButterfly(ctx, c, theme) {
  const flap = Math.sin(c.wingPhase) * 0.7 + 0.3;
  const color = theme.creatures.butterflyPalette[Math.floor(c.hue * theme.creatures.butterflyPalette.length)];
  ctx.rotate(Math.atan2(c.vy, c.vx) * 0.2);
  ctx.shadowColor = theme.creatures.trailGlow;
  ctx.shadowBlur = 8;
  ctx.fillStyle = color;
  // two wing pairs
  ctx.save();
  ctx.scale(1, flap);
  ctx.beginPath();
  ctx.ellipse(-6, -3, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, -3, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#3A3227";
  ctx.fillRect(-1, -6, 2, 12);
}

function drawDragonfly(ctx, c, theme) {
  const flap = Math.sin(c.wingPhase) * 4;
  const color = theme.creatures.dragonflyPalette[Math.floor(c.hue * theme.creatures.dragonflyPalette.length)];
  ctx.rotate(Math.atan2(c.vy, c.vx));
  ctx.shadowColor = theme.creatures.trailGlow;
  ctx.shadowBlur = 6;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(0, -flap - 4, 9, 2.5, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, flap + 4, 9, 2.5, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.shadowBlur = 0;
  ctx.fillRect(-1.5, -10, 3, 20);
}

function drawFirefly(ctx, c, t, theme) {
  const startled = c.startledUntil > t;
  const glow = startled ? 0.03 : c.glow;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = theme.colors.gold;
  ctx.shadowColor = theme.colors.gold;
  ctx.shadowBlur = startled ? 0 : 6 + glow * 10;
  ctx.beginPath();
  ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = startled ? 0.15 : 0.35 * glow + 0.15;
  ctx.beginPath();
  ctx.arc(0, 0, 6 + glow * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

function drawWisp(ctx, c, t, theme) {
  const pulse = 0.5 + Math.sin(t / 300 + c.hue * 10) * 0.3;
  ctx.fillStyle = theme.colors.crystal;
  ctx.shadowColor = theme.colors.crystal;
  ctx.shadowBlur = 10 + pulse * 8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(0, 0, 9 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}
