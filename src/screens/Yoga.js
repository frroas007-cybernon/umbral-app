import React from 'react';
import NavBar from '../components/NavBar';
import Programa from '../components/Programa';

const clases = [
  { id: 1, emoji: '🧘', titulo: 'Conecta con tu cuerpo', duracion: '11 min', tipo: 'Libre', free: true, color: '#7AACB5' },
  { id: 2, emoji: '🌀', titulo: 'Movimiento que libera', duracion: '13 min', tipo: 'Próximamente', free: false, color: '#C4977A' },
  { id: 3, emoji: '🌳', titulo: 'Equilibrio que sostiene', duracion: '12 min', tipo: 'Próximamente', free: false, color: '#C4977A' },
];

function Yoga({ onNavigate, user }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="page-title">Yoga</div>

        <Programa
          imagen="/yoga2.png"
          imagenPos="55% 20%"
          titulo="Clases de yoga"
          subtitulo="Mueve tu cuerpo con intención y presencia."
          unidad="clases"
          items={clases}
          colorNumero="var(--terracota-fuerte)"
          onAbrir={() => onNavigate('yoga-detalle')}
        />

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />
    </div>
  );
}

export default Yoga;
