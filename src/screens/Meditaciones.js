import React from 'react';
import NavBar from '../components/NavBar';
import Programa from '../components/Programa';

const sesiones = [
  { id: 1, emoji: '🌬️', titulo: 'Respiración, la base de todo', duracion: '12 min', tipo: 'Libre', free: true, color: '#C4977A' },
  { id: 2, emoji: '✨', titulo: 'Imaginación que purifica', duracion: '15 min', tipo: 'Libre', free: true, color: '#7AACB5' },
  { id: 3, emoji: '👁️', titulo: 'Observación que libera', duracion: '18 min', tipo: 'Libre', free: true, color: '#7AACB5' },
];

function Meditaciones({ onNavigate, user }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="page-title">Meditaciones</div>

        <Programa
          imagen="/financiamiento/foto-meditacion-roca-final.jpg"
          imagenPos="45% 60%"
          titulo="Comienza a meditar"
          subtitulo="Tu punto de partida hacia la calma."
          unidad="sesiones"
          items={sesiones}
          colorNumero="var(--terracota-fuerte)"
          onAbrir={(s) => onNavigate('sesion', s.id)}
        />

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />
    </div>
  );
}

export default Meditaciones;