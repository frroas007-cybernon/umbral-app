import React, { useState } from 'react';
import CompletadaModal from './CompletadaModal';
import Reproductor from './Reproductor';
import Volver from './Volver';
import { useRacha } from '../hooks/useRacha';
import { trackEvent, trackError } from '../analytics';

// Caché propia para los audios guardados sin conexión. El service worker no la
// borra al actualizarse (ver public/sw.js).
const CACHE_AUDIO = 'umbral-audio';

// Pantalla de una sesión guiada: la foto ocupa la parte de arriba, el título
// entra sobre ella y abajo queda el reproductor. Escuchar es lo principal
// (se medita con los ojos cerrados); el video queda como alternativa.
function SesionRitual({
  onNavigate, user, tipo, sesionKey,
  imagen, imagenPos = '50% 50%',
  volverA, volverTexto,
  titulo, meta, desc,
  audio, videoId, chips, guia,
}) {
  const tieneAudio = Boolean(audio);
  const [modo, setModo] = useState(tieneAudio ? 'audio' : 'video');
  const [videoActivo, setVideoActivo] = useState(tieneAudio);
  const [showModal, setShowModal] = useState(false);
  const [completada, setCompletada] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [proporcion, setProporcion] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const { marcarCompletada, guardarRating } = useRacha(user, tipo);

  const completar = (origen) => {
    if (completada) return;
    setCompletada(true);
    trackEvent('sesion_completada', { tipo, sesion: sesionKey, modo, origen });
    marcarCompletada();
    setShowModal(true);
  };

  const guardarOffline = async () => {
    if (guardado) return;
    try {
      const cache = await caches.open(CACHE_AUDIO);
      await cache.add(audio);
      setGuardado(true);
      trackEvent('audio_guardado_offline', { sesion: sesionKey });
    } catch (err) {
      trackError(err, { origen: `guardarOffline ${sesionKey}` });
    }
  };

  const tituloPlano = Array.isArray(titulo) ? titulo.join(' ') : titulo;

  // Compartir: siempre el enlace público de esta pantalla (también desde la app instalada).
  const compartir = async () => {
    const url = `https://www.umbralapp.lat${window.location.pathname}`;
    const texto = `${tituloPlano}, en Umbral`;
    trackEvent('clase_compartida', { tipo, sesion: sesionKey });
    try {
      if (navigator.share) {
        await navigator.share({ title: texto, text: `Te comparto esta práctica: ${texto}`, url });
        return;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      window.prompt('Copia este enlace:', url);
      return;
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="screen ritual">
      <div className="ritual-hero" style={proporcion ? { aspectRatio: proporcion, height: 'auto' } : undefined}>
        <img
          src={imagen}
          alt=""
          style={{ objectPosition: imagenPos }}
          onLoad={(e) => setProporcion(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
        />
        <Volver texto={volverTexto} onClick={() => onNavigate(volverA)} sobreFoto />
      </div>

      <div className="ritual-cuerpo">
        <h1 className="ritual-titulo">
          {Array.isArray(titulo) ? titulo.map((l, i) => <span key={i}>{l}</span>) : titulo}
        </h1>
        <div className="ritual-meta">{meta}</div>
        {chips && (
          <div className="chips ritual-chips">
            {chips.map((c) => <span key={c} className="chip">{c}</span>)}
          </div>
        )}

        {tieneAudio && videoId && (
          <div className="segmento" role="group" aria-label="Cómo quieres practicar">
            <button type="button" aria-pressed={modo === 'audio'} onClick={() => setModo('audio')}>Escuchar</button>
            <button type="button" aria-pressed={modo === 'video'} onClick={() => { setModo('video'); trackEvent('video_elegido', { sesion: sesionKey }); }}>Ver video</button>
          </div>
        )}

        {modo === 'audio' ? (
          <Reproductor
            src={audio}
            titulo={tituloPlano}
            imagen={imagen}
            onPlay={() => trackEvent('audio_reproducido', { sesion: sesionKey })}
            onTermino={() => completar('fin_audio')}
          />
        ) : !videoActivo ? (
          <button
            type="button"
            className="btn-main"
            onClick={() => { setVideoActivo(true); trackEvent('video_reproducido', { tipo, sesion: sesionKey }); }}
          >
            Comenzar clase
          </button>
        ) : (
          <div className="video-box">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${tieneAudio ? '' : '&autoplay=1'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={tituloPlano}
            />
          </div>
        )}

        <p className="ritual-desc">{desc}</p>

        {guia && (
          <a
            className="guia"
            href={`https://www.instagram.com/${guia.usuario}/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir el Instagram de ${guia.nombre}, @${guia.usuario}`}
            onClick={() => trackEvent('instagram_guia', { guia: guia.usuario, sesion: sesionKey })}
          >
            <img src={guia.foto} alt="" />
            <span className="guia-texto">
              <span className="guia-quien">Te guía {guia.nombre}, síguele en Instagram</span>
              <span className="guia-ig">@{guia.usuario}</span>
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M8 16L16 8M10 8h6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'none', stroke: 'currentColor' }} />
            </svg>
          </a>
        )}

        <button type="button" className="guia compartir" onClick={compartir}>
          <span className="compartir-icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'none', stroke: 'currentColor' }} />
            </svg>
          </span>
          <span className="guia-texto">
            <span className="guia-quien">{copiado ? 'Enlace copiado' : 'Compartir esta práctica'}</span>
            <span className="guia-ig">{copiado ? 'Pégalo donde quieras enviarlo' : 'Envía el enlace directo a quien quieras'}</span>
          </span>
        </button>

        <div className="ritual-acciones">
          <button type="button" className="btn-sec" onClick={() => completar('boton')} disabled={completada}>
            {completada ? 'Sesión completada' : 'Marcar como completada'}
          </button>
          {modo === 'audio' && (
            <button type="button" className="btn-texto" onClick={guardarOffline} disabled={guardado}>
              {guardado ? 'Guardada para escuchar sin conexión' : 'Guardar para escuchar sin conexión'}
            </button>
          )}
        </div>
      </div>

      <CompletadaModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(rating) => {
          trackEvent('sesion_rating', { tipo, sesion: sesionKey, rating });
          guardarRating(rating);
        }}
      />
    </div>
  );
}

export default SesionRitual;
