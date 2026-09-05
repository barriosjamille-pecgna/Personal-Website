import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getAdvocacyProjects } from "../../data/contentApi";

export default function AdvocacyExplorer({ section, onClose }) {
  const [projects, setProjects] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let alive = true;
    getAdvocacyProjects().then((data) => alive && setProjects(data));
    return () => {
      alive = false;
    };
  }, []);

  if (active) {
    return (
      <Modal title={active.title} onClose={() => setActive(null)}>
        {active.description && <p className="explorer-meta">{active.description}</p>}
        <div className="explorer-parchment-body">{active.body}</div>
      </Modal>
    );
  }

  return (
    <Modal title={section.title} onClose={onClose}>
      <p className="explorer-intro">Roots run further than they look from the surface.</p>
      {!projects && <p>Following the roots…</p>}
      <ul className="explorer-list">
        {projects?.map((p) => (
          <li key={p.id}>
            <button className="explorer-list__item" data-interactive="true" onClick={() => setActive(p)}>
              <strong>{p.title}</strong>
              <span>{p.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
