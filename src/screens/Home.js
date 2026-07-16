import React, { useState } from 'react';

const moods = [
  { key: 'ansioso', emoji: '😔', label: 'Ansioso' },
  { key: 'tenso', emoji: '😶', label: 'Tenso' },
  { key: 'bien', emoji: '🙂', label: 'Bien' },
  { key: 'tranquilo', emoji: '😌', label: 'Tranquilo' },
  { key: 'paz', emoji: '🌿', label: 'En paz' },
];

function Home({ onNavigate, onMood }) {
  const [selectedMood, setSelectedMood] = useState('bien');

  const handleMood = (key) => {
    setSelectedMood(key);
    onMood(key);
  };

  return (
    <div className="screen">
      <div className="screen-content">

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, marginTop: 4 }}>
          <svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" style={{ width: 100, height: 'auto' }}>
            <ellipse cx="150" cy="120" rx="42" ry="7" fill="#7AACB5" opacity="0.30"/>
            <ellipse cx="150" cy="125" rx="28" ry="4" fill="#7AACB5" opacity="0.18"/>
            <path d="M 110 114 A 40 40 0 0 1 190 114 Z" fill="#C4977A"/>
            <line x1="84" y1="114" x2="216" y2="114" stroke="#3D3530" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="150" y1="66" x2="150" y2="82" stroke="#C4977A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="129" y1="71" x2="135.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="171" y1="71" x2="164.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="111" y1="87" x2="120" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="189" y1="87" x2="180" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="92" y1="108" x2="106" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="208" y1="108" x2="194" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M 124 114 A 26 26 0 0 1 176 114 Z" fill="#7AACB5" opacity="0.22"/>
          </svg>
        </div>

        {/* Saludo */}
        <div className="greeting">Hola, Francisco 🌅</div>
        <div className="subgreeting">¿Cómo te sientes hoy?</div>

        {/* Moods */}
        <div className="moods">
          {moods.map(m => (
            <div key={m.key} className="mood" onClick={() => handleMood(m.key)}>
              <div className={`mood-circle ${selectedMood === m.key ? 'selected' : ''}`}>
                {m.emoji}
              </div>
              <div className="mood-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tu práctica */}
        <div className="section-title">Tu práctica</div>
        <div className="big-card" onClick={() => onNavigate('meditaciones')}>
          <div className="big-card-title">Meditaciones</div>
          <div className="big-card-sub">Comienza a meditar · 3 sesiones</div>
          <div className="big-card-emoji">🧘</div>
        </div>

        {/* Sesión del día */}
        <div className="section-title">Sesión del día</div>
        <div className="small-card" onClick={() => onNavigate('sesion')}>
          <div className="small-icon">🌬️</div>
          <div>
            <div className="small-title">Respiración, la base de todo</div>
            <div className="small-sub">Sesión 1 · Libre</div>
          </div>
        </div>

      </div>

      <nav className="nav">
        <div className="nav-item active">
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

export default Home;