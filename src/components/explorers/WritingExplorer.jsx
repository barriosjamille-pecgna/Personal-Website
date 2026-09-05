import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getWritings } from "../../data/contentApi";

export default function WritingExplorer({ section, onClose }) {
  const [writings, setWritings] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let alive = true;
    getWritings().then((data) => alive && setWritings(data));
    return () => {
      alive = false;
    };
  }, []);

  if (active) {
    return (
      <Modal title={active.title} onClose={() => setActive(null)}>
        <p className="explorer-meta">
          {active.category} · {new Date(active.date).toLocaleDateString()}
        </p>
        <div className="explorer-parchment-body">{active.body}</div>
        {active.tags?.length > 0 && <p className="explorer-tags">{active.tags.join(" · ")}</p>}
      </Modal>
    );
  }

  return (
    <Modal title={section.title} onClose={onClose}>
      <p className="explorer-intro">Pages, mostly dry, held open with a smooth stone.</p>
      {!writings && <p>Turning pages…</p>}
      <ul className="explorer-list">
        {writings?.map((w) => (
          <li key={w.id}>
            <button className="explorer-list__item" data-interactive="true" onClick={() => setActive(w)}>
              <strong>{w.title}</strong>
              <span>
                {w.category} · {new Date(w.date).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
