import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../theme/ThemeContext";
import "./modal.css";

export default function Modal({ title, onClose, children, wide }) {
  const { reducedMotion } = useTheme();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className={`modal-panel ${wide ? "is-wide" : ""}`}
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <div className="modal-panel__header">
            <h2>{title}</h2>
            <button ref={closeRef} className="modal-panel__close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
          <div className="modal-panel__body">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
