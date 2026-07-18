import React, { useState } from 'react';

function CompletadaModal({ visible, onClose, onConfirm }) {
  const [rating, setRating] = useState(0);

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(rating);
    setRating(0);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-emoji">🌅</div>
        <div className="modal-estado">SESIÓN COMPLETADA</div>
        <div className="modal-frase">¿Cómo estuvo la sesión?</div>

        {/* Rating */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '20px 0 28px' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <div
              key={star}
              onClick={() => setRating(star)}
              style={{
                fontSize: 32,
                cursor: 'pointer',
                opacity: star <= rating ? 1 : 0.25,
                transition: 'opacity 0.15s'
              }}
            >
              ⭐
            </div>
          ))}
        </div>

        <button className="btn-main" onClick={handleConfirm}>
          Guardar
        </button>
        <button className="btn-sec" style={{ marginTop: 10 }} onClick={onClose}>
          Ahora no
        </button>
      </div>
    </div>
  );
}

export default CompletadaModal;