import React from 'react';

const afirmaciones = [
  {
    id: 1,
    emoji: '🌊',
    titulo: '1. Calma',
    duracion: '10 min',
    tipo: 'Libre',
    free: true,
    color: '#7AACB5',
    videoId: 'AP5qWR0b7s8'
  },
 {
   id: 2,
   emoji: '🦁',
   titulo: '2. Confianza',
   duracion: '12 min',
   tipo: 'Próximamente',
   free: false,
   color: '#C4977A'
 },
 {
   id: 3,
   emoji: '🌟',
   titulo: '3. Abundancia',
   duracion: '15 min',
   tipo: 'Próximamente',
   free: false,
   color: '#C4977A'
 },
];

function Afirmaciones({ onNavigate }) {
  return (
    <div className="screen">
      <div className="screen-content">

        <div className="page-title">Afirmaciones</div>

        <div className="program-card">
          <div className="program-tag">PROGRAMA · 3 SESIONES</div>
          <div className="program-title">Reprograma tu subconsciente</div>
          <div className="program-sub">Frases diseñadas para transformar tu mente desde adentro.</div>
          <div className="prog-bar-bg">
            <div className="prog-bar-fill" style={{ width: '0%' }} />
          </div>
          <div className="prog-meta">0 de 3 sesiones completadas</div>
        </div>

        <div className="sessions-label">SESIONES</div>

        {afirmaciones.map(s => (
          <div
            key={s.id}
            className={`session-row ${s.free ? 'free' : 'locked'}`}
            onClick={() => s.free && onNavigate('afirmacion-detalle')}
          >
            <div className="s-icon" style={{ background: s.color }}>{s.emoji}</div>
            <div className="s-info">
              <div className="s-title">{s.titulo}</div>
              <div className="s-meta">{s.duracion} · {s.tipo}</div>
            </div>
            <div className="s-action">{s.free ? '▶' : '🔒'}</div>
          </div>
        ))}

      </div>

      <nav className="nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <div className="nav-icon">🏠</div>
          <div className="nav-text">Inicio</div>
        </div>
        <div className="nav-item" onClick={() => onNavigate('meditaciones')}>
          <div className="nav-icon">🧘</div>
          <div className="nav-text">Meditar</div>
        </div>
        <div className="nav-item" onClick={() => onNavigate('perfil')}>
          <div className="nav-icon">👤</div>
          <div className="nav-text">Perfil</div>
        </div>
      </nav>
    </div>
  );
}

export default Afirmaciones;