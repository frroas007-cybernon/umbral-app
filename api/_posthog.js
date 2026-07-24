const { PostHog } = require('posthog-node');

let client = null;

function getPosthog() {
  const key = process.env.REACT_APP_POSTHOG_KEY;
  const host = process.env.REACT_APP_POSTHOG_HOST;

  if (!key || !host) return null;

  if (!client) {
    client = new PostHog(key, {
      host,
      flushAt: 1,
      flushInterval: 0
    });
  }
  return client;
}

async function trackServerEvent(distinctId, event, properties = {}) {
  const ph = getPosthog();
  if (!ph) return;
  ph.capture({ distinctId: distinctId || 'anonimo', event, properties });
  await ph.flush();
}

async function trackServerError(distinctId, error, properties = {}) {
  const ph = getPosthog();
  if (!ph) return;
  const err = error instanceof Error ? error : new Error(String(error));
  ph.captureException(err, distinctId || 'anonimo', properties);
  await ph.flush();
}

module.exports = { trackServerEvent, trackServerError };
