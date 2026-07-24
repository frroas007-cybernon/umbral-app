import React from 'react';
import { useRacha } from '../hooks/useRacha';
import ApoyoBanner from '../components/ApoyoBanner';

function Perfil({ onNavigate, user, onLogout }) {
  const { racha, sesiones } = useRacha();

  const nombreUsuario = user?.id === 'guest'
    ? null
    : user?.user_metadata?.name
      || user?.user_metadata?.full_name
      || user?.email?.split('@')[0]
      || null;

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="page-title">Perfil</div>

        <div className="perfil-avatar">👤</div>
        <div className="perfil-nombre">{nombreUsuario || 'Bienvenido/a'}</div>

        <div className="stat-card">
          <div className="stat-label">SESIONES COMPLETADAS</div>
          <div className="stat-valor">{sesiones}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">RACHA ACTUAL</div>
          <div className="stat-valor">{racha} {racha === 1 ? 'día' : 'días'} 🔥</div>
        </div>

        {/* Cerrar sesión */}
        {user?.id !== 'guest' && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 8,
              fontSize: 12,
              color: '#8A7A6E',
              cursor: 'pointer',
              opacity: 0.6
            }}
            onClick={onLogout}
          >
            Cerrar sesión
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <ApoyoBanner user={user} />
        </div>

      </div>

      <nav className="nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <div className="nav-icon">🏠</div>
          <div className="nav-text">Inicio</div>
        </div>
        <div className="nav-item" onClick={() => onNavigate('meditaciones')}>
          <div className="nav-icon">🧘</div>
          <div className="nav-text">Meditar</div>
        </div>
        <div className="nav-item active">
          <div className="nav-icon">👤</div>
          <div className="nav-text">Perfil</div>
        </div>
      </nav>
    </div>
  );
}

export default Perfil;