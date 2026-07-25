const { createClient } = require('@supabase/supabase-js');
const { trackServerEvent, trackServerError } = require('./_posthog');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_token } = req.body || {};
    if (!access_token) {
      return res.status(400).json({ error: 'Falta access_token' });
    }

    // Verifica que el token sea válido y obtiene el usuario real detrás de él
    // (nunca confiamos en un user_id que venga directo del cliente para esta acción)
    const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    const userId = userData.user.id;

    // Anonimiza los registros de apoyo/pago: se conserva la transacción (monto, estado, fechas)
    // por trazabilidad contable, pero se borra todo dato personal asociado.
    await supabase
      .from('Apoyos')
      .update({ user_id: null, name: null, email: null, message: null })
      .eq('user_id', userId);

    // Elimina el perfil
    await supabase.from('Perfiles').delete().eq('id', userId);

    // Elimina la cuenta de autenticación (esto invalida la sesión del usuario)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      await trackServerError(userId, deleteError, { origen: 'eliminar-cuenta admin.deleteUser' });
      return res.status(500).json({ error: 'No se pudo eliminar la cuenta' });
    }

    await trackServerEvent(userId, 'cuenta_eliminada', {});

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error en /api/eliminar-cuenta:', err);
    await trackServerError(null, err, { origen: 'api/eliminar-cuenta catch' });
    return res.status(500).json({ error: 'Error inesperado eliminando la cuenta' });
  }
};
