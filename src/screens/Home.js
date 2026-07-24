import React, { useState } from 'react';
import ApoyoBanner from '../components/ApoyoBanner';
import { trackEvent } from '../analytics';

const moods = [
  { key: 'ansioso', emoji: '😣', label: 'Ansiedad' },
  { key: 'tenso', emoji: '😶', label: 'Tensión' },
  { key: 'bien', emoji: '🙂', label: 'Bienestar' },
  { key: 'tranquilo', emoji: '😌', label: 'Tranquilidad' },
  { key: 'paz', emoji: '🌿', label: 'Paz' },
];

const sesiones = [
  {
    icon: '🌬️',
    title: 'Respiración, la base de todo',
    sub: 'Meditación · Sesión 1 · Libre',
    screen: 'sesion',
    color: '#C4977A'
  },
  {
    icon: '🌊',
    title: 'Afirmaciones: Calma',
    sub: 'Afirmaciones · Sesión 1 · Libre',
    screen: 'afirmacion-detalle',
    color: '#7AACB5'
  }
];

function Home({ onNavigate, onMood, user }) {
  const [selectedMood, setSelectedMood] = useState('bien');

  const handleMood = (key) => {
    setSelectedMood(key);
    trackEvent('mood_seleccionado', { mood: key });
    onMood(key);
  };

  const diaHoy = new Date().getDay();
  const sesionDelDia = sesiones[diaHoy % 2];

  const nombreUsuario = user?.id === 'guest'
  ? null
  : user?.user_metadata?.name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || null;

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
        <div className="greeting">
          {nombreUsuario ? `Hola, ${nombreUsuario} 🌅` : 'Hola, bienvenido/a 🌅'}
        </div>
        <div className="subgreeting">¿Qué sientes hoy?</div>

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

        <div className="big-card" style={{ background: '#7AACB5' }} onClick={() => onNavigate('afirmaciones')}>
          <div className="big-card-title">Afirmaciones</div>
          <div className="big-card-sub">Reprograma tu subconsciente · 3 sesiones</div>
          <div className="big-card-emoji">✨</div>
        </div>

        {/* Yoga Hero Card */}
        <div className="yoga-hero-card">
          <img src="/yoga2.png" alt="Yoga" className="yoga-hero-img" />
          <div className="yoga-hero-overlay">
            <div className="yoga-hero-tag">YOGA · PRÓXIMAMENTE</div>
            <div className="yoga-hero-title">Clases<br />de yoga</div>
            <div className="yoga-hero-sub">Mueve tu cuerpo con intención y presencia</div>
            <div className="yoga-hero-badge">PRONTO</div>
          </div>
        </div>

        {/* Sesión del día */}
        <div className="section-title">Sesión del día</div>
        <div className="small-card" onClick={() => onNavigate(sesionDelDia.screen)}>
          <div className="small-icon" style={{ background: sesionDelDia.color }}>
            {sesionDelDia.icon}
          </div>
          <div>
            <div className="small-title">{sesionDelDia.title}</div>
            <div className="small-sub">{sesionDelDia.sub}</div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <ApoyoBanner user={user} />
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