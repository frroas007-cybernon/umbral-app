import React, { useState } from 'react';

const ETIQUETAS = ['', 'No me ayudó', 'Poco', 'Bien', 'Me ayudó', 'Me encantó'];

function Estrella({ llena }) {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
        style={{ fill: llena ? 'var(--accion)' : 'none', stroke: 'var(--accion)' }}
       
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompletadaModal({ visible, onClose, onConfirm }) {
  const [rating, setRating] = useState(0);

  if (!visible) return null;

  const cerrar = () => {
    setRating(0);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(rating);
    cerrar();
  };

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="completada-titulo" onClick={e => e.stopPropagation()}>
        <svg viewBox="0 0 260 150" width="180" height="104" role="img" aria-label="El sol sale sobre el horizonte" style={{ display: 'block', margin: '0 auto 8px' }}>
          <defs><clipPath id="hz-completada"><rect x="0" y="0" width="260" height="104" /></clipPath></defs>
          <g strokeWidth="5" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}>
            <line x1="130" y1="6" x2="130" y2="20" />
            <line x1="72" y1="22" x2="80" y2="34" /><line x1="188" y1="22" x2="180" y2="34" />
            <line x1="36" y1="58" x2="49" y2="64" /><line x1="224" y1="58" x2="211" y2="64" />
          </g>
          <g clipPath="url(#hz-completada)"><circle cx="130" cy="104" r="62" style={{ fill: 'var(--sol)' }} /></g>
          <line x1="16" y1="104" x2="244" y2="104" strokeWidth="4" strokeLinecap="round" style={{ stroke: 'var(--mar)' }} />
          <path d="M70 122 Q 95 114 120 122 T 170 122 T 210 122" fill="none" strokeWidth="3" strokeLinecap="round" opacity="0.6" style={{ stroke: 'var(--mar)' }} />
        </svg>
        <div id="completada-titulo" className="modal-frase" style={{ marginBottom: 4, fontSize: 30 }}>Sesión completada</div>
        <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--gris)', marginBottom: 12 }}>¿Cómo te sentiste?</div>

        <div className="estrellas" role="radiogroup" aria-label="Valora la sesión de 1 a 5 estrellas">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
              className="estrella"
              onClick={() => setRating(star)}
            >
              <Estrella llena={star <= rating} />
            </button>
          ))}
        </div>
        <div className="estrella-label">{ETIQUETAS[rating]}</div>

        <button className="btn-main" onClick={handleConfirm} disabled={rating === 0} style={{ opacity: rating === 0 ? 0.5 : 1 }}>
          Guardar
        </button>
        <button type="button" className="btn-texto" style={{ color: 'var(--gris)' }} onClick={cerrar}>
          Omitir
        </button>
      </div>
    </div>
  );
}

export default CompletadaModal;
