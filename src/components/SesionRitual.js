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
  audio, videoId,
}) {
  const [modo, setModo] = useState('audio');
  const [showModal, setShowModal] = useState(false);
  const [completada, setCompletada] = useState(false);
  const [guardado, setGuardado] = useState(false);
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

  return (
    <div className="screen ritual">
      <div className="ritual-hero">
        <img src={imagen} alt="" style={{ objectPosition: imagenPos }} />
        <Volver texto={volverTexto} onClick={() => onNavigate(volverA)} sobreFoto />
      </div>

      <div className="ritual-cuerpo">
        <h1 className="ritual-titulo">
          {Array.isArray(titulo) ? titulo.map((l, i) => <span key={i}>{l}</span>) : titulo}
        </h1>
        <div className="ritual-meta">{meta}</div>

        <div className="segmento" role="group" aria-label="Cómo quieres practicar">
          <button type="button" aria-pressed={modo === 'audio'} onClick={() => setModo('audio')}>Escuchar</button>
          <button type="button" aria-pressed={modo === 'video'} onClick={() => { setModo('video'); trackEvent('video_elegido', { sesion: sesionKey }); }}>Ver video</button>
        </div>

        {modo === 'audio' ? (
          <Reproductor
            src={audio}
            titulo={tituloPlano}
            imagen={imagen}
            onPlay={() => trackEvent('audio_reproducido', { sesion: sesionKey })}
            onTermino={() => completar('fin_audio')}
          />
        ) : (
          <div className="video-box">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={tituloPlano}
            />
          </div>
        )}

        <p className="ritual-desc">{desc}</p>

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
