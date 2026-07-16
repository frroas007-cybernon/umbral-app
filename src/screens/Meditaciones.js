import React from 'react';

const sesiones = [
  { id: 1, emoji: '🌬️', titulo: '1. Respiración, la base de todo', duracion: '12 min', tipo: 'Libre', free: true, color: '#C4977A' },
  { id: 2, emoji: '✨', titulo: '2. Imaginación que purifica', duracion: '15 min', tipo: 'Próximamente', free: false, color: '#7AACB5' },
  { id: 3, emoji: '👁️', titulo: '3. Observación que libera', duracion: '18 min', tipo: 'Próximamente', free: false, color: '#7AACB5' },
];

function Meditaciones({ onNavigate }) {
  return (
    <div className="screen">
      <div className="screen-content">

        <div className="page-title">Meditaciones</div>

        {/* Card programa */}
        <div className="program-card">
          <div className="program-tag">PROGRAMA · 3 SESIONES</div>
          <div className="program-title">Comienza a meditar</div>
          <div className="program-sub">Tu punto de partida hacia la calma.</div>
          <div className="prog-bar-bg">
            <div className="prog-bar-fill" style={{ width: '0%' }} />
          </div>
          <div className="prog-meta">0 de 3 sesiones completadas</div>
        </div>

        <div className="sessions-label">SESIONES</div>

        {sesiones.map(s => (
          <div
            key={s.id}
            className={`session-row ${s.free ? 'free' : 'locked'}`}
            onClick={() => s.free && onNavigate('sesion')}
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
        <div className="nav-item active">
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

export default Meditaciones;