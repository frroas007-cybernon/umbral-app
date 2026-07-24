import React from 'react';

function ApoyoGraciasModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-emoji">💛</div>
        <div className="modal-estado">GRACIAS</div>
        <div className="modal-frase">
          Tu aporte ayuda a que Umbral siga siendo gratuita para todos. De corazón, gracias por sumarte.
        </div>
        <button className="btn-main" onClick={onClose}>
          Volver a Umbral
        </button>
      </div>
    </div>
  );
}

export default ApoyoGraciasModal;
