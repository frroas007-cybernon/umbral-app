import React from 'react';
import NavBar from '../components/NavBar';
import Programa from '../components/Programa';

const sesiones = [
  { id: 1, emoji: '🌬️', titulo: 'Respiración, la base de todo', imagen: '/ritual/respiracion.webp', duracion: '11 min', tipo: 'Libre', free: true, color: 'var(--sol)' },
  { id: 2, emoji: '✨', titulo: 'Imaginación que purifica', imagen: '/ritual/imaginacion.webp', duracion: '15 min', tipo: 'Libre', free: true, color: 'var(--mar)' },
  { id: 3, emoji: '👁️', titulo: 'Observación que libera', imagen: '/ritual/observacion.webp', duracion: '18 min', tipo: 'Libre', free: true, color: 'var(--mar)' },
];

function Meditaciones({ onNavigate, user }) {
  return (
    <div className="screen screen-programa">
      <div className="screen-content">

        <Programa
          nombre="Meditaciones"
          imagen="/ritual/roca.webp"
          imagenPos="45% 60%"
          titulo="Comienza a meditar"
          subtitulo="Tu punto de partida hacia la calma"
          unidad="sesiones"
          items={sesiones}
          singular="sesión"
          onAbrir={(s) => onNavigate('sesion', s.id)}
        />

      </div>

      <NavBar active="meditar" onNavigate={onNavigate} />
    </div>
  );
}

export default Meditaciones;