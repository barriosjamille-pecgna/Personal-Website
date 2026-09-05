import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import "./cursor.css";

// Detects touch/coarse-pointer devices and simply doesn't render,
// letting the OS cursor (or nothing, on touch) take over.
function useIsFinePointer() {
  const [isFine, setIsFine] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFine(mq.matches);
    const handler = (e) => setIsFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isFine;
}

export default function CustomCursor() {
  const { theme } = useTheme();
  const isFine = useIsFinePointer();
  const ref = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (!isFine) return;
    document.body.setAttribute("data-has-custom-cursor", "true");
    return () => document.body.removeAttribute("data-has-custom-cursor");
  }, [isFine]);

  useEffect(() => {
    if (!isFine) return;
    let raf;
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const target = e.target.closest?.("[data-interactive]");
      setHovering(Boolean(target));
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const render = () => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(raf);
    };
  }, [isFine]);

  if (!isFine) return null;

  const kind = theme.cursor.kind; // 'ladybug' | 'crystal'

  return (
    <div
      ref={ref}
      className={`custom-cursor ${hovering ? "is-hovering" : ""} ${clicking ? "is-clicking" : ""}`}
      aria-hidden="true"
    >
      {kind === "ladybug" ? <LadybugGlyph /> : <CrystalGlyph />}
    </div>
  );
}

function LadybugGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="cursor-glyph ladybug">
      <g className="ladybug-body">
        <ellipse cx="13" cy="15" rx="7" ry="8" fill="#B5423A" />
        <path d="M13 7 A7 8 0 0 1 13 23" fill="#3A3227" opacity="0.85" />
        <circle cx="10" cy="12" r="1.1" fill="#3A3227" />
        <circle cx="16" cy="12" r="1.1" fill="#3A3227" />
        <circle cx="10" cy="18" r="1" fill="#3A3227" />
        <circle cx="16" cy="18" r="1" fill="#3A3227" />
        <circle cx="13" cy="7" r="2.3" fill="#3A3227" />
      </g>
      <path className="ladybug-wing wing-left" d="M13 7 Q4 9 5 16" stroke="#B5423A" strokeWidth="1" fill="none" opacity="0" />
      <path className="ladybug-wing wing-right" d="M13 7 Q22 9 21 16" stroke="#B5423A" strokeWidth="1" fill="none" opacity="0" />
    </svg>
  );
}

function CrystalGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="cursor-glyph crystal">
      <polygon points="13,2 20,10 13,24 6,10" fill="#8FE1EA" opacity="0.85" />
      <polygon points="13,2 20,10 13,13 6,10" fill="#B9A6FF" opacity="0.7" />
      <polygon points="6,10 13,13 13,24" fill="#6FC7D1" opacity="0.6" />
    </svg>
  );
}
