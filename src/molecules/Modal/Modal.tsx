import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Panel from "@/atoms/Panel";
import Backdrop from "@/atoms/Backdrop";
import { ModalProps } from "./Modal.types";

import styles from "./Modal.module.css";

function Modal(props: ModalProps) {
  const { isOpen, onClose, children } = props;
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Lock / unlock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = isOpen ? (
    <>
      {/* Backdrop — clickable to close */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998]"
        onClick={handleCloseClick}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <Panel>
            <button
              type="button"
              className="absolute top-4 right-4 z-50 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleCloseClick}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className={styles.modalBody}>{children}</div>
          </Panel>
        </div>
      </div>
    </>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modalSlot") as Element
    );
  }

  return null;
}

export default Modal;
