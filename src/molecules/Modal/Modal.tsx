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

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = isOpen ? (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <Panel>
            <button
              type="button"
              className="absolute top-5 right-5 z-50"
              onClick={handleCloseClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
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
