import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./folder.css";

// Reusable animated folder: custom name/description/color/icon/list of
// files. Used by LaptopExplorer today; usable by any future explorer
// that needs the same "folder full of files" pattern.
export default function Folder({ folder, onOpenItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="folder">
      <button
        className="folder__tab"
        data-interactive="true"
        style={{ "--folder-color": folder.color }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="folder__icon" aria-hidden="true">
          <FolderGlyph color={folder.color} open={open} />
        </span>
        <span className="folder__name">{folder.name}</span>
        <span className="folder__count">{folder.items.length}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            className="folder__items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {folder.items.map((item) => (
              <li key={item.id}>
                <button className="folder__file" data-interactive="true" onClick={() => onOpenItem(item)}>
                  {item.title}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function FolderGlyph({ color, open }) {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18">
      <path
        d={open ? "M1 6 L7 6 L9 3 L21 3 L21 15 L1 15 Z" : "M1 4 L7 4 L9 6 L21 6 L21 15 L1 15 Z"}
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}
