import React from 'react';
import SesionRitual from '../components/SesionRitual';

function AfirmacionDetalle({ onNavigate, user }) {
  return (
    <SesionRitual
      onNavigate={onNavigate}
      user={user}
      tipo="afirmacion"
      sesionKey="calma"
      imagen="/ritual/calma.webp"
      imagenPos="50% 40%"
      volverA="afirmaciones"
      volverTexto="Afirmaciones"
      titulo={['Frases para', 'reprogramar tu subconsciente']}
      meta="Afirmaciones para la calma, 10 minutos"
      desc="Afirmaciones diseñadas para instalar la calma como tu estado natural. Escúchalas con los ojos cerrados y déjalas llegar más allá de tu mente consciente."
      audio="/afirmacion-calma.mp3"
      videoId="nNmXbkYOE88"
      guia={{ nombre: 'Francisco', usuario: 'franciscoroa.7', foto: '/ritual/guia-francisco.webp' }}
    />
  );
}

export default AfirmacionDetalle;
