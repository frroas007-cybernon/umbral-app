import React from 'react';

// Pantalla de lista de un programa (Meditaciones, Afirmaciones, Yoga).
// Las sesiones van numeradas porque el programa es una secuencia.
function IconoPlay() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#E8D5B7" />
      <path d="M16 13v14l11-7z" fill="#3D3530" />
    </svg>
  );
}

function Programa({ imagen, imagenPos, titulo, subtitulo, unidad, items, colorNumero, onAbrir }) {
  const disponibles = items.filter(s => s.free);
  const primera = disponibles[0];

  return (
    <>
      <div className="program-card con-foto">
        <img src={imagen} alt="" style={{ objectPosition: imagenPos || 'center' }} />
        <div className="program-card-body">
          <h2 className="program-title">{titulo}</h2>
          <div className="program-sub">{subtitulo}</div>
          <div className="prog-meta">{items.length} {unidad}</div>
          {primera && (
            <button type="button" className="hoy-btn" onClick={() => onAbrir(primera)}>
              Comenzar
            </button>
          )}
        </div>
      </div>

      <div className="sessions-label">{unidad.charAt(0).toUpperCase() + unidad.slice(1)}</div>

      {items.map((s, i) => {
        const contenido = (
          <>
            <span
              className="s-num"
              style={s.free ? { background: colorNumero, color: '#FFFFFF' } : undefined}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="s-info">
              <span className="s-title">{s.titulo}</span>
              <span className="s-meta">
                {s.duracion}
                {!s.free && <span className="s-pronto">Próximamente</span>}
              </span>
            </span>
            {s.free && <span className="s-action"><IconoPlay /></span>}
          </>
        );
        return s.free ? (
          <button key={s.id} type="button" className="session-row free" onClick={() => onAbrir(s)}>
            {contenido}
          </button>
        ) : (
          <div key={s.id} className="session-row locked" aria-disabled="true">
            {contenido}
          </div>
        );
      })}
    </>
  );
}

export default Programa;
