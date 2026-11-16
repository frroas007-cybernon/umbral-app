import React from 'react';

// Barra de pestañas inferior. Íconos SVG de una sola familia:
// contorno cuando la pestaña está inactiva, relleno cuando está activa.
const COLOR_ACTIVO = '#A06A47';
const COLOR_INACTIVO = '#7A6C62';

function IconoInicio({ activo }) {
  const c = activo ? COLOR_ACTIVO : COLOR_INACTIVO;
  return activo ? (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill={c} /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /></svg>
  );
}

function IconoMeditar({ activo }) {
  const c = activo ? COLOR_ACTIVO : COLOR_INACTIVO;
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      {activo && <path d="M7 17a5 5 0 0 1 10 0z" fill={c} />}
      <path d="M4 17h16M7 17a5 5 0 0 1 10 0" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 6v2M6.5 8.5l1.4 1.4M17.5 8.5l-1.4 1.4" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoPerfil({ activo }) {
  const c = activo ? COLOR_ACTIVO : COLOR_INACTIVO;
  return activo ? (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="8.5" r="4.2" fill={c} /><path d="M4 20.5a8 8 0 0 1 16 0z" fill={c} /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8" fill="none" stroke={c} strokeWidth="1.8" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  );
}

const PESTANAS = [
  { key: 'inicio', label: 'Inicio', destino: 'home', Icono: IconoInicio },
  { key: 'meditar', label: 'Meditar', destino: 'meditaciones', Icono: IconoMeditar },
  { key: 'perfil', label: 'Perfil', destino: 'perfil', Icono: IconoPerfil },
];

function NavBar({ active, onNavigate }) {
  return (
    <nav className="nav" aria-label="Navegación principal">
      {PESTANAS.map(({ key, label, destino, Icono }) => {
        const activo = active === key;
        return (
          <button
            key={key}
            type="button"
            className={`nav-item ${activo ? 'active' : ''}`}
            aria-current={activo ? 'page' : undefined}
            onClick={() => onNavigate(destino)}
          >
            <Icono activo={activo} />
            <span className="nav-text">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default NavBar;
