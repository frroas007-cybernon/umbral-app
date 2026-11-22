import React, { useMemo, useState } from 'react';
import { trackEvent } from '../analytics';
import NavBar from '../components/NavBar';
import { momentoDelDia, saludoDelDia } from '../components/Cielo';
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

// Foto de fondo según el momento del día. Por ahora todas usan el atardecer
// real de Reñaca; las otras horas se suman cuando estén listas.
const ESCENAS = {
  amanecer: '/inicio/atardecer.jpg',
  dia: '/inicio/atardecer.jpg',
  atardecer: '/inicio/atardecer.jpg',
  noche: '/inicio/atardecer.jpg',
};

const FRASE_MOMENTO = {
  amanecer: { titulo: 'El día aún no empieza.', sub: 'Tienes unos minutos antes de que todo se mueva.' },
  dia: { titulo: 'Haz una pausa.', sub: 'Unos minutos para volver a ti en medio del día.' },
  atardecer: { titulo: 'Suelta el día.', sub: 'Lo que pasó, ya pasó. Ahora puedes bajar el ritmo.' },
  noche: { titulo: 'Es hora de bajar el ritmo.', sub: 'Prepara el cuerpo y la mente para descansar.' },
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

        <section className="escena" aria-label="Inicio">
          <img className="escena-foto" src={ESCENAS[momento]} alt="" />
          <div className="escena-velo" aria-hidden="true" />

          <div className="escena-arriba">
            <div className="escena-saludo">{primerNombre ? `${saludo}, ${primerNombre}` : saludo}</div>
            <h1 className="escena-titulo">{FRASE_MOMENTO[momento].titulo}</h1>
            <p className="escena-sub">
              {racha > 0
                ? `${FRASE_MOMENTO[momento].sub} Llevas ${racha} ${racha === 1 ? 'día' : 'días'} seguidos.`
                : FRASE_MOMENTO[momento].sub}
            </p>
          </div>

          <div className="escena-panel">
            <div className="escena-panel-etiqueta">{eleccion.titulo}</div>
            <div className="escena-panel-nombre">{practica.nombre}</div>
            <div className="escena-panel-sub">{practica.sub}</div>
            <div className="escena-panel-acciones">
              <button
                type="button"
                className="escena-comenzar"
                onClick={() => {
                  trackEvent('sugerencia_abierta', { momento, animo: animo || 'ninguno', practica: eleccion.practica });
                  onNavigate(practica.screen, practica.param);
                }}
              >
                Comenzar
              </button>
              <button type="button" className="escena-respirar" onClick={() => onNavigate('respirar')}>
                Respirar 1 min
              </button>
            </div>
          </div>
        </section>

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
        {frase && (
          <p className="animo-frase" aria-live="polite">
            {frase} Arriba te dejamos una práctica para eso.
          </p>
        )}

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
