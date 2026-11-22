import React, { useMemo, useState } from 'react';
import { trackEvent } from '../analytics';
import NavBar from '../components/NavBar';
import Cielo, { momentoDelDia, saludoDelDia } from '../components/Cielo';
import { frases } from '../components/MoodModal';
import { useRacha } from '../hooks/useRacha';

const moods = [
  { key: 'ansioso', label: 'Ansiedad' },
  { key: 'tenso', label: 'Tensión' },
  { key: 'bien', label: 'Bienestar' },
  { key: 'tranquilo', label: 'Tranquilidad' },
  { key: 'paz', label: 'Paz' },
];

const PRACTICAS = {
  respiracion: { nombre: 'Respiración, la base de todo', sub: 'Meditación guiada, 12 min', screen: 'sesion', param: 1, imagen: '/ritual/respiracion.jpg', pos: '55% 55%' },
  imaginacion: { nombre: 'Imaginación que purifica', sub: 'Meditación guiada, 15 min', screen: 'sesion', param: 2, imagen: '/ritual/imaginacion.jpg', pos: '50% 60%' },
  observacion: { nombre: 'Observación que libera', sub: 'Meditación guiada, 18 min', screen: 'sesion', param: 3, imagen: '/ritual/observacion.jpg', pos: '50% 35%' },
  calma: { nombre: 'Afirmaciones para la calma', sub: 'Afirmaciones, 10 min', screen: 'afirmacion-detalle', param: null, imagen: '/ritual/calma.jpg', pos: '50% 45%' },
  yoga: { nombre: 'Conecta con tu cuerpo', sub: 'Clase de yoga, 11 min', screen: 'yoga-detalle', param: null, imagen: '/yoga2.png', pos: '55% 25%' },
};

// Sugerencia según el momento del día...
const POR_MOMENTO = {
  amanecer: { titulo: 'Para empezar el día', practica: 'respiracion' },
  dia: { titulo: 'Para hoy', practica: 'yoga' },
  atardecer: { titulo: 'Para cerrar la tarde', practica: 'calma' },
  noche: { titulo: 'Para esta noche', practica: 'observacion' },
};

// ...o según cómo llega la persona, si lo elige.
const POR_ANIMO = {
  ansioso: { titulo: 'Para volver a la calma', practica: 'respiracion' },
  tenso: { titulo: 'Para soltar la tensión', practica: 'yoga' },
  bien: { titulo: 'Para sostener el bienestar', practica: 'imaginacion' },
  tranquilo: { titulo: 'Para quedarte en la calma', practica: 'calma' },
  paz: { titulo: 'Para ir más profundo', practica: 'observacion' },
};

function Home({ onNavigate, user }) {
  const [animo, setAnimo] = useState(null);
  const { racha } = useRacha(user, 'meditacion');

  const ahora = useMemo(() => new Date(), []);
  const momento = momentoDelDia(ahora);
  const saludo = saludoDelDia(ahora);

  const frase = useMemo(() => {
    if (!animo) return null;
    const lista = frases[animo].lista;
    return lista[Math.floor(Math.random() * lista.length)];
  }, [animo]);

  const eleccion = animo ? POR_ANIMO[animo] : POR_MOMENTO[momento];
  const practica = PRACTICAS[eleccion.practica];

  const elegirAnimo = (key) => {
    const nuevo = animo === key ? null : key;
    setAnimo(nuevo);
    if (nuevo) trackEvent('mood_seleccionado', { mood: nuevo });
  };

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

        <div className="portada">
          <Cielo fecha={ahora} animado />
          <div className="portada-texto">
            <h1 className="portada-saludo">{primerNombre ? `${saludo}, ${primerNombre}` : saludo}</h1>
            <div className="portada-racha">
              {racha > 0
                ? `${racha} ${racha === 1 ? 'día' : 'días'} seguidos practicando`
                : 'Hoy puede ser tu primer día'}
            </div>
          </div>
        </div>

        <h2 className="section-title animo-titulo">¿Cómo llegas?</h2>
        <div className="mood-chips">
          {moods.map(m => (
            <button
              key={m.key}
              type="button"
              className={`mood-chip ${animo === m.key ? 'selected' : ''}`}
              aria-pressed={animo === m.key}
              onClick={() => elegirAnimo(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {frase && <p className="animo-frase" aria-live="polite">{frase}</p>}

        <h2 className="section-title">{eleccion.titulo}</h2>
        <button
          type="button"
          className="sugerencia"
          onClick={() => {
            trackEvent('sugerencia_abierta', { momento, animo: animo || 'ninguno', practica: eleccion.practica });
            onNavigate(practica.screen, practica.param);
          }}
        >
          <img src={practica.imagen} alt="" style={{ objectPosition: practica.pos }} />
          <span className="sugerencia-cuerpo">
            <span>
              <span className="sugerencia-nombre">{practica.nombre}</span>
              <span className="sugerencia-sub">{practica.sub}</span>
            </span>
            <span className="sugerencia-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l10.5-6.5z" style={{ fill: 'var(--fondo)' }} /></svg>
            </span>
          </span>
        </button>

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
              <span className="cat-card-sub">1 sesión, 2 en camino</span>
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
