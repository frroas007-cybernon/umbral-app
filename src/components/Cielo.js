import React from 'react';

// El momento del día según la hora local.
export function momentoDelDia(fecha = new Date()) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  if (h >= 5 && h < 8) return 'amanecer';
  if (h >= 8 && h < 18) return 'dia';
  if (h >= 18 && h < 21) return 'atardecer';
  return 'noche';
}

export function saludoDelDia(fecha = new Date()) {
  const h = fecha.getHours();
  if (h >= 5 && h < 13) return 'Buenos días';
  if (h >= 13 && h < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

// Posición del sol sobre el horizonte: sale a las 6:30 y se pone a las 20:30
// (aprox. en la costa central de Chile). De noche queda bajo el horizonte.
function posicionSol(fecha) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const p = (h - 6.5) / 14;
  if (p <= 0 || p >= 1) return null;
  return { x: 40 + p * 300, y: 112 - Math.sin(Math.PI * p) * 78 };
}

const ESTRELLAS = [[40, 28], [92, 54], [150, 22], [214, 46], [268, 18], [330, 40], [120, 84], [300, 78]];

// Franja de cielo de Inicio: el sol en la posición que tiene ahora mismo.
function Cielo({ fecha = new Date() }) {
  const momento = momentoDelDia(fecha);
  const sol = posicionSol(fecha);
  return (
    <div className={`cielo cielo-${momento}`} aria-hidden="true">
      <svg viewBox="0 0 380 140" preserveAspectRatio="xMidYMax meet">
        <defs><clipPath id="cielo-hz"><rect x="0" y="0" width="380" height="112" /></clipPath></defs>
        {momento === 'noche' && ESTRELLAS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} className="estrella-cielo" />
        ))}
        {momento === 'noche' && (
          <path d="M296 30 a 14 14 0 1 0 12 22 a 11 11 0 1 1 -12 -22z" className="luna" />
        )}
        {sol && (
          <g clipPath="url(#cielo-hz)">
            <circle cx={sol.x} cy={sol.y} r="20" strokeWidth="3.5" className="sol-cielo" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <line key={i}
                  x1={sol.x + 28 * Math.cos(a)} y1={sol.y + 28 * Math.sin(a)}
                  x2={sol.x + 36 * Math.cos(a)} y2={sol.y + 36 * Math.sin(a)}
                  strokeWidth="3" strokeLinecap="round" className="sol-cielo" />
              );
            })}
          </g>
        )}
        <line x1="0" y1="112" x2="380" y2="112" strokeWidth="2.5" className="horizonte" />
        <path d="M110 126 Q 140 119 170 126 T 230 126 T 270 126" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" className="horizonte" style={{ fill: 'none' }} />
      </svg>
    </div>
  );
}

export default Cielo;
