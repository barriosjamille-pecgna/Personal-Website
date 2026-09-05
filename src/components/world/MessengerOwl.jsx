import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { getContactInfo } from "../../data/contentApi";
import "./messengerOwl.css";

export default function MessengerOwl() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (open && !info) {
      getContactInfo().then(setInfo);
    }
  }, [open, info]);

  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      idRef.current += 1;
      const id = idRef.current;
      const left = Math.random() * 80 + 5;
      const duration = 1.5 + Math.random() * 0.8;
      const drift = (Math.random() - 0.5) * 50;
      setSnowflakes((prev) => [...prev, { id, left, duration, drift }]);
      setTimeout(() => {
        setSnowflakes((prev) => prev.filter((s) => s.id !== id));
      }, duration * 1000 + 100);
    }, 200);
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <>
      <button
        className="messenger-owl"
        data-interactive="true"
        aria-label="A messenger owl carries a letter — open it"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <span className="messenger-owl__body">
          <img src="/assets/owl/owl.png" alt="" className="messenger-owl__img" />
          <span className="messenger-owl__eyelid messenger-owl__eyelid--l" />
          <span className="messenger-owl__eyelid messenger-owl__eyelid--r" />
        </span>
        <span className="messenger-owl__snow" aria-hidden="true">
          {snowflakes.map((s) => (
            <span
              key={s.id}
              className="snowflake"
              style={{ left: `${s.left}%`, "--duration": `${s.duration}s`, "--drift": `${s.drift}px` }}
            >
              ❄
            </span>
          ))}
        </span>
      </button>

      {open && (
        <Modal title="A Letter Arrives" onClose={() => setOpen(false)}>
          <div className="envelope" aria-hidden="true">
            <svg viewBox="0 0 150 100" className="envelope__svg">
              <rect x="4" y="14" width="142" height="82" rx="4" className="envelope__body" />
              <path d="M4 18 L75 68 L146 18" className="envelope__flap-line" fill="none" />
              <path d="M4 18 L75 68 L146 18 L75 4 Z" className="envelope__flap" />
            </svg>
          </div>

          {!info && <p className="explorer-intro">The seal is still warm…</p>}

          {info && (
            <div className="credentials-letter">
              <p className="explorer-parchment-body">{info.greeting}</p>
              <ul className="explorer-plain-list">
                {info.email && (
                  <li>
                    <strong>Email:</strong> <a href={`mailto:${info.email}`}>{info.email}</a>
                  </li>
                )}
                {info.linkedin && (
                  <li>
                    <strong>LinkedIn:</strong>{" "}
                    <a href={info.linkedin} target="_blank" rel="noreferrer">
                      {info.linkedin}
                    </a>
                  </li>
                )}
                {info.resume && (
                  <li>
                    <strong>Resume:</strong>{" "}
                    <a href={info.resume} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </li>
                )}
                {info.credentials?.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
