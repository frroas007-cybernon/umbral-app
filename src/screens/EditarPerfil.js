import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

function EditarPerfil({ onNavigate, user }) {
  const [nombre, setNombre] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      const { data, error } = await supabase
        .from('Perfiles')
        .select('name, gender, date_of_birth')
        .eq('id', user.id)
        .single();

      if (!activo) return;

      if (error) {
        trackError(error, { origen: 'EditarPerfil cargar' });
      } else if (data) {
        setNombre(data.name || '');
        setGenero(data.gender || '');
        setFechaNacimiento(data.date_of_birth || '');
      }
      setCargando(false);
    };

    cargar();
    return () => { activo = false; };
  }, [user]);

  const handleGuardar = async () => {
    setGuardando(true);
    setError('');
    setGuardado(false);

    const { error } = await supabase
      .from('Perfiles')
      .update({
        name: nombre.trim(),
        gender: genero,
        date_of_birth: fechaNacimiento
      })
      .eq('id', user.id);

    if (error) {
      trackError(error, { origen: 'EditarPerfil handleGuardar' });
      setError('No se pudo guardar. Intenta de nuevo.');
      setGuardando(false);
      return;
    }

    trackEvent('perfil_editado');
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => onNavigate('perfil'), 700);
  };

  return (
    <div className="screen">
      <div className="screen-content">

        <div className="back-btn" onClick={() => onNavigate('perfil')}>
          ← Volver
        </div>

        <div className="page-title">Editar perfil</div>

        {cargando ? (
          <div style={{ textAlign: 'center', color: '#8A7A6E', fontSize: 13, marginTop: 20 }}>
            Cargando...
          </div>
        ) : (
          <>
            <div style={labelStyle}>Nombre</div>
            <input
              placeholder="Tu nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={inputStyle}
            />

            <div style={labelStyle}>Correo</div>
            <div style={{ ...inputStyle, color: '#8A7A6E', opacity: 0.7 }}>
              {user?.email}
            </div>

            <div style={labelStyle}>Género</div>
            <select
              value={genero}
              onChange={e => setGenero(e.target.value)}
              style={{ ...inputStyle, color: genero ? '#3D3530' : '#8A7A6E' }}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No binario</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>

            <div style={labelStyle}>Fecha de nacimiento</div>
            <input
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
              style={{ ...inputStyle, WebkitAppearance: 'none', appearance: 'none', height: 50, lineHeight: '20px' }}
              type="date"
            />

            {error && (
              <div style={{ color: '#C0392B', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>
                {error}
              </div>
            )}

            <button
              className="btn-main"
              style={{ marginTop: 12 }}
              onClick={handleGuardar}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : guardado ? 'Guardado ✓' : 'Guardar cambios'}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 11,
  color: '#8A7A6E',
  letterSpacing: 1,
  fontWeight: 500,
  marginBottom: 6,
  marginTop: 4
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1.5px solid #E8D5B7',
  background: '#F7F3EE',
  fontSize: 15,
  color: '#3D3530',
  marginBottom: 16,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box'
};

export default EditarPerfil;
