import React, { useState } from 'react';
import Volver from '../components/Volver';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [modo, setModo] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validarFecha = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    return nacimiento < hoy && edad >= 5 && edad <= 120;
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Email o contraseña incorrectos');
        trackEvent('login_fallido', { motivo: error.message });
      } else {
        trackEvent('login_exitoso');
        onLogin(data.user);
      }
    } catch (err) {
      trackError(err, { origen: 'handleLogin' });
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const handleRegistro = async () => {
    if (!email.includes('@')) return setError('Email no válido');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    if (fechaNacimiento) {
      const partes = fechaNacimiento.split('-');
      if (partes.length !== 3 || partes.some(p => p === '')) {
        return setError('Completa la fecha de nacimiento con día, mes y año');
      }
      if (!validarFecha(fechaNacimiento)) {
        return setError('Fecha de nacimiento no válida');
      }
    }
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: nombre } }
      });
      if (error) {
        setError(error.message);
        trackEvent('registro_fallido', { motivo: error.message });
      } else {
        const { error: perfilError } = await supabase.from('Perfiles').insert({
          id: data.user.id,
          email,
          name: nombre,
          gender: genero,
          date_of_birth: fechaNacimiento
        });
        if (perfilError) trackError(perfilError, { origen: 'insert Perfiles en registro' });
        trackEvent('registro_exitoso');
        onLogin(data.user);
      }
    } catch (err) {
      trackError(err, { origen: 'handleRegistro' });
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    }
    setLoading(false);
  };



  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <Volver texto="Perfil" onClick={() => onNavigate('perfil')} />

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 20 }}>
          <svg viewBox="0 0 300 175" xmlns="http://www.w3.org/2000/svg" style={{ width: 120, height: 'auto' }}>
            <ellipse cx="150" cy="120" rx="42" ry="7" opacity="0.30" style={{ fill: 'var(--mar)' }}/>
            <ellipse cx="150" cy="125" rx="28" ry="4" opacity="0.18" style={{ fill: 'var(--mar)' }}/>
            <path d="M 110 114 A 40 40 0 0 1 190 114 Z" style={{ fill: 'var(--sol)' }}/>
            <line x1="84" y1="114" x2="216" y2="114" strokeWidth="1.8" strokeLinecap="round" style={{ stroke: 'var(--tinta)' }}/>
            <line x1="150" y1="66" x2="150" y2="82" strokeWidth="2" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="129" y1="71" x2="135.5" y2="86" strokeWidth="1.7" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="171" y1="71" x2="164.5" y2="86" strokeWidth="1.7" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="111" y1="87" x2="120" y2="98" strokeWidth="1.4" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="189" y1="87" x2="180" y2="98" strokeWidth="1.4" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="92" y1="108" x2="106" y2="108" strokeWidth="1.2" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <line x1="208" y1="108" x2="194" y2="114" strokeWidth="1.2" strokeLinecap="round" style={{ stroke: 'var(--sol)' }}/>
            <path d="M 124 114 A 26 26 0 0 1 176 114 Z" opacity="0.22" style={{ fill: 'var(--mar)' }}/>
            <text x="150" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" letterSpacing="9" style={{ fill: 'var(--tinta)' }}>UMBRAL</text>
          </svg>
        </div>

        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: 'var(--tinta)', textAlign: 'center', marginBottom: 4 }}>
          {modo === 'login' ? 'Bienvenido/a de vuelta' : 'Crea tu cuenta'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--tinta-sec)', textAlign: 'center', marginBottom: 24 }}>
          {modo === 'login' ? 'Inicia sesión para guardar tu progreso' : 'Es gratis, siempre'}
        </div>

        {modo === 'registro' && (
          <>
            <input
              placeholder="Tu nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={inputStyle}
            />

            <select
              value={genero}
              onChange={e => setGenero(e.target.value)}
              style={{
                ...inputStyle,
                color: genero ? 'var(--tinta)' : 'var(--tinta-sec)',
                appearance: 'auto',
                WebkitAppearance: 'auto',
                background: 'var(--superficie)',
              }}
            >
              <option value="" disabled>Género (opcional)</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No binario</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--tinta-sec)', marginBottom: 4, paddingLeft: 2 }}>
                Fecha de nacimiento (opcional)
              </div>
              <input
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, WebkitAppearance: 'none', appearance: 'none', height: 50, lineHeight: '20px' }}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
              />
            </div>
          </>
        )}

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, paddingRight: 92 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-pressed={showPassword}
            style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              minHeight: 44,
              padding: '0 12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--accion)'
            }}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--error)', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          className="btn-main"
          style={{ marginTop: 4 }}
          onClick={modo === 'login' ? handleLogin : handleRegistro}
          disabled={loading}
        >
          {loading ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>



        <div
          style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--tinta-sec)', cursor: 'pointer' }}
          onClick={() => {
            const nuevoModo = modo === 'login' ? 'registro' : 'login';
            trackEvent('cambio_modo_login', { a: nuevoModo });
            setModo(nuevoModo);
            setError('');
          }}
        >
          {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1.5px solid var(--linea-fuerte)',
  background: 'var(--superficie)',
  fontSize: 16,
  color: 'var(--tinta)',
  marginBottom: 12,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box'
};

export default Login;