import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import { useRacha } from '../hooks/useRacha';
import { trackEvent, trackError } from '../analytics';

const SESIONES = {
  1: {
    sesionKey: 'respiracion',
    videoId: 'AP5qWR0b7s8',
    audio: '/audio1.mp3',
    numero: 1,
    tituloLinea1: 'Respiración,',
    tituloLinea2: 'la base de todo',
    desc: 'Aprende a usar la respiración como ancla al momento presente. El primer paso de toda práctica meditativa. 12 minutos que pueden cambiar tu día.',
  },
  2: {
    sesionKey: 'imaginacion',
    videoId: 'djwiUqtJZ1U',
    audio: '/audio2.mp3',
    numero: 2,
    tituloLinea1: 'Imaginación',
    tituloLinea2: 'que purifica',
    desc: 'Usa la imaginación como herramienta de sanación: visualiza una luz que recorre tu cuerpo y libera lo que ya no necesitas cargar. Basada en los principios de Neville Goddard, Joe Dispenza y Louise Hay.',
  },
};

function Sesion({ onNavigate, user, sesionId }) {
  const ses = SESIONES[sesionId] || SESIONES[1];
  const [modo, setModo] = useState('video');
  const [showModal, setShowModal] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { marcarCompletada, guardarRating } = useRacha(user, 'meditacion');

  const handleCompletada = () => {
    trackEvent('sesion_completada', { tipo: 'meditacion', sesion: ses.sesionKey, modo });
    marcarCompletada();
    setShowModal(true);
  };

  const guardarOffline = async () => {
    if (guardado) return;
    try {
      const cache = await caches.open('umbral-v3');
      await cache.add(ses.audio);
      setGuardado(true);
      trackEvent('audio_guardado_offline', { sesion: ses.sesionKey });
    } catch (err) {
      trackError(err, { origen: 'guardarOffline Sesion' });
    }
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="back-btn" onClick={() => onNavigate('meditaciones')}>
          ← Volver
        </div>

        {modo === 'video' ? (
          <>
            <div className="video-box">
              <iframe
                src={`https://www.youtube.com/embed/${ses.videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${ses.tituloLinea1} ${ses.tituloLinea2}`}
              />
            </div>
            <div className="sess-tag">SESIÓN {ses.numero} · COMIENZA A MEDITAR</div>
            <div className="sess-title">{ses.tituloLinea1}<br />{ses.tituloLinea2}</div>
            <div className="sess-desc">
              {ses.desc}
            </div>
            <button className="btn-sec" onClick={() => setModo('audio')}>
              🎧 Solo audio
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={handleCompletada}>
              ✓ Marcar como completada
            </button>
          </>
        ) : (
          <>
            <div className="audio-player">
              <div className="audio-label">🎧 SOLO AUDIO</div>
              <audio controls controlsList="nodownload">
                <source src={ses.audio} type="audio/mpeg" />
              </audio>
              <div
                onClick={guardarOffline}
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 12,
                  color: guardado ? '#8A7A6E' : '#C4977A',
                  cursor: guardado ? 'default' : 'pointer',
                  opacity: guardado ? 0.6 : 1
                }}
              >
                {guardado ? '✓ Audio guardado sin conexión' : '📥 Guardar audio para escuchar sin conexión'}
              </div>
            </div>

            <div className="sess-tag">SESIÓN {ses.numero} · COMIENZA A MEDITAR</div>
            <div className="sess-title">{ses.tituloLinea1}<br />{ses.tituloLinea2}</div>
            <div className="sess-desc">
              {ses.desc}
            </div>
            <button className="btn-sec" onClick={() => setModo('video')}>
              ▶ Ver sesión completa
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={handleCompletada}>
              ✓ Marcar como completada
            </button>
          </>
        )}

      </div>

      <nav className="nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <div className="nav-icon">🏠</div>
          <div className="nav-text">Inicio</div>
        </div>
        <div className="nav-item active">
          <div className="nav-icon">🧘</div>
          <div className="nav-text">Meditar</div>
        </div>
        <div className="nav-item" onClick={() => onNavigate('apoyar')}>
          <div className="nav-icon">💛</div>
          <div className="nav-text">Apoyar</div>
        </div>
      </nav>

      <CompletadaModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(rating) => {
          trackEvent('sesion_rating', { tipo: 'meditacion', sesion: ses.sesionKey, rating });
          guardarRating(rating);
        }}
      />
    </div>
  );
}

export default Sesion;