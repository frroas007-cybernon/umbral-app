import React, { useState } from 'react';

function Sesion({ onNavigate }) {
  const [modo, setModo] = useState('video');

  return (
    <div className="screen">
      <div className="screen-content">

        <div className="back-btn" onClick={() => onNavigate('meditaciones')}>
          ← Volver
        </div>

        {/* Video o Audio */}
        {modo === 'video' ? (
          <div className="video-box">
            <iframe
              src="https://www.youtube.com/embed/AP5qWR0b7s8?rel=0&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Respiración, la base de todo"
            />
          </div>
        ) : (
          <div className="audio-player">
            <div className="audio-label">🎧 SOLO AUDIO</div>
            <audio controls controlsList="nodownload">
              <source src="/audio1.mp3" type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div className="sess-tag">SESIÓN 1 · COMIENZA A MEDITAR</div>
        <div className="sess-title">Respiración,<br />la base de todo</div>
        <div className="sess-desc">
          Aprende a usar la respiración como ancla al momento presente. 
          El primer paso de toda práctica meditativa. 12 minutos que pueden cambiar tu día.
        </div>

        <button className="btn-main" onClick={() => setModo('video')}>
          ▶ Ver sesión completa
        </button>
        <button className="btn-sec" onClick={() => setModo('audio')}>
          🎧 Escuchar solo audio
        </button>

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

export default Sesion;