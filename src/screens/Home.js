import React, { useState } from 'react';
import { trackEvent } from '../analytics';
import NavBar from '../components/NavBar';
import Cielo, { momentoDelDia, saludoDelDia } from '../components/Cielo';

const moods = [
  { key: 'ansioso', emoji: '😣', label: 'Ansiedad' },
  { key: 'tenso', emoji: '😶', label: 'Tensión' },
  { key: 'bien', emoji: '🙂', label: 'Bienestar' },
  { key: 'tranquilo', emoji: '😌', label: 'Tranquilidad' },
  { key: 'paz', emoji: '🌿', label: 'Paz' },
];

// Qué práctica sugerir según el momento del día.
const SUGERENCIAS = {
  amanecer: { titulo: 'Para empezar el día', nombre: 'Respiración, la base de todo', sub: 'Meditación guiada, 12 min', screen: 'sesion', param: 1, imagen: '/ritual/respiracion.jpg' },
  dia: { titulo: 'Para hoy', nombre: 'Conecta con tu cuerpo', sub: 'Clase de yoga, 11 min', screen: 'yoga-detalle', param: null, imagen: '/yoga2.png' },
  atardecer: { titulo: 'Para cerrar la tarde', nombre: 'Afirmaciones para la calma', sub: 'Afirmaciones, 10 min', screen: 'afirmacion-detalle', param: null, imagen: '/ritual/calma.jpg' },
  noche: { titulo: 'Para esta noche', nombre: 'Observación que libera', sub: 'Meditación guiada, 18 min', screen: 'sesion', param: 3, imagen: '/ritual/observacion.jpg' },
};

function Home({ onNavigate, onMood, user }) {
  const [selectedMood, setSelectedMood] = useState('bien');

  const handleMood = (key) => {
    setSelectedMood(key);
    trackEvent('mood_seleccionado', { mood: key });
    onMood(key);
  };

  const ahora = new Date();
  const sugerencia = SUGERENCIAS[momentoDelDia(ahora)];
  const saludo = saludoDelDia(ahora);

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

        <Cielo fecha={ahora} />

        {/* Saludo */}
        <div style={{ marginBottom: 16 }}>
          <h1 className="greeting-hola">{primerNombre ? `${saludo}, ${primerNombre}` : saludo}</h1>
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

        {/* Sugerencia según la hora */}
        <h2 className="section-title">{sugerencia.titulo}</h2>
        <div className="hoy-card">
          <div className="hoy-body">
            <div className="hoy-fila">
              <div>
                <div className="hoy-title">{sugerencia.nombre}</div>
                <div className="hoy-meta">{sugerencia.sub}</div>
              </div>
              <img className="hoy-foto" src={sugerencia.imagen} alt="" />
            </div>
            <button type="button" className="hoy-btn" onClick={() => { trackEvent('sugerencia_abierta', { momento: momentoDelDia(ahora) }); onNavigate(sugerencia.screen, sugerencia.param); }}>
              Comenzar
            </button>
          </div>
        </div>

        <button type="button" className="respirar-atajo" onClick={() => onNavigate('respirar')}>
          <svg viewBox="0 0 48 32" width="44" height="30" aria-hidden="true">
            <path d="M10 24a14 14 0 0 1 28 0" strokeWidth="2.5" style={{ fill: 'none', stroke: 'var(--sol)' }} />
            <line x1="4" y1="24" x2="44" y2="24" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--mar)' }} />
          </svg>
          <span>
            <span className="respirar-atajo-titulo">Un minuto para respirar</span>
            <span className="respirar-atajo-sub">Seis respiraciones lentas, guiadas</span>
          </span>
        </button>

        {/* Tu práctica */}
        <h2 className="section-title">Tu práctica</h2>
        <div className="cat-grid">
          <button type="button" className="cat-card" onClick={() => onNavigate('meditaciones')}>
            <img src="/financiamiento/foto-meditacion-roca-final.jpg" alt="" style={{ objectPosition: '45% 60%' }} />
            <span className="cat-card-body">
              <span className="cat-card-title">Meditaciones</span>
              <span className="cat-card-sub">3 sesiones</span>
            </span>
          </button>
          <button type="button" className="cat-card" onClick={() => onNavigate('afirmaciones')}>
            <img src="/ritual/calma.jpg" alt="" style={{ objectPosition: '50% 40%' }} />
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