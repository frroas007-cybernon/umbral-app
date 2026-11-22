import React from 'react';
import SesionRitual from '../components/SesionRitual';

function YogaDetalle({ onNavigate, user }) {
  return (
    <SesionRitual
      onNavigate={onNavigate}
      user={user}
      tipo="yoga"
      sesionKey="conecta-cuerpo"
      imagen="/yoga2.webp"
      imagenPos="58% 30%"
      volverA="yoga"
      volverTexto="Yoga"
      titulo={['Conecta', 'con tu cuerpo']}
      meta="Clase 1 de 3, 11 minutos"
      chips={['Todos los niveles', 'Necesitas un mat']}
      desc="Una clase corta pensada para todos los niveles. Movimientos simples para volver a habitar tu cuerpo y bajar la velocidad de la mente."
      videoId="FyG_JPitzUA"
      guia={{ nombre: 'Caty', usuario: 'eres_masdeloquecrees', foto: '/ritual/guia-caty.webp' }}
    />
  );
}

export default YogaDetalle;
