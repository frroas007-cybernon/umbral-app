import React, { useState } from 'react';
import CompletadaModal from '../components/CompletadaModal';
import { useRacha } from '../hooks/useRacha';
import { trackEvent } from '../analytics';
import NavBar from '../components/NavBar';

const VIDEO_ID = 'FyG_JPitzUA';

function YogaDetalle({ onNavigate, user }) {
  const [showModal, setShowModal] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const { marcarCompletada, guardarRating } = useRacha(user, 'yoga');

  const handleCompletada = () => {
    trackEvent('sesion_completada', { tipo: 'yoga', sesion: 'conecta-cuerpo' });
    marcarCompletada();
    setShowModal(true);
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <button type="button" className="back-btn" style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }} onClick={() => onNavigate('yoga')}>
          ‹ Yoga
        </button>

        <div className="poster">
          {reproduciendo ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&autoplay=1&playsinline=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Conecta con tu cuerpo"
            />
          ) : (
            <>
              <img src="/yoga2.png" alt="Profesora en postura del guerrero sobre un mat en el pasto" style={{ objectPosition: '55% 25%' }} />
              <button
                type="button"
                className="poster-play"
                aria-label="Reproducir clase"
                onClick={() => { trackEvent('video_reproducido', { tipo: 'yoga', sesion: 'conecta-cuerpo' }); setReproduciendo(true); }}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" style={{ fill: 'var(--tinta)' }} /></svg>
              </button>
              <span className="poster-dur">11 min</span>
            </>
          )}
        </div>

        <h1 className="sess-title" style={{ fontWeight: 500 }}>Conecta con tu cuerpo</h1>
        <div className="chips">
          <span className="chip">Clase 1 de 3</span>
          <span className="chip">11 min</span>
          <span className="chip">Todos los niveles</span>
          <span className="chip">Necesitas un mat</span>
        </div>
        <div className="sess-desc">
          Una clase corta pensada para todos los niveles. Movimientos simples para volver a habitar tu cuerpo y bajar la velocidad de la mente.
        </div>
        <div style={{ marginTop: 'auto' }}>
          {!reproduciendo && (
            <button className="btn-main" onClick={() => { trackEvent('video_reproducido', { tipo: 'yoga', sesion: 'conecta-cuerpo' }); setReproduciendo(true); }}>
              Comenzar clase
            </button>
          )}
          <button className="btn-sec" onClick={handleCompletada}>
            Marcar como completada
          </button>
        </div>

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />

      <CompletadaModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(rating) => {
          trackEvent('sesion_rating', { tipo: 'yoga', sesion: 'conecta-cuerpo', rating });
          guardarRating(rating);
        }}
      />
    </div>
  );
}

export default YogaDetalle;
