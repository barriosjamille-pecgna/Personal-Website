import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getIllustrations } from "../../data/contentApi";

export default function IllustrationExplorer({ section, onClose }) {
  const [pieces, setPieces] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let alive = true;
    getIllustrations().then((data) => alive && setPieces(data));
    return () => {
      alive = false;
    };
  }, []);

  if (active) {
    return (
      <Modal title={active.title} onClose={() => setActive(null)}>
        {active.imageUrl ? (
          <img src={active.imageUrl} alt={active.title} loading="lazy" className="explorer-image" />
        ) : (
          <div className="explorer-image-placeholder">No image yet — add one via illustrations.image_url</div>
        )}
        <p className="explorer-meta">
          {active.category} · {new Date(active.date).toLocaleDateString()}
        </p>
        {active.description && <p>{active.description}</p>}
      </Modal>
    );
  }

  return (
    <Modal title={section.title} onClose={onClose} wide>
      <p className="explorer-intro">A sketchbook left open on the workbench, moss creeping over the edges.</p>
      {!pieces && <p>Unrolling the sketchbook…</p>}
      <div className="explorer-gallery">
        {pieces?.map((p) => (
          <button
            key={p.id}
            className="explorer-gallery__tile"
            data-interactive="true"
            onClick={() => setActive(p)}
          >
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} loading="lazy" />
            ) : (
              <span className="explorer-gallery__blank">{p.title}</span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}
