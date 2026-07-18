import React, { useState } from 'react';
import { supabase } from '../supabase';

function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [modo, setModo] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email o contraseña incorrectos');
    } else {
      onLogin(data.user);
    }
    setLoading(false);
  };

  const handleRegistro = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      await supabase.from('Perfiles').insert({
        id: data.user.id,
        email,
        name: nombre,
        gender: genero,
        date_of_birth: fechaNacimiento
      });
      onLogin(data.user);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 20 }}>
          <svg viewBox="0 0 300 175" xmlns="http://www.w3.org/2000/svg" style={{ width: 140, height: 'auto' }}>
            <ellipse cx="150" cy="120" rx="42" ry="7" fill="#7AACB5" opacity="0.30"/>
            <ellipse cx="150" cy="125" rx="28" ry="4" fill="#7AACB5" opacity="0.18"/>
            <path d="M 110 114 A 40 40 0 0 1 190 114 Z" fill="#C4977A"/>
            <line x1="84" y1="114" x2="216" y2="114" stroke="#3D3530" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="150" y1="66" x2="150" y2="82" stroke="#C4977A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="129" y1="71" x2="135.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="171" y1="71" x2="164.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="111" y1="87" x2="120" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="189" y1="87" x2="180" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="92" y1="108" x2="106" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="208" y1="108" x2="194" y2="114" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M 124 114 A 26 26 0 0 1 176 114 Z" fill="#7AACB5" opacity="0.22"/>
            <text x="150" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fill="#3D3530" letterSpacing="9">UMBRAL</text>
          </svg>
        </div>

        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: '#3D3530', textAlign: 'center', marginBottom: 6 }}>
          {modo === 'login' ? 'Bienvenido/a de vuelta' : 'Crea tu cuenta'}
        </div>
        <div style={{ fontSize: 13, color: '#8A7A6E', textAlign: 'center', marginBottom: 32 }}>
          {modo === 'login' ? 'Inicia sesión para continuar' : 'Es gratis, siempre'}
        </div>

        {/* Campos registro */}
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
              style={{ ...inputStyle, color: genero ? '#3D3530' : '#8A7A6E' }}
            >
              <option value="" disabled>Género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No binario</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>
            <input
              placeholder="Fecha de nacimiento"
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
              style={inputStyle}
              type="date"
            />
          </>
        )}

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div style={{ color: '#C4977A', fontSize: 12, textAlign: 'center', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          className="btn-main"
          style={{ marginTop: 8 }}
          onClick={modo === 'login' ? handleLogin : handleRegistro}
          disabled={loading}
        >
          {loading ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>

        {/* Google */}
        <button
          className="btn-sec"
          style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={handleGoogle}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continuar con Google
        </button>

        <div
          style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8A7A6E', cursor: 'pointer' }}
          onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(''); }}
        >
          {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </div>

        <div
          style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#8A7A6E', cursor: 'pointer', opacity: 0.5 }}
          onClick={() => onLogin({ id: 'guest', email: 'guest' })}
        >
          Omitir por ahora
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1.5px solid #E8D5B7',
  background: '#F7F3EE',
  fontSize: 14,
  color: '#3D3530',
  marginBottom: 12,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif'
};

export default Login;