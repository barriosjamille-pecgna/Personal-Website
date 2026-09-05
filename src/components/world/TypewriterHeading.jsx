import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";

// A living typewriter effect:
// 1. Types the full text out, occasionally fumbling a character and
//    backspacing to correct it (like a real typist).
// 2. Sits idle for a while with a permanently blinking cursor.
// 3. Erases a few characters off the end and retypes them, forever,
//    so the heading stays gently alive instead of going fully static.
// Respects prefers-reduced-motion by just showing the finished text.

const TYPE_SPEED = 120; // ms per character while typing
const BACKSPACE_SPEED = 65; // ms per character while erasing
const TYPO_CHANCE = 0.1; // chance of fumbling a character while typing
const TYPO_HOLD = 350; // ms the wrong character stays before correction
const PAUSE_AFTER_COMPLETE = 2600; // ms idle after the first full type-out
const PAUSE_BETWEEN_CYCLES = 1500; // ms idle between later erase/retype loops
const TAIL_MIN = 4;
const TAIL_MAX = 8;

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const randomChar = () => LETTERS[Math.floor(Math.random() * LETTERS.length)];
const randomBetween = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default function TypewriterHeading({ text, as: Tag = "h1", className }) {
  const { reducedMotion } = useTheme();
  const [shown, setShown] = useState(reducedMotion ? text : "");
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    if (reducedMotion) {
      setShown(text);
      return () => {
        mountedRef.current = false;
      };
    }

    const schedule = (fn, delay) => {
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) fn();
      }, delay);
    };

    function typeForward(from, to, onDone) {
      let i = from;
      function step() {
        if (!mountedRef.current) return;
        if (i >= to) {
          onDone();
          return;
        }
        const canFumble = to - i > 2 && Math.random() < TYPO_CHANCE;
        if (canFumble) {
          const wrong = randomChar();
          setShown(text.slice(0, i) + wrong);
          schedule(() => {
            setShown(text.slice(0, i)); // backspace the mistake
            schedule(() => {
              setShown(text.slice(0, i + 1)); // type the correct character
              i += 1;
              schedule(step, TYPE_SPEED);
            }, TYPE_SPEED * 0.8);
          }, TYPO_HOLD);
        } else {
          setShown(text.slice(0, i + 1));
          i += 1;
          schedule(step, TYPE_SPEED);
        }
      }
      step();
    }

    function eraseBackTo(from, to, onDone) {
      let i = from;
      function step() {
        if (!mountedRef.current) return;
        if (i <= to) {
          onDone();
          return;
        }
        i -= 1;
        setShown(text.slice(0, i));
        schedule(step, BACKSPACE_SPEED);
      }
      step();
    }

    function idleThenCycle(pauseMs) {
      schedule(() => {
        const tailLen = randomBetween(TAIL_MIN, TAIL_MAX);
        const cutTo = Math.max(0, text.length - tailLen);
        eraseBackTo(text.length, cutTo, () => {
          schedule(() => {
            typeForward(cutTo, text.length, () => {
              idleThenCycle(PAUSE_BETWEEN_CYCLES);
            });
          }, 400);
        });
      }, pauseMs);
    }

    setShown("");
    typeForward(0, text.length, () => {
      idleThenCycle(PAUSE_AFTER_COMPLETE);
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, [text, reducedMotion]);

  return (
    <Tag className={className}>
      <span aria-hidden="true">
        {shown}
        <span className="typewriter-cursor">▏</span>
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
