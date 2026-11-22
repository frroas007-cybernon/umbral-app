import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  respiracion: { nombre: 'Respiración, la base de todo', sub: 'Meditación guiada, 11 min', screen: 'sesion', param: 1, imagen: '/ritual/respiracion.jpg', pos: '55% 55%' },
  imaginacion: { nombre: 'Imaginación que purifica', sub: 'Meditación guiada, 15 min', screen: 'sesion', param: 2, imagen: '/ritual/imaginacion.jpg', pos: '50% 60%' },
  observacion: { nombre: 'Observación que libera', sub: 'Meditación guiada, 18 min', screen: 'sesion', param: 3, imagen: '/ritual/observacion.jpg', pos: '50% 35%' },
  calma: { nombre: 'Afirmaciones para la calma', sub: 'Afirmaciones, 10 min', screen: 'afirmacion-detalle', param: null, imagen: '/ritual/calma.jpg', pos: '50% 45%' },
  yoga: { nombre: 'Conecta con tu cuerpo', sub: 'Clase de yoga, 11 min', screen: 'yoga-detalle', param: null, imagen: '/yoga2.png', pos: '55% 25%' },
};

// Foto de fondo según el momento del día. Por ahora todas usan el atardecer
// real de Reñaca; las otras horas se suman cuando estén listas.
const ESCENAS = {
  amanecer: '/inicio/amanecer.jpg',
  dia: '/inicio/dia.jpg',
  atardecer: '/inicio/atardecer.jpg',
  noche: '/inicio/noche.jpg',
};
const ORDEN = ['amanecer', 'dia', 'atardecer', 'noche'];
const NOMBRE_MOMENTO = { amanecer: 'Amanecer', dia: 'Día', atardecer: 'Atardecer', noche: 'Noche' };
const RECORRIDO_VISTO = 'umbral_recorrido_visto';
const PASO_MS = 1500;

// La primera vez, la escena recorre el día completo y termina en la hora real.
function debeMostrarRecorrido() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !localStorage.getItem(RECORRIDO_VISTO);
  } catch (e) {
    return false;
  }
}

const FRASE_MOMENTO = {
  amanecer: { titulo: 'El día aún no empieza.', sub: 'Tienes unos minutos antes de que todo se mueva.' },
  dia: { titulo: 'Haz una pausa.', sub: 'Unos minutos para volver a ti en medio del día.' },
  atardecer: { titulo: 'Suelta el día.', sub: 'Lo que pasó, ya pasó. Ahora puedes bajar el ritmo.' },
  noche: { titulo: 'Es hora de bajar el ritmo.', sub: 'Prepara el cuerpo y la mente para descansar.' },
};

const CARRUSEL = [
  { titulo: 'Meditaciones', sub: '3 sesiones guiadas', screen: 'meditaciones', imagen: '/ritual/observacion.jpg', pos: '50% 35%' },
  { titulo: 'Afirmaciones', sub: 'Frases para la calma', screen: 'afirmaciones', imagen: '/ritual/calma.jpg', pos: '50% 40%' },
  { titulo: 'Yoga', sub: 'Clases cortas', screen: 'yoga', imagen: '/yoga2.png', pos: '58% 30%' },
  { titulo: 'Respirar', sub: 'Un minuto, guiado', screen: 'respirar', imagen: '/ritual/respiracion.jpg', pos: '60% 50%' },
];

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
  const [recorrido, setRecorrido] = useState(debeMostrarRecorrido);
  const [pasoRecorrido, setPasoRecorrido] = useState(0);
  const temporizador = useRef(null);
  const { racha } = useRacha(user, 'meditacion');

  const ahora = useMemo(() => new Date(), []);
  const momento = momentoDelDia(ahora);
  const saludo = saludoDelDia(ahora);

  const terminarRecorrido = () => {
    clearTimeout(temporizador.current);
    setRecorrido(false);
    try { localStorage.setItem(RECORRIDO_VISTO, '1'); } catch (e) { /* sin almacenamiento */ }
  };

  useEffect(() => {
    if (!recorrido) return undefined;
    if (pasoRecorrido >= ORDEN.length) {
      trackEvent('recorrido_dia_visto');
      terminarRecorrido();
      return undefined;
    }
    temporizador.current = setTimeout(() => setPasoRecorrido((p) => p + 1), PASO_MS);
    return () => clearTimeout(temporizador.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorrido, pasoRecorrido]);

  const momentoVisible = recorrido ? ORDEN[Math.min(pasoRecorrido, ORDEN.length - 1)] : momento;

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

        <section className={`escena ${recorrido ? 'en-recorrido' : ''}`} aria-label="Inicio">
          <div className="escena-fotos">
            {ORDEN.map((m) => (
              <img
                key={m}
                className={`escena-foto ${m === momentoVisible ? 'visible' : ''}`}
                src={ESCENAS[m]}
                alt=""
                loading={m === momento || recorrido ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          <div className="escena-velo" aria-hidden="true" />

          {recorrido && (
            <button type="button" className="recorrido" onClick={terminarRecorrido} aria-label="Saltar el recorrido del día">
              <span className="recorrido-nombre" key={momentoVisible}>{NOMBRE_MOMENTO[momentoVisible]}</span>
              <span className="recorrido-pasos" aria-hidden="true">
                {ORDEN.map((m, i) => <span key={m} className={i <= pasoRecorrido ? 'hecho' : ''} />)}
              </span>
              <span className="recorrido-saltar">Toca para saltar</span>
            </button>
          )}

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

        <section className="animo" aria-labelledby="animo-titulo">
          <h2 id="animo-titulo" className="bloque-titulo">¿Cómo llegas?</h2>
          <div className="animo-palabras">
            {moods.map(m => (
              <button
                key={m.key}
                type="button"
                className="animo-palabra"
                aria-pressed={animo === m.key}
                onClick={() => elegirAnimo(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          {frase && <p className="animo-cita" aria-live="polite">{frase}</p>}
        </section>

        <section aria-labelledby="practica-titulo">
          <h2 id="practica-titulo" className="bloque-titulo">Tu práctica</h2>
          <div className="carrusel">
            {CARRUSEL.map(c => (
              <button key={c.titulo} type="button" className="carrusel-item" onClick={() => onNavigate(c.screen)}>
                <img src={c.imagen} alt="" style={{ objectPosition: c.pos }} />
                <span className="carrusel-texto">
                  <span className="carrusel-titulo">{c.titulo}</span>
                  <span className="carrusel-sub">{c.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

      </div>

      <NavBar active="inicio" onNavigate={onNavigate} />
    </div>
  );
}

export default Home;
