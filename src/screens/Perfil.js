import React, { useState, useRef } from 'react';
import { useRacha } from '../hooks/useRacha';
import { useRecordatorio } from '../hooks/useRecordatorio';
import EliminarCuentaModal from '../components/EliminarCuentaModal';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';
import NavBar from '../components/NavBar';
import SolRacha from '../components/SolRacha';

function IconoPersona() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" style={{ fill: 'none', stroke: 'var(--tinta-sec)' }} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
    </svg>
  );
}

function IconoCamara() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ fill: 'none', stroke: 'var(--accion-texto)' }} strokeWidth="2" strokeLinejoin="round">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

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

  const esInvitado = user?.id === 'guest';
  const nombreUsuario = esInvitado
    ? null
    : user?.user_metadata?.name
      || user?.user_metadata?.full_name
      || user?.email?.split('@')[0]
      || null;
  const inicial = nombreUsuario ? nombreUsuario.trim().charAt(0).toUpperCase() : null;
  const correo = !esInvitado && user?.email && user.email !== 'guest' ? user.email : null;

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="perfil-cab">
          <button
            type="button"
            className="perfil-foto"
            onClick={handleFotoClick}
            disabled={esInvitado || subiendoFoto}
            style={{ opacity: subiendoFoto ? 0.6 : 1 }}
            aria-label={esInvitado ? 'Foto de perfil' : 'Cambiar foto de perfil'}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="" />
              : inicial
                ? <span className="perfil-inicial">{inicial}</span>
                : <IconoPersona />}
            {!esInvitado && (
              <span className="perfil-foto-camara" aria-hidden="true"><IconoCamara /></span>
            )}
          </button>
          <div className="perfil-cab-texto">
            <h1 className="perfil-nombre">{nombreUsuario || 'Invitado'}</h1>
            <div className="perfil-sub">{correo || 'Practicas sin cuenta'}</div>
          </div>
          {!esInvitado && (
            <button
              type="button"
              className="perfil-editar"
              onClick={() => { trackEvent('editar_perfil_abierto'); onNavigate('editar-perfil'); }}
            >
              Editar
            </button>
          )}
        </div>
        {!esInvitado && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ display: 'none' }}
          />
        )}
        {errorFoto && <div className="perfil-error" role="alert">{errorFoto}</div>}

        <section className="racha" aria-labelledby="racha-titulo">
          <SolRacha dias={racha} />
          <h2 id="racha-titulo" className="racha-titulo">
            {racha === 0
              ? 'Tu racha empieza hoy'
              : `${racha} ${racha === 1 ? 'día' : 'días'} seguidos`}
          </h2>
          <p className="racha-sub">Cada día que practicas enciende un rayo.</p>
        </section>

        {esInvitado && (
          <div className="perfil-invitado">
            <p>Crea una cuenta para guardar tu racha y seguir desde cualquier dispositivo.</p>
            <button
              type="button"
              className="btn-main"
              onClick={() => { trackEvent('crear_cuenta_click_perfil'); onNavigate('login'); }}
            >
              Crear cuenta o ingresar
            </button>
          </div>
        )}

        <div className="perfil-lista">
          <div className="perfil-fila">
            <span className="perfil-fila-titulo">Sesiones completadas</span>
            <span className="perfil-fila-valor">{sesiones}</span>
          </div>
          <div className="perfil-fila">
            <div className="recordatorio-info">
              <div className="perfil-fila-titulo">Recordatorio diario</div>
              <div className="recordatorio-sub">
                {esNativo
                  ? (permisoDenegado
                      ? 'Sin permiso. Actívalo en los ajustes del teléfono.'
                      : 'Una notificación para no perder tu práctica')
                  : 'Disponible en la app instalada'}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={recordatorioActivo}
              className={`toggle-switch ${recordatorioActivo ? 'on' : ''}`}
              onClick={handleToggleRecordatorio}
              disabled={!esNativo}
              aria-label="Recordatorio diario"
            >
              <div className="toggle-switch-knob" />
            </button>
          </div>
          {esNativo && recordatorioActivo && (
            <div className="perfil-fila">
              <label className="perfil-fila-titulo" htmlFor="hora-recordatorio">Hora</label>
              <input
                id="hora-recordatorio"
                type="time"
                className="recordatorio-hora-input"
                value={recordatorioHora}
                onChange={(e) => cambiarHora(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {user?.id !== 'guest' && (
            <button className="btn-sec" onClick={onLogout}>
              Cerrar sesión
            </button>
          )}
          {user?.id !== 'guest' && (
            <button
              type="button"
              className="btn-texto btn-peligro"
              onClick={() => {
                trackEvent('eliminar_cuenta_iniciado');
                setShowEliminar(true);
              }}
            >
              Eliminar cuenta
            </button>
          )}
          <button
            type="button"
            className="btn-texto"
            style={{ color: 'var(--gris)', fontSize: 15, textDecoration: 'underline' }}
            onClick={() => onNavigate('privacy')}
          >
            Política de privacidad
          </button>
        </div>

      </div>

      <EliminarCuentaModal
        visible={showEliminar}
        loading={eliminando}
        error={errorEliminar}
        onClose={() => { if (!eliminando) setShowEliminar(false); }}
        onConfirm={handleEliminarCuenta}
      />

      <NavBar active="perfil" onNavigate={onNavigate} />
    </div>
  );
}

export default Perfil;
