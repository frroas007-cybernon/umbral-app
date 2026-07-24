const { createClient } = require('@supabase/supabase-js');
const { trackServerEvent, trackServerError } = require('./_posthog');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    const type = req.query.type || req.body?.type || req.query.topic;
    const paymentId = req.query['data.id'] || req.body?.data?.id || req.query.id;

    if (type !== 'payment' || !paymentId) {
      return res.status(200).send('ok');
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const payment = await mpRes.json();

    if (!mpRes.ok) {
      console.error('Error consultando pago en Mercado Pago:', payment);
      await trackServerError(null, new Error(payment.message || 'Error consultando pago MP'), { paymentId });
      return res.status(200).send('ok');
    }

    const apoyoId = payment.external_reference;
    const status = payment.status;

    if (apoyoId) {
      const { data: apoyoActualizado } = await supabase
        .from('Apoyos')
        .update({ status, mp_payment_id: String(paymentId) })
        .eq('id', apoyoId)
        .select('user_id, amount')
        .single();

      const distinctId = apoyoActualizado?.user_id;
      const eventoNombre = status === 'approved'
        ? 'pago_aprobado'
        : status === 'rejected'
          ? 'pago_rechazado'
          : 'pago_estado_actualizado';

      await trackServerEvent(distinctId, eventoNombre, {
        amount: apoyoActualizado?.amount,
        status,
        apoyo_id: apoyoId,
        mp_payment_id: paymentId
      });
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('Error en /api/webhook-mp:', err);
    await trackServerError(null, err, { origen: 'api/webhook-mp catch' });
    return res.status(200).send('ok');
  }
};
