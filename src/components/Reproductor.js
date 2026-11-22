import React, { useEffect, useRef, useState } from 'react';
import { vibrar } from '../vibrar';

const R = 58;
const VUELTA = 2 * Math.PI * R;

function formato(seg) {
  if (!isFinite(seg) || seg < 0) return '0:00';
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function IconoPlay() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" style={{ fill: 'var(--fondo)' }} />
    </svg>
  );
}

function IconoPausa() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <rect x="6.5" y="5" width="4" height="14" rx="1.2" style={{ fill: 'var(--fondo)' }} />
      <rect x="13.5" y="5" width="4" height="14" rx="1.2" style={{ fill: 'var(--fondo)' }} />
    </svg>
  );
}

// Reproductor de audio propio: un anillo que se llena a medida que avanza la
// sesión, con el botón de reproducir al centro. Funciona con la pantalla
// bloqueada (Media Session) y avisa cuando el audio termina.
function Reproductor({ src, titulo, imagen, onPlay, onTermino }) {
  const audioRef = useRef(null);
  const [sonando, setSonando] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!('mediaSession' in navigator) || typeof window.MediaMetadata !== 'function') return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: titulo,
      artist: 'Umbral',
      artwork: imagen ? [{ src: imagen, sizes: '512x512', type: 'image/jpeg' }] : [],
    });
  }, [titulo, imagen]);

  const alternar = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      setCargando(true);
      setError(false);
      try {
        await a.play();
        vibrar(12);
        if (onPlay) onPlay();
      } catch (e) {
        setError(true);
      } finally {
        setCargando(false);
      }
    } else {
      a.pause();
    }
  };

  const saltar = (seg) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + seg));
  };

  const progreso = duracion > 0 ? tiempo / duracion : 0;

  return (
    <div className={`reproductor ${sonando ? 'sonando' : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
        onTimeUpdate={(e) => setTiempo(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuracion(isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)}
        onDurationChange={(e) => { if (isFinite(e.currentTarget.duration)) setDuracion(e.currentTarget.duration); }}
        onWaiting={() => setCargando(true)}
        onPlaying={() => setCargando(false)}
        onEnded={() => {
          setSonando(false);
          vibrar([20, 80, 20]);
          if (onTermino) onTermino();
        }}
      />

      <div className="rep-fila">
        <button type="button" className="rep-salto" onClick={() => saltar(-15)} aria-label="Retroceder 15 segundos">
          −15 s
        </button>

        <div className="rep-anillo">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r={R} className="rep-pista" />
            <circle
              cx="70" cy="70" r={R}
              className="rep-avance"
              style={{ strokeDasharray: VUELTA, strokeDashoffset: VUELTA * (1 - progreso) }}
            />
          </svg>
          <button
            type="button"
            className="rep-play"
            onClick={alternar}
            aria-label={sonando ? 'Pausar' : 'Reproducir'}
            aria-busy={cargando}
          >
            {sonando ? <IconoPausa /> : <IconoPlay />}
          </button>
        </div>

        <button type="button" className="rep-salto" onClick={() => saltar(15)} aria-label="Adelantar 15 segundos">
          +15 s
        </button>
      </div>

      <input
        type="range"
        className="rep-barra"
        min="0"
        max={duracion || 0}
        step="1"
        value={tiempo}
        onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }}
        aria-label="Posición en el audio"
        aria-valuetext={`${formato(tiempo)} de ${formato(duracion)}`}
        style={{ '--avance': `${progreso * 100}%` }}
      />
      <div className="rep-tiempos">
        <span>{formato(tiempo)}</span>
        <span>{duracion ? `−${formato(duracion - tiempo)}` : ''}</span>
      </div>
      {error && <div className="rep-error" role="alert">No se pudo reproducir el audio. Revisa tu conexión e inténtalo de nuevo.</div>}
    </div>
  );
}

export default Reproductor;
