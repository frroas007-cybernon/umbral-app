import React, { useState } from 'react';
import { supabase } from '../supabase';

function CompletarPerfil({ user, onComplete }) {
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    await supabase.from('Perfiles').upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      gender: genero,
      date_of_birth: fechaNacimiento
    });
    setLoading(false);
    onComplete();
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 20 }}>
          <svg viewBox="0 0 300 175" xmlns="http://www.w3.org/2000/svg" style={{ width: 120, height: 'auto' }}>
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
          Un último paso
        </div>
        <div style={{ fontSize: 13, color: '#8A7A6E', textAlign: 'center', marginBottom: 32 }}>
          Cuéntanos un poco más sobre ti
        </div>

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
          style={{ ...inputStyle, WebkitAppearance: 'none', appearance: 'none', height: 50, lineHeight: '20px' }}
          type="date"
        />

        <button
          className="btn-main"
          style={{ marginTop: 8 }}
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Continuar'}
        </button>

        <div
          style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#8A7A6E', cursor: 'pointer', opacity: 0.5 }}
          onClick={onComplete}
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
  fontSize: 16,
  color: '#3D3530',
  marginBottom: 12,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif'
};

export default CompletarPerfil;