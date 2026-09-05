import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getContactInfo } from "../../data/contentApi";
import "./messengerOwl.css";

export default function MessengerOwl() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (open && !info) {
      getContactInfo().then(setInfo);
    }
  }, [open, info]);

  return (
    <>
      <button
        className="messenger-owl"
        data-interactive="true"
        aria-label="A messenger owl carries a letter — open it"
        onClick={() => setOpen(true)}
      >
        <OwlGlyph />
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

function OwlGlyph() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" className="owl-glyph" aria-hidden="true">
      <path d="M14 40 Q10 20 20 10 Q30 2 40 10 Q50 20 46 40 Z" className="owl-body" />
      <circle cx="22" cy="24" r="8" className="owl-eye-bg" />
      <circle cx="38" cy="24" r="8" className="owl-eye-bg" />
      <circle cx="22" cy="24" r="3.4" className="owl-eye" />
      <circle cx="38" cy="24" r="3.4" className="owl-eye" />
      <polygon points="30,29 26,37 34,37" className="owl-beak" />
      <path d="M13 12 L21 19" className="owl-ear owl-ear--l" />
      <path d="M47 12 L39 19" className="owl-ear owl-ear--r" />
      <ellipse cx="30" cy="46" rx="16" ry="8" className="owl-belly" />
    </svg>
  );
}
