import posthog from 'posthog-js';

let inicializado = false;

export function initAnalytics() {
  const key = process.env.REACT_APP_POSTHOG_KEY;
  const host = process.env.REACT_APP_POSTHOG_HOST;

  if (!key || !host) {
    console.warn('PostHog: faltan REACT_APP_POSTHOG_KEY / REACT_APP_POSTHOG_HOST, analytics desactivado.');
    return;
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: 'always',
    capture_pageview: false, // hacemos pageviews manuales porque no usamos rutas reales
    capture_pageleave: true,
    autocapture: true
  });

  inicializado = true;

  // Errores no capturados en ningún try/catch
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, { origen: 'window.onerror' });
  });
  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason, { origen: 'unhandledrejection' });
  });
}

export function identifyUser(user) {
  if (!inicializado || !user || user.id === 'guest') return;
  posthog.identify(user.id, {
    email: user.email,
    name: user.user_metadata?.name || user.user_metadata?.full_name || null,
    proveedor: user.app_metadata?.provider || null
  });
}

export function resetUser() {
  if (!inicializado) return;
  posthog.reset();
}

export function trackEvent(nombre, props = {}) {
  if (!inicializado) return;
  posthog.capture(nombre, props);
}

export function trackPageview(pantalla) {
  if (!inicializado) return;
  posthog.capture('$pageview', { pantalla });
}

export function trackError(error, contexto = {}) {
  if (!inicializado) return;
  const err = error instanceof Error ? error : new Error(String(error));
  posthog.captureException(err, contexto);
}
