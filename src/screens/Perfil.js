import React, { useState, useRef } from 'react';
import { useRacha } from '../hooks/useRacha';
import { useRecordatorio } from '../hooks/useRecordatorio';
import EliminarCuentaModal from '../components/EliminarCuentaModal';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

function Perfil({ onNavigate, user, onLogout, avatarUrl, onAvatarChange }) {
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
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState('');
  const fileInputRef = useRef(null);

  const handleFotoClick = () => {
    if (user?.id === 'guest' || subiendoFoto) return;
    fileInputRef.current?.click();
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorFoto('Elige un archivo de imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorFoto('La imagen no puede pesar más de 5MB');
      return;
    }

    setSubiendoFoto(true);
    setErrorFoto('');
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const urlConCache = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('Perfiles')
        .update({ avatar_url: urlConCache })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onAvatarChange?.(urlConCache);
      trackEvent('foto_perfil_actualizada');
    } catch (err) {
      trackError(err, { origen: 'Perfil handleFotoChange' });
      setErrorFoto('No se pudo subir la foto. Intenta de nuevo.');
    } finally {
      setSubiendoFoto(false);
    }
  };

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

        <div
          className="perfil-avatar-circle"
          onClick={handleFotoClick}
          style={{ cursor: user?.id === 'guest' ? 'default' : 'pointer', opacity: subiendoFoto ? 0.6 : 1 }}
          aria-label="Cambiar foto de perfil"
        >
          {avatarUrl ? <img src={avatarUrl} alt="Foto de perfil" /> : '👤'}
          {user?.id !== 'guest' && (
            <div className="perfil-avatar-camara">{subiendoFoto ? '…' : '📷'}</div>
          )}
        </div>
        {user?.id !== 'guest' && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ display: 'none' }}
          />
        )}
        {errorFoto && (
          <div style={{ color: '#C0392B', fontSize: 11, textAlign: 'center', marginBottom: 8 }}>{errorFoto}</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <div className="perfil-nombre" style={{ marginBottom: 0 }}>{nombreUsuario || 'Bienvenido/a'}</div>
          {user?.id !== 'guest' && (
            <div
              style={{ fontSize: 15, color: '#8A7A6E', cursor: 'pointer', opacity: 0.7 }}
              onClick={() => { trackEvent('editar_perfil_abierto'); onNavigate('editar-perfil'); }}
              aria-label="Editar perfil"
            >
              ✏️
            </div>
          )}
        </div>

        {user?.id === 'guest' && (
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => { trackEvent('crear_cuenta_click_perfil'); onNavigate('login'); }}
          >
            <div className="recordatorio-fila">
              <div className="recordatorio-info">
                <div className="recordatorio-titulo">Crear cuenta o iniciar sesión</div>
                <div className="recordatorio-sub">Guarda tu racha y accede desde cualquier dispositivo</div>
              </div>
              <div style={{ fontSize: 20, color: '#C4977A' }}>→</div>
            </div>
          </div>
        )}

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
        <div className="nav-item" onClick={() => onNavigate('apoyar')}>
          <div className="nav-icon">💛</div>
          <div className="nav-text">Apoyar</div>
        </div>
      </nav>
    </div>
  );
}

export default Perfil;
