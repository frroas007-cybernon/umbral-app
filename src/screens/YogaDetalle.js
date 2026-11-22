import React from 'react';
import SesionRitual from '../components/SesionRitual';

const CATY = { nombre: 'Caty', usuario: 'eres_masdeloquecrees', foto: '/ritual/guia-caty.webp' };

// Clases de yoga. Para sumar una nueva: sus datos aquí, su dirección en routes.js
// (YOGA_SLUG) y "free: true" en la lista de Yoga.
export const CLASES_YOGA = {
  1: {
    sesionKey: 'conecta-cuerpo',
    titulo: ['Conecta', 'con tu cuerpo'],
    minutos: 11,
    imagen: '/ritual/yoga-clase-1.webp',
    imagenPos: '50% 40%',
    chips: ['Todos los niveles', 'Necesitas un mat'],
    desc: 'Una clase corta pensada para todos los niveles. Movimientos simples para volver a habitar tu cuerpo y bajar la velocidad de la mente.',
    videoId: 'FyG_JPitzUA',
  },
  2: {
    sesionKey: 'movimiento-libera',
    titulo: ['Movimiento', 'que libera'],
    minutos: 13,
    imagen: '/ritual/yoga-clase-2.webp',
    imagenPos: '50% 40%',
    chips: ['Todos los niveles', 'Necesitas un mat'],
    desc: 'PENDIENTE',
    videoId: 'PENDIENTE',
  },
};

function YogaDetalle({ onNavigate, user, claseId }) {
  const numero = CLASES_YOGA[claseId] ? Number(claseId) : 1;
  const clase = CLASES_YOGA[numero];
  return (
    <SesionRitual
      key={clase.sesionKey}
      onNavigate={onNavigate}
      user={user}
      tipo="yoga"
      sesionKey={clase.sesionKey}
      imagen={clase.imagen}
      imagenPos={clase.imagenPos}
      volverA="yoga"
      volverTexto="Yoga"
      titulo={clase.titulo}
      meta={`Clase ${numero} de 3, ${clase.minutos} minutos`}
      chips={clase.chips}
      desc={clase.desc}
      videoId={clase.videoId}
      guia={CATY}
    />
  );
}

export default YogaDetalle;
