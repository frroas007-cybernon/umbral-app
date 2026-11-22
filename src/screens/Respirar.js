import React, { useEffect, useRef, useState } from 'react';
import Volver from '../components/Volver';
import { trackEvent } from '../analytics';
import { vibrar } from '../vibrar';

// Un minuto para respirar: seis respiraciones lentas guiadas por el sol de
// Umbral. Sube al inhalar (4 s), baja al exhalar (6 s).
const INHALA = 4000;
const EXHALA = 6000;
const CICLOS = 6;

function Respirar({ onNavigate }) {
  const [estado, setEstado] = useState('inicio'); // inicio | activo | fin
  const [fase, setFase] = useState('inhala');
  const [ciclo, setCiclo] = useState(1);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const correr = (n, f) => {
    setCiclo(n);
    setFase(f);
    vibrar(f === 'inhala' ? 18 : 10);
    const espera = f === 'inhala' ? INHALA : EXHALA;
    timer.current = setTimeout(() => {
      if (f === 'inhala') return correr(n, 'exhala');
      if (n < CICLOS) return correr(n + 1, 'inhala');
      setEstado('fin');
      vibrar([20, 90, 20]);
      trackEvent('respirar_completado');
    }, espera);
  };

  const comenzar = () => {
    trackEvent('respirar_iniciado');
    setEstado('activo');
    correr(1, 'inhala');
  };

  const detener = () => {
    clearTimeout(timer.current);
    trackEvent('respirar_detenido', { ciclo });
    setEstado('inicio');
  };

  return (
    <div className="screen respirar">
      <div className="respirar-cab">
        <Volver texto="Inicio" onClick={() => onNavigate('home')} />
      </div>

      <div className="respirar-centro">
        <svg viewBox="0 0 260 170" className={`respirar-sol ${estado === 'activo' ? fase : ''}`} aria-hidden="true">
          <defs><clipPath id="resp-hz"><rect x="0" y="0" width="260" height="120" /></clipPath></defs>
          <g clipPath="url(#resp-hz)">
            <g className="respirar-astro">
              <circle cx="130" cy="120" r="44" strokeWidth="4" style={{ fill: 'none', stroke: 'var(--sol)' }} />
            </g>
          </g>
          <line x1="16" y1="120" x2="244" y2="120" strokeWidth="3" strokeLinecap="round" style={{ stroke: 'var(--mar)' }} />
          <path d="M70 138 Q 95 130 120 138 T 170 138 T 200 138" strokeWidth="3" strokeLinecap="round" opacity="0.55" style={{ fill: 'none', stroke: 'var(--mar)' }} />
          <path d="M100 154 Q 118 148 136 154 T 172 154" strokeWidth="3" strokeLinecap="round" opacity="0.35" style={{ fill: 'none', stroke: 'var(--mar)' }} />
        </svg>

        {estado === 'inicio' && (
          <div className="respirar-texto">
            <h1 className="respirar-titulo">Un minuto para respirar</h1>
            <p className="respirar-sub">Seis respiraciones lentas. Inhala mientras el sol sube y exhala mientras baja.</p>
            <button type="button" className="btn-main" onClick={comenzar}>Comenzar</button>
          </div>
        )}

        {estado === 'activo' && (
          <div className="respirar-texto">
            <div className="respirar-fase" aria-live="polite">{fase === 'inhala' ? 'Inhala' : 'Exhala'}</div>
            <div className="respirar-ciclo">Respiración {ciclo} de {CICLOS}</div>
            <button type="button" className="btn-texto" onClick={detener}>Detener</button>
          </div>
        )}

        {estado === 'fin' && (
          <div className="respirar-texto">
            <h1 className="respirar-titulo">Listo</h1>
            <p className="respirar-sub">Un minuto para ti. Si quieres seguir, la primera sesión parte justo desde aquí.</p>
            <button type="button" className="btn-main" onClick={() => onNavigate('sesion', 1)}>Seguir con Respiración, la base de todo</button>
            <button type="button" className="btn-texto" onClick={() => onNavigate('home')}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Respirar;
