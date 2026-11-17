import React from 'react';

// El sol de Umbral: un rayo por cada día seguido de práctica (hasta siete).
function SolRacha({ dias, className = 'sol-racha', etiqueta }) {
  const RAYOS = 7;
  const encendidos = Math.min(dias, RAYOS);
  const cx = 130, cy = 108;
  return (
    <svg viewBox="0 0 260 150" className={className} role="img"
      aria-label={etiqueta || `Racha de ${dias} ${dias === 1 ? 'día' : 'días'}`}>
      <defs><clipPath id={`sol-hz-${className}`}><rect x="0" y="0" width="260" height={cy} /></clipPath></defs>
      {Array.from({ length: RAYOS }).map((_, i) => {
        const ang = Math.PI - (i + 0.5) * (Math.PI / RAYOS);
        const r1 = 62, r2 = 86;
        const on = i < encendidos;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(ang)} y1={cy - r1 * Math.sin(ang)}
            x2={cx + r2 * Math.cos(ang)} y2={cy - r2 * Math.sin(ang)}
            className={on ? 'rayo on' : 'rayo'}
            style={{ transitionDelay: `${i * 90}ms` }}
            strokeLinecap="round" />
        );
      })}
      <g clipPath={`url(#sol-hz-${className})`}>
        <circle cx={cx} cy={cy} r="48" style={{ fill: dias > 0 ? 'var(--sol)' : 'var(--apagado)' }} />
      </g>
      <line x1="20" y1={cy} x2="240" y2={cy} strokeWidth="4" strokeLinecap="round" style={{ stroke: 'var(--mar)' }} />
      <path d={`M78 ${cy + 16} Q 102 ${cy + 9} 126 ${cy + 16} T 174 ${cy + 16} T 200 ${cy + 16}`} strokeWidth="3" strokeLinecap="round" opacity="0.55" style={{ fill: 'none', stroke: 'var(--mar)' }} />
    </svg>
  );
}

export default SolRacha;
