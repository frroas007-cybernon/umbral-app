import React from 'react';

// Botón para volver a la pantalla anterior, con el nombre de esa pantalla
// (ej. "Meditaciones"), como en las apps del sistema.
function Volver({ texto, onClick, sobreFoto = false }) {
  return (
    <button
      type="button"
      className={sobreFoto ? 'volver volver-foto' : 'volver'}
      onClick={onClick}
      aria-label={`Volver a ${texto}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M14.5 5.5L8 12l6.5 6.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'none', stroke: 'currentColor' }} />
      </svg>
      <span>{texto}</span>
    </button>
  );
}

export default Volver;
