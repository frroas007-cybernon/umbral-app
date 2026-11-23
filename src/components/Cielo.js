import React from 'react';

// Salida y puesta de sol en Viña del Mar para una fecha, en la hora local del
// teléfono (aproximación solar estándar, error de un par de minutos). Así el
// atardecer llega en verano y en invierno a la hora en que de verdad se ve.
const LATITUD = -33.02;
const LONGITUD = -71.55;
const RAD = Math.PI / 180;

export function solDelDia(fecha = new Date()) {
  const inicio = Date.UTC(fecha.getFullYear(), 0, 0);
  const dia = Math.floor((Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) - inicio) / 86400000);
  const g = (2 * Math.PI / 365) * (dia - 1);
  const ecuacion = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
    - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const declinacion = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
    - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
    - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const angulo = Math.acos(Math.cos(90.833 * RAD) / (Math.cos(LATITUD * RAD) * Math.cos(declinacion))
    - Math.tan(LATITUD * RAD) * Math.tan(declinacion)) / RAD;
  // Minutos desde la medianoche UTC; se pasan a la hora local de esa fecha.
  const salidaUTC = 720 - 4 * (LONGITUD + angulo) - ecuacion;
  const puestaUTC = 720 - 4 * (LONGITUD - angulo) - ecuacion;
  const base = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const aLocal = (min) => {
    const d = new Date(base + min * 60000);
    return d.getHours() + d.getMinutes() / 60;
  };
  return { salida: aLocal(salidaUTC), puesta: aLocal(puestaUTC) };
}

// El momento del día según la luz real: el amanecer rodea la salida del sol,
// el atardecer la hora dorada y la puesta, y después es de noche.
export function momentoDelDia(fecha = new Date()) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const { salida, puesta } = solDelDia(fecha);
  if (h >= salida - 0.5 && h < salida + 1.5) return 'amanecer';
  if (h >= salida + 1.5 && h < puesta - 1.5) return 'dia';
  if (h >= puesta - 1.5 && h < puesta + 0.75) return 'atardecer';
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
function Cielo({ fecha = new Date(), animado = false }) {
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
            <g className={animado ? 'sol-sube' : undefined} style={{ '--desde': `${112 + 40 - sol.y}px` }}>
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
          </g>
        )}
        <line x1="0" y1="112" x2="380" y2="112" strokeWidth="2.5" className="horizonte" />
        <path d="M110 126 Q 140 119 170 126 T 230 126 T 270 126" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" className="horizonte" style={{ fill: 'none' }} />
      </svg>
    </div>
  );
}

export default Cielo;
