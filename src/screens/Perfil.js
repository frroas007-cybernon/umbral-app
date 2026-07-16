import React from 'react';

function Perfil({ onNavigate }) {
  return (
    <div className="screen">
      <div className="screen-content">

        <div className="page-title">Perfil</div>

        <div className="perfil-avatar">👤</div>
        <div className="perfil-nombre">Francisco Roa</div>
        <div className="perfil-plan">Plan gratuito</div>

        <div className="stat-card">
          <div className="stat-label">SESIONES COMPLETADAS</div>
          <div className="stat-valor">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">RACHA ACTUAL</div>
          <div className="stat-valor">0 días 🔥</div>
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
        <div className="nav-item active">
          <div className="nav-icon">👤</div>
          <div className="nav-text">Perfil</div>
        </div>
      </nav>
    </div>
  );
}

export default Perfil;