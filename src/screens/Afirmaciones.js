import React from 'react';
import NavBar from '../components/NavBar';
import Programa from '../components/Programa';

const afirmaciones = [
  {
    id: 1,
    emoji: '🌊',
    titulo: 'Calma',
    duracion: '10 min',
    tipo: 'Libre',
    free: true,
    color: '#7AACB5',
    videoId: 'AP5qWR0b7s8'
  },
 {
   id: 2,
   emoji: '🦁',
   titulo: 'Confianza',
   duracion: '12 min',
   tipo: 'Próximamente',
   free: false,
   color: '#C4977A'
 },
 {
   id: 3,
   emoji: '🌟',
   titulo: 'Abundancia',
   duracion: '15 min',
   tipo: 'Próximamente',
   free: false,
   color: '#C4977A'
 },
];

function Afirmaciones({ onNavigate, user }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="page-title">Afirmaciones</div>

        <Programa
          imagen="/financiamiento/foto-afirmaciones.jpg"
          imagenPos="50% 40%"
          tag="3 sesiones"
          titulo="Reprograma tu subconsciente"
          subtitulo="Frases diseñadas para transformar tu mente desde adentro."
          unidad="sesiones"
          items={afirmaciones}
          colorNumero="var(--mar-fuerte)"
          onAbrir={() => onNavigate('afirmacion-detalle')}
        />

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />
    </div>
  );
}

export default Afirmaciones;