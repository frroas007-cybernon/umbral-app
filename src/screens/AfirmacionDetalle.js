import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import { useRacha } from '../hooks/useRacha';
import { trackEvent, trackError } from '../analytics';
import NavBar from '../components/NavBar';

function AfirmacionDetalle({ onNavigate, user }) {
  const [modo, setModo] = useState('video');
  const [showModal, setShowModal] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { marcarCompletada, guardarRating } = useRacha(user, 'afirmacion');

  const handleCompletada = () => {
    trackEvent('sesion_completada', { tipo: 'afirmacion', sesion: 'calma', modo });
    marcarCompletada();
    setShowModal(true);
  };

  const guardarOffline = async () => {
    if (guardado) return;
    try {
      const cache = await caches.open('umbral-v3');
      await cache.add('/afirmacion-calma.mp3');
      setGuardado(true);
      trackEvent('audio_guardado_offline', { sesion: 'afirmacion-calma' });
    } catch (err) {
      trackError(err, { origen: 'guardarOffline AfirmacionDetalle' });
    }
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="back-btn" onClick={() => onNavigate('afirmaciones')}>
          ← Volver
        </div>

        {modo === 'video' ? (
          <>
            <div className="video-box">
              <iframe
                src="https://www.youtube.com/embed/nNmXbkYOE88?rel=0&modestbranding=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Afirmaciones: Calma"
              />
            </div>
            <div className="sess-title">Frases para<br />reprogramar tu subconsciente</div>
            <div className="sess-meta">Afirmaciones para la calma</div>
            <div className="sess-desc">
              Afirmaciones diseñadas para instalar la calma como tu estado natural. Escúchalas con los ojos cerrados y déjalas llegar más allá de tu mente consciente.
            </div>
            <button className="btn-sec" onClick={() => setModo('audio')}>
              Solo audio
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={handleCompletada}>
              Marcar como completada
            </button>
          </>
        ) : (
          <>
            <div className="audio-player">
              <div className="audio-label">Solo audio</div>
              <audio controls controlsList="nodownload">
                <source src="/afirmacion-calma.mp3" type="audio/mpeg" />
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
                {guardado ? 'Audio guardado para escuchar sin conexión' : 'Guardar audio para escuchar sin conexión'}
              </div>
            </div>

            <div className="sess-title">Frases para<br />reprogramar tu subconsciente</div>
            <div className="sess-meta">Afirmaciones para la calma</div>
            <div className="sess-desc">
              Afirmaciones diseñadas para instalar la calma como tu estado natural. Escúchalas con los ojos cerrados y déjalas llegar más allá de tu mente consciente.
            </div>
            <button className="btn-sec" onClick={() => setModo('video')}>
              Ver sesión completa
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={handleCompletada}>
              Marcar como completada
            </button>
          </>
        )}

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />

      <CompletadaModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(rating) => {
          trackEvent('sesion_rating', { tipo: 'afirmacion', sesion: 'calma', rating });
          guardarRating(rating);
        }}
      />
    </div>
  );
}

export default AfirmacionDetalle;