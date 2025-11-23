import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const root = document.getElementById('modal-root') || document.body;

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    // Відключаємо прокрутку сторінки
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      // Відновлюємо прокрутку сторінки
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    root
  );
}
