import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Folder from "../ui/Folder";
import { getLaptopFolders } from "../../data/contentApi";

export default function LaptopExplorer({ section, onClose }) {
  const [folders, setFolders] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let alive = true;
    getLaptopFolders().then((data) => alive && setFolders(data));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Modal title={section.title} onClose={onClose} wide>
      <p className="explorer-intro">
        The screen flickers awake — a little dusty, still working. Everything here is organized into
        folders, same as it always was.
      </p>

      {!folders && <p>Waking the machine…</p>}

      {folders && folders.length === 0 && (
        <p>No folders yet. Add rows to <code>portfolio_folders</code> in Supabase to fill this screen.</p>
      )}

      {folders?.map((folder) => (
        <Folder key={folder.id} folder={folder} onOpenItem={setActiveItem} />
      ))}

      {activeItem && (
        <Modal title={activeItem.title} onClose={() => setActiveItem(null)}>
          {activeItem.description && <p>{activeItem.description}</p>}
          {activeItem.tools?.length > 0 && (
            <p>
              <strong>Tools:</strong> {activeItem.tools.join(", ")}
            </p>
          )}
          {activeItem.outcome && (
            <p>
              <strong>Outcome:</strong> {activeItem.outcome}
            </p>
          )}
          {activeItem.link && (
            <p>
              <a href={activeItem.link} target="_blank" rel="noreferrer">
                View more →
              </a>
            </p>
          )}
        </Modal>
      )}
    </Modal>
  );
}
