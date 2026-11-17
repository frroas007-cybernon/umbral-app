import React, { useState } from 'react';
import { trackEvent } from '../analytics';
import NavBar from '../components/NavBar';

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
    sub: 'Meditación guiada, 12 min',
    screen: 'sesion',
    color: '#C4977A'
  },
  {
    icon: '🌊',
    title: 'Calma',
    sub: 'Afirmaciones, 10 min',
    screen: 'afirmacion-detalle',
    color: '#7AACB5'
  },
  {
    icon: '🧘',
    title: 'Conecta con tu cuerpo',
    sub: 'Clase de yoga, 11 min',
    screen: 'yoga-detalle',
    color: '#C4977A'
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
  const sesionDelDia = sesiones[diaHoy % sesiones.length];

  const nombreCompleto = user?.id === 'guest'
  ? null
  : user?.user_metadata?.name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || null;
  const primerNombre = nombreCompleto ? nombreCompleto.trim().split(/\s+/)[0] : null;

  return (
    <div className="screen">
      <div className="screen-content">

        {/* Saludo */}
        <div style={{ marginBottom: 16 }}>
          <h1 className="greeting-hola">{primerNombre ? `Hola, ${primerNombre}` : 'Hola, bienvenido/a'}</h1>
          <div className="subgreeting" style={{ marginBottom: 0 }}>¿Cómo llegas hoy?</div>
        </div>

        {/* Ánimo */}
        <div className="mood-chips">
          {moods.map(m => (
            <button
              key={m.key}
              type="button"
              className={`mood-chip ${selectedMood === m.key ? 'selected' : ''}`}
              aria-pressed={selectedMood === m.key}
              onClick={() => handleMood(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Tu sesión de hoy */}
        <h2 className="section-title">Para hoy</h2>
        <div className="hoy-card">
          <img src="/banner-umbral.jpg" alt="Umbral: Medita. Respira. Transforma." />
          <div className="hoy-body">
            <div className="hoy-title">{sesionDelDia.title}</div>
            <div className="hoy-meta">{sesionDelDia.sub}</div>
            <button type="button" className="hoy-btn" onClick={() => onNavigate(sesionDelDia.screen)}>
              Comenzar
            </button>
          </div>
        </div>

        {/* Tu práctica */}
        <h2 className="section-title">Tu práctica</h2>
        <div className="cat-grid">
          <button type="button" className="cat-card" style={{ background: 'var(--terracota-fuerte)' }} onClick={() => onNavigate('meditaciones')}>
            <img src="/financiamiento/foto-meditacion-roca-final.jpg" alt="" style={{ objectPosition: '45% 60%' }} />
            <span className="cat-card-body">
              <span className="cat-card-title">Meditaciones</span>
              <span className="cat-card-sub">3 sesiones</span>
            </span>
          </button>
          <button type="button" className="cat-card" style={{ background: 'var(--mar-fuerte)' }} onClick={() => onNavigate('afirmaciones')}>
            <img src="/financiamiento/foto-afirmaciones.jpg" alt="" style={{ objectPosition: '50% 40%' }} />
            <span className="cat-card-body">
              <span className="cat-card-title">Afirmaciones</span>
              <span className="cat-card-sub">3 sesiones</span>
            </span>
          </button>
        </div>
        <button type="button" className="cat-card wide" onClick={() => onNavigate('yoga')}>
          <img src="/yoga2.png" alt="" style={{ objectPosition: '55% 20%' }} />
          <span className="cat-card-body">
            <span className="cat-card-title">Clases de yoga</span>
            <span className="cat-card-sub">Mueve tu cuerpo con intención</span>
          </span>
        </button>

      </div>

      <NavBar active="inicio" onNavigate={onNavigate} />
    </div>
  );
}

export default Home;