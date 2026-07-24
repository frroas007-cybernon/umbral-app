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
    const { amount, message, name, email, user_id } = req.body || {};
    const montoNumero = Number(amount);

    if (!montoNumero || montoNumero <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
    }

    const { data: apoyo, error: dbError } = await supabase
      .from('Apoyos')
      .insert({
        amount: montoNumero,
        message: message || null,
        name: name || null,
        email: email || null,
        user_id: user_id || null,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    await trackServerEvent(user_id, 'pago_iniciado', { amount: montoNumero, apoyo_id: apoyo.id });

    const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Apoyo a Umbral',
            quantity: 1,
            unit_price: montoNumero,
            currency_id: 'CLP'
          }
        ],
        external_reference: apoyo.id,
        back_urls: {
          success: `${siteUrl}/?apoyo=exito`,
          failure: `${siteUrl}/?apoyo=fallo`,
          pending: `${siteUrl}/?apoyo=pendiente`
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/webhook-mp`
      })
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.error('Error Mercado Pago:', mpData);
      await trackServerError(req.body?.user_id, new Error(mpData.message || 'Error creando preferencia MP'), { mpData });
      return res.status(500).json({ error: 'No se pudo crear la preferencia de pago' });
    }

    await supabase
      .from('Apoyos')
      .update({ mp_preference_id: mpData.id })
      .eq('id', apoyo.id);

    return res.status(200).json({ init_point: mpData.init_point });
  } catch (err) {
    console.error('Error en /api/crear-pago:', err);
    await trackServerError(req.body?.user_id, err, { origen: 'api/crear-pago catch' });
    return res.status(500).json({ error: 'Error inesperado creando el pago' });
  }
};
