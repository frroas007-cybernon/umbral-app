import React from 'react';
import { useRacha } from '../hooks/useRacha';

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
      <div className="screen-content">

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

        <div
          style={{
            background: '#3D3530',
            borderRadius: 16,
            padding: 20,
            cursor: 'pointer',
            textAlign: 'center',
            marginBottom: 14
          }}
          onClick={() => window.open('https://ko-fi.com/franciscoroa', '_blank')}
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>☕</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#F7F3EE', marginBottom: 4 }}>
            Apoya Umbral
          </div>
          <div style={{ fontSize: 12, color: 'rgba(247,243,238,0.85)' }}>
            Ayúdame a mantenerla gratuita para siempre
          </div>
        </div>

        {/* Cerrar sesión */}
        {user?.id !== 'guest' && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 20,
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