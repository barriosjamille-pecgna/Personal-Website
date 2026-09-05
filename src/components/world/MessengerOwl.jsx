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
        <span className="messenger-owl__body">
          <img src="/assets/owl/owl.png" alt="" className="messenger-owl__img" />
          <span className="messenger-owl__eyelid messenger-owl__eyelid--l" />
          <span className="messenger-owl__eyelid messenger-owl__eyelid--r" />
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
