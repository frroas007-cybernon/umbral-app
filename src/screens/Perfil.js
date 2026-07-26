import React, { useState } from 'react';
import { useRacha } from '../hooks/useRacha';
import { useRecordatorio } from '../hooks/useRecordatorio';
import ApoyoBanner from '../components/ApoyoBanner';
import EliminarCuentaModal from '../components/EliminarCuentaModal';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

function Perfil({ onNavigate, user, onLogout }) {
  const { racha, sesiones } = useRacha(user);
  const {
    activo: recordatorioActivo,
    hora: recordatorioHora,
    esNativo,
    permisoDenegado,
    activarRecordatorio,
    desactivarRecordatorio,
    cambiarHora
  } = useRecordatorio(user);
  const [showEliminar, setShowEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  const handleToggleRecordatorio = async () => {
    if (recordatorioActivo) {
      await desactivarRecordatorio();
    } else {
      await activarRecordatorio(recordatorioHora);
    }
  };

  const handleEliminarCuenta = async () => {
    setEliminando(true);
    setErrorEliminar('');
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      if (!accessToken) {
        setErrorEliminar('No se pudo verificar tu sesión. Intenta de nuevo.');
        setEliminando(false);
        return;
      }

      const res = await fetch('/api/eliminar-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken })
      });
      const result = await res.json();

      if (!res.ok) {
        setErrorEliminar('No se pudo eliminar la cuenta. Intenta de nuevo.');
        trackError(new Error(result.error || 'eliminar-cuenta falló'), { origen: 'Perfil handleEliminarCuenta' });
        setEliminando(false);
        return;
      }

      await supabase.auth.signOut();
      onLogout();
    } catch (err) {
      trackError(err, { origen: 'Perfil handleEliminarCuenta catch' });
      setErrorEliminar('Ocurrió un error inesperado. Intenta de nuevo.');
      setEliminando(false);
    }
  };

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

        <div className="stat-card">
          <div className="recordatorio-fila">
            <div className="recordatorio-info">
              <div className="recordatorio-titulo">Recordatorio diario</div>
              <div className="recordatorio-sub">
                {esNativo
                  ? (permisoDenegado
                      ? 'Sin permiso — actívalo en los ajustes del dispositivo'
                      : 'Una notificación para no perder tu práctica')
                  : 'Disponible solo en la app instalada'}
              </div>
            </div>
            <button
              className={`toggle-switch ${recordatorioActivo ? 'on' : ''}`}
              onClick={handleToggleRecordatorio}
              disabled={!esNativo}
              aria-label="Activar recordatorio diario"
            >
              <div className="toggle-switch-knob" />
            </button>
          </div>

          {esNativo && recordatorioActivo && (
            <input
              type="time"
              className="recordatorio-hora-input"
              value={recordatorioHora}
              onChange={(e) => cambiarHora(e.target.value)}
            />
          )}
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

        {user?.id !== 'guest' && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 11,
              color: '#C0392B',
              cursor: 'pointer',
              opacity: 0.5
            }}
            onClick={() => {
              trackEvent('eliminar_cuenta_iniciado');
              setShowEliminar(true);
            }}
          >
            Eliminar cuenta
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <ApoyoBanner user={user} />
        </div>

      </div>

      <EliminarCuentaModal
        visible={showEliminar}
        loading={eliminando}
        error={errorEliminar}
        onClose={() => { if (!eliminando) setShowEliminar(false); }}
        onConfirm={handleEliminarCuenta}
      />

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
