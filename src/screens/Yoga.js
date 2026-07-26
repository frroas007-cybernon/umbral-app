import React from 'react';
import ApoyoBanner from '../components/ApoyoBanner';

const clases = [
  { id: 1, emoji: '🧘', titulo: '1. Conecta con tu cuerpo', duracion: '11 min', tipo: 'Libre', free: true, color: '#7AACB5' },
  { id: 2, emoji: '🌀', titulo: '2. Movimiento que libera', duracion: '13 min', tipo: 'Próximamente', free: false, color: '#C4977A' },
  { id: 3, emoji: '🌳', titulo: '3. Equilibrio que sostiene', duracion: '12 min', tipo: 'Próximamente', free: false, color: '#C4977A' },
];

function Yoga({ onNavigate, user }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="page-title">Yoga</div>

        <div className="program-card">
          <div className="program-tag">PROGRAMA · 3 CLASES</div>
          <div className="program-title">Clases de yoga</div>
          <div className="program-sub">Mueve tu cuerpo con intención y presencia.</div>
          <div className="prog-bar-bg">
            <div className="prog-bar-fill" style={{ width: '0%' }} />
          </div>
          <div className="prog-meta">0 de 3 clases completadas</div>
        </div>

        <div className="sessions-label">CLASES</div>

        {clases.map(s => (
          <div
            key={s.id}
            className={`session-row ${s.free ? 'free' : 'locked'}`}
            onClick={() => s.free && onNavigate('yoga-detalle')}
          >
            <div className="s-icon" style={{ background: s.color }}>{s.emoji}</div>
            <div className="s-info">
              <div className="s-title">{s.titulo}</div>
              <div className="s-meta">{s.duracion} · {s.tipo}</div>
            </div>
            <div className="s-action">{s.free ? '▶' : '🔒'}</div>
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <ApoyoBanner user={user} />
        </div>

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

export default Yoga;
