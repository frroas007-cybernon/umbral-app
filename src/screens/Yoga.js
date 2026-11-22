import React from 'react';
import NavBar from '../components/NavBar';
import Programa from '../components/Programa';

const clases = [
  { id: 1, emoji: '🧘', titulo: 'Conecta con tu cuerpo', imagen: '/yoga2.png', duracion: '11 min', tipo: 'Libre', free: true, color: 'var(--mar)' },
  { id: 2, emoji: '🌀', titulo: 'Movimiento que libera', duracion: '13 min', tipo: 'Próximamente', free: false, color: 'var(--sol)' },
  { id: 3, emoji: '🌳', titulo: 'Equilibrio que sostiene', duracion: '12 min', tipo: 'Próximamente', free: false, color: 'var(--sol)' },
];

function Yoga({ onNavigate, user }) {
  return (
    <div className="screen screen-programa">
      <div className="screen-content">

        <Programa
          nombre="Yoga"
          imagen="/yoga2.png"
          imagenPos="55% 20%"
          titulo="Clases cortas para todos los niveles"
          subtitulo="Mueve tu cuerpo con intención y presencia"
          unidad="clases"
          items={clases}
          singular="clase"
          onAbrir={() => onNavigate('yoga-detalle')}
        />

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />
    </div>
  );
}

export default Yoga;
