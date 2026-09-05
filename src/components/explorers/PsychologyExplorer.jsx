import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getPsychologyProfile } from "../../data/contentApi";

export default function PsychologyExplorer({ section, onClose }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let alive = true;
    getPsychologyProfile().then((data) => alive && setProfile(data));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Modal title={section.title} onClose={onClose}>
      <p className="explorer-intro">A pin, kept in a drawer, still meaning what it always meant.</p>
      {!profile && <p>Reading the notebook…</p>}
      {profile && (
        <>
          <h3>Credentials</h3>
          <ul className="explorer-plain-list">
            {profile.credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <h3>Experience</h3>
          {profile.experience.map((e) => (
            <div key={e.title} className="explorer-experience-row">
              <strong>{e.title}</strong>
              <span>
                {e.org} · {e.period}
              </span>
              {e.description && <p>{e.description}</p>}
            </div>
          ))}
          <h3>Skills</h3>
          <p>{profile.skills.join(" · ")}</p>
        </>
      )}
    </Modal>
  );
}
