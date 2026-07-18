import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import { useRacha } from '../hooks/useRacha';

function AfirmacionDetalle({ onNavigate }) {
  const [modo, setModo] = useState('video');
  const [showModal, setShowModal] = useState(false);
  const { marcarCompletada } = useRacha();

  return (
    <div className="screen">
      <div className="screen-content">

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
        onConfirm={(rating) => marcarCompletada(rating)}
      />
    </div>
  );
}

export default AfirmacionDetalle;