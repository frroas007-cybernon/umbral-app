import React from 'react';
import SesionRitual from '../components/SesionRitual';

const SESIONES = {
  1: {
    sesionKey: 'respiracion',
    videoId: 'AP5qWR0b7s8',
    audio: '/audio1.mp3',
    numero: 1,
    titulo: ['Respiración,', 'la base de todo'],
    minutos: 12,
    imagen: '/ritual/respiracion.jpg',
    imagenPos: '55% 55%',
    desc: 'Aprende a usar la respiración como ancla al momento presente. El primer paso de toda práctica meditativa. 12 minutos que pueden cambiar tu día.',
  },
  2: {
    sesionKey: 'imaginacion',
    videoId: 'djwiUqtJZ1U',
    audio: '/audio2.mp3',
    numero: 2,
    titulo: ['Imaginación', 'que purifica'],
    minutos: 15,
    imagen: '/ritual/imaginacion.jpg',
    imagenPos: '50% 55%',
    desc: 'Usa la imaginación como herramienta de sanación: visualiza una luz que recorre tu cuerpo y libera lo que ya no necesitas cargar. Basada en los principios de Neville Goddard, Joe Dispenza y Louise Hay.',
  },
  3: {
    sesionKey: 'observacion',
    videoId: 'A-oYWoZX6g8',
    audio: '/audio3.mp3',
    numero: 3,
    titulo: ['Observación', 'que libera'],
    minutos: 18,
    imagen: '/ritual/observacion.jpg',
    imagenPos: '50% 40%',
    desc: 'Conviértete en el observador de tus pensamientos y conecta con la conciencia que hay detrás de ellos. Desde ese espacio de calma, usa la imaginación para sentir ya la realidad que quieres crear.',
  },
};

function Sesion({ onNavigate, user, sesionId }) {
  const ses = SESIONES[sesionId] || SESIONES[1];
  return (
    <SesionRitual
      key={ses.sesionKey}
      onNavigate={onNavigate}
      user={user}
      tipo="meditacion"
      sesionKey={ses.sesionKey}
      imagen={ses.imagen}
      imagenPos={ses.imagenPos}
      volverA="meditaciones"
      volverTexto="Meditaciones"
      titulo={ses.titulo}
      meta={`Sesión ${ses.numero} de 3, ${ses.minutos} minutos`}
      desc={ses.desc}
      audio={ses.audio}
      videoId={ses.videoId}
    />
  );
}

export default Sesion;
