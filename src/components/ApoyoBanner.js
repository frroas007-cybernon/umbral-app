import React, { useState, useEffect } from 'react';

const montos = [2000, 5000, 10000];

function ApoyoBanner({ user }) {
  const [abierto, setAbierto] = useState(false);
  const [monto, setMonto] = useState(5000);
  const [montoCustom, setMontoCustom] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const montoFinal = montoCustom ? Number(montoCustom) : monto;

  const handleApoyar = async () => {
    if (!montoFinal || montoFinal < 500) {
      setError('Ingresa un monto válido (mínimo $500)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const nombreUsuario = user?.id === 'guest'
        ? null
        : (user?.user_metadata?.name || user?.user_metadata?.full_name || null);
      const emailUsuario = user?.id === 'guest' ? null : user?.email;
      const userId = user?.id === 'guest' ? null : user?.id;
      const nombreFinal = nombre.trim() || nombreUsuario;

      const res = await fetch('/api/crear-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: montoFinal,
          message: mensaje || null,
          name: nombreFinal,
          email: emailUsuario,
          user_id: userId
        })
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        setError('No se pudo iniciar el pago. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      window.location.href = data.init_point;
    } catch (err) {
      setError('No se pudo iniciar el pago. Intenta de nuevo.');
      setLoading(false);
    }
  };

  if (!abierto) {
    return (
      <div
        onClick={() => setAbierto(true)}
        style={{
          background: '#F7F3EE',
          border: '1.5px solid #E8D5B7',
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: 26 }}>💛</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, color: '#3D3530' }}>
            ¿Te gusta Umbral?
          </div>
          <div style={{ fontSize: 12, color: '#8A7A6E', marginTop: 2 }}>
            Ayúdanos a mantenerla gratis
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#C4977A', fontWeight: 600 }}>Apoyar →</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#F7F3EE',
        border: '1.5px solid #E8D5B7',
        borderRadius: 16,
        padding: 18,
        marginBottom: 20
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, color: '#3D3530' }}>
          💛 Apoya a Umbral
        </div>
        <div
          onClick={() => setAbierto(false)}
          style={{ fontSize: 13, color: '#8A7A6E', cursor: 'pointer' }}
        >
          Cerrar
        </div>
      </div>

      <input
        placeholder="Tu nombre (opcional)"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {montos.map(m => (
          <div
            key={m}
            onClick={() => { setMonto(m); setMontoCustom(''); }}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: 10,
              border: `1.5px solid ${!montoCustom && monto === m ? '#C4977A' : '#E8D5B7'}`,
              background: !montoCustom && monto === m ? '#C4977A' : '#fff',
              color: !montoCustom && monto === m ? '#fff' : '#3D3530',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ${m.toLocaleString('es-CL')}
          </div>
        ))}
      </div>

      <input
        placeholder="Otro monto"
        type="number"
        value={montoCustom}
        onChange={e => setMontoCustom(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Deja un mensaje (opcional)"
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: 'none', fontFamily: 'DM Sans, sans-serif' }}
      />

      <div style={{ fontSize: 11, color: '#8A7A6E', marginBottom: 10, marginTop: -2 }}>
        Esto permite mantener siempre gratuita la aplicación
      </div>

      {error && (
        <div style={{ color: '#C4977A', fontSize: 12, marginBottom: 8 }}>{error}</div>
      )}

      <button
        className="btn-main"
        onClick={handleApoyar}
        disabled={loading}
        style={{ marginTop: 4 }}
      >
        {loading ? 'Redirigiendo...' : `Apoyar con $${montoFinal ? montoFinal.toLocaleString('es-CL') : '0'}`}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid #E8D5B7',
  background: '#fff',
  fontSize: 16,
  color: '#3D3530',
  marginBottom: 10,
  outline: 'none',
  boxSizing: 'border-box'
};

export default ApoyoBanner;
