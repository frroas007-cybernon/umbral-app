import React from 'react';

function EliminarCuentaModal({ visible, onClose, onConfirm, loading, error }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        
        <div className="modal-estado">Eliminar cuenta</div>
        <div className="modal-frase">
          Esta acción es permanente. Se eliminará tu perfil, tus datos personales y tu historial de práctica. No podrás recuperar tu cuenta.
        </div>

        {error && (
          <div style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 8 }}>
            {error}
          </div>
        )}

        <button
          className="btn-main"
          style={{ background: 'var(--error)' }}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
        </button>
        <button
          className="btn-sec"
          style={{ marginTop: 10 }}
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EliminarCuentaModal;
