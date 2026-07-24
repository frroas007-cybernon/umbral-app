const { createClient } = require('@supabase/supabase-js');

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
      return res.status(200).send('ok');
    }

    const apoyoId = payment.external_reference;
    const status = payment.status;

    if (apoyoId) {
      await supabase
        .from('Apoyos')
        .update({ status, mp_payment_id: String(paymentId) })
        .eq('id', apoyoId);
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('Error en /api/webhook-mp:', err);
    return res.status(200).send('ok');
  }
};
