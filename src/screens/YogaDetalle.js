import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import ApoyoBanner from '../components/ApoyoBanner';
import { useRacha } from '../hooks/useRacha';
import { trackEvent } from '../analytics';

const VIDEO_ID = 'FyG_JPitzUA';

function YogaDetalle({ onNavigate, user }) {
  const [showModal, setShowModal] = useState(false);
  const { marcarCompletada } = useRacha();

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="back-btn" onClick={() => onNavigate('yoga')}>
          ← Volver
        </div>

        <div className="video-box">
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Conecta con tu cuerpo"
          />
        </div>
        <div className="sess-tag">YOGA · CLASE 1</div>
        <div className="sess-title">Conecta con<br />tu cuerpo</div>
        <div className="sess-desc">
          Una clase corta pensada para todos los niveles. Movimientos simples para volver a habitar tu cuerpo y bajar la velocidad de la mente. 11 minutos para empezar hoy.
        </div>
        <button className="btn-main" style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
          ✓ Marcar como completada
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <ApoyoBanner user={user} />
        </div>

      </div>

      <nav className="nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <div className="nav-icon">🏠</div>
          <div className="nav-text">Inicio</div>
        </div>
        <div className="nav-item" onClick={() => onNavigate('meditaciones')}>
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
          trackEvent('sesion_completada', { tipo: 'yoga', sesion: 'conecta-cuerpo', rating });
          marcarCompletada(rating);
        }}
      />
    </div>
  );
}

export default YogaDetalle;
