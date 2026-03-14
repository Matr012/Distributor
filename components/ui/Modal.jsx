import { useEffect, useCallback } from 'react';

/**
 * Újrafelhasználható Modal komponens
 * Pontosan ugyanúgy néz ki mint az eredeti auth-modal
 */
export default function Modal({ show = true, title, message, success, isSuccess, onClose }) {
  // Accept both 'success' and 'isSuccess' prop names
  const isOk = success !== undefined ? success : (isSuccess !== undefined ? isSuccess : true);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && show) handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [show, handleClose]);

  if (!show) return null;

  return (
    <div
      className="auth-modal"
      style={{ display: 'flex' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="auth-modal-content">
        <span className="modal-close" onClick={handleClose}>×</span>
        <h2 id="modalTitle" style={{ color: isOk ? '#4ade80' : '#f87171' }}>{title}</h2>
        <p id="modalMessage">{message}</p>
        <button id="modalOkBtn" className="primary-btn" onClick={handleClose}>OK</button>
      </div>
    </div>
  );
}
