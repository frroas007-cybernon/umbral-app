import React, { useState } from 'react';
import Volver from './Volver';
import { proporcionDe, medirProporcion } from '../proporciones';

// Pantalla de un programa (Meditaciones, Afirmaciones, Yoga), con el mismo
// lenguaje que la sesión: la foto arriba, el nombre entrando sobre ella y el
// recorrido abajo. Las sesiones van en orden porque el programa es una secuencia.
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9.5 5.5L16 12l-6.5 6.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'none', stroke: 'var(--tinta-sec)' }} />
    </svg>
  );
}

function minutos(duracion) {
  const n = parseInt(duracion, 10);
  return isNaN(n) ? 0 : n;
}

function Programa({ onVolver, nombre, imagen, imagenPos, titulo, subtitulo, unidad, singular, items, onAbrir }) {
  const [proporcion, setProporcion] = useState(() => proporcionDe(imagen));
  const disponibles = items.filter(s => s.free);
  const primera = disponibles[0];
  const total = disponibles.reduce((acc, s) => acc + minutos(s.duracion), 0);
  const Unidad = singular.charAt(0).toUpperCase() + singular.slice(1);

  return (
    <div className="programa">
      <div className="programa-hero" style={proporcion ? { aspectRatio: proporcion, height: 'auto' } : undefined}>
        <img
          src={imagen}
          alt=""
          style={{ objectPosition: imagenPos || 'center' }}
          onLoad={(e) => medirProporcion(imagen, e.currentTarget, setProporcion)}
        />
        {onVolver && <Volver texto="Inicio" onClick={onVolver} sobreFoto />}
      </div>

      <div className="programa-cuerpo">
        <h1 className="programa-nombre">{nombre}</h1>
        <p className="programa-sub">{titulo}. {subtitulo}.</p>
        <div className="programa-meta">
          {disponibles.length === 1 ? `1 ${singular} disponible` : `${disponibles.length} ${unidad} disponibles`}, {total} minutos en total
        </div>

        {primera && (
          <button type="button" className="btn-main programa-cta" onClick={() => onAbrir(primera)}>
            Comenzar con {primera.titulo}
          </button>
        )}

        <h2 className="section-title programa-lista-titulo">Tu recorrido</h2>
        <ol className="recorrido">
          {items.map((s, i) => (
            <li key={s.id}>
              {s.free ? (
                <button type="button" className="paso" onClick={() => onAbrir(s)}>
                  <img className="paso-foto" src={s.imagen.replace('.webp', '-s.webp')} loading="lazy" decoding="async" alt="" style={{ objectPosition: s.imagenPos || 'center' }} />
                  <span className="paso-info">
                    <span className="paso-titulo">{s.titulo}</span>
                    <span className="paso-meta">{Unidad} {i + 1}, {s.duracion}</span>
                  </span>
                  <Chevron />
                </button>
              ) : (
                <div className="paso bloqueado" aria-disabled="true">
                  <span className="paso-foto paso-vacio" aria-hidden="true">{i + 1}</span>
                  <span className="paso-info">
                    <span className="paso-titulo">{s.titulo}</span>
                    <span className="paso-meta">Próximamente</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Programa;
