import React, { useState } from 'react';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

function CompletarPerfil({ user, onComplete }) {
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    const { error } = await supabase.from('Perfiles').upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      gender: genero,
      date_of_birth: fechaNacimiento
    });
    if (error) {
      trackError(error, { origen: 'CompletarPerfil upsert' });
    } else {
      trackEvent('perfil_completado', { genero, tiene_fecha: !!fechaNacimiento });
    }
    setLoading(false);
    onComplete();
  };

  return (
    <div className="screen">
      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 20 }}>
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

        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: 'var(--tinta)', textAlign: 'center', marginBottom: 6 }}>
          Un último paso
        </div>
        <div style={{ fontSize: 13, color: 'var(--tinta-sec)', textAlign: 'center', marginBottom: 32 }}>
          Cuéntanos un poco más sobre ti
        </div>

        <select
          value={genero}
          onChange={e => setGenero(e.target.value)}
          style={{ ...inputStyle, color: genero ? 'var(--tinta)' : 'var(--tinta-sec)' }}
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
          style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--tinta-sec)', cursor: 'pointer', opacity: 0.5 }}
          onClick={() => { trackEvent('completar_perfil_omitido'); onComplete(); }}
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
  border: '1.5px solid var(--linea-fuerte)',
  background: 'var(--superficie)',
  fontSize: 16,
  color: 'var(--tinta)',
  marginBottom: 12,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif'
};

export default CompletarPerfil;