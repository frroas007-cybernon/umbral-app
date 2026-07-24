import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import ApoyoBanner from '../components/ApoyoBanner';
import { useRacha } from '../hooks/useRacha';
import { trackEvent, trackError } from '../analytics';

function AfirmacionDetalle({ onNavigate, user }) {
  const [modo, setModo] = useState('video');
  const [showModal, setShowModal] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { marcarCompletada } = useRacha();

  const guardarOffline = async () => {
    if (guardado) return;
    try {
      const cache = await caches.open('umbral-v2');
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
            <div className="sess-tag">AFIRMACIONES · CALMA</div>
            <div className="sess-title">Frases para<br />reprogramar tu subconsciente</div>
            <div className="sess-desc">
              Afirmaciones diseñadas para instalar la calma como tu estado natural. Escúchalas con los ojos cerrados y déjalas llegar más allá de tu mente consciente.
            </div>
            <button className="btn-sec" onClick={() => setModo('audio')}>
              🎧 Solo audio
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
              ✓ Marcar como completada
            </button>
          </>
        ) : (
          <>
            <div className="audio-player">
              <div className="audio-label">🎧 SOLO AUDIO</div>
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
                {guardado ? '✓ Audio guardado sin conexión' : '📥 Guardar audio para escuchar sin conexión'}
              </div>
            </div>

            <div className="sess-tag">AFIRMACIONES · CALMA</div>
            <div className="sess-title">Frases para<br />reprogramar tu subconsciente</div>
            <div className="sess-desc">
              Afirmaciones diseñadas para instalar la calma como tu estado natural. Escúchalas con los ojos cerrados y déjalas llegar más allá de tu mente consciente.
            </div>
            <button className="btn-sec" onClick={() => setModo('video')}>
              ▶ Ver sesión completa
            </button>
            <button className="btn-main" style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
              ✓ Marcar como completada
            </button>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <ApoyoBanner user={user} />
        </div>

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
        <div className="nav-item" onClick={() => onNavigate('perfil')}>
          <div className="nav-icon">👤</div>
          <div className="nav-text">Perfil</div>
        </div>
      </nav>

      <CompletadaModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(rating) => {
          trackEvent('sesion_completada', { tipo: 'afirmacion', sesion: 'calma', rating, modo });
          marcarCompletada(rating);
        }}
      />
    </div>
  );
}

export default AfirmacionDetalle;