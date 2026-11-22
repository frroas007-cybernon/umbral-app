import { Capacitor } from '@capacitor/core';

// PostHog se carga aparte, cuando la app ya se mostró: es la librería más pesada
// del proyecto y no hace falta para ver el Inicio. Lo que se registra antes de
// que termine de cargar queda en una cola y se envía apenas está listo.
let posthog = null;
let inicializado = false;
const cola = [];

function enviar(fn) {
  if (posthog) fn(posthog);
  else if (cola.length < 100) cola.push(fn);
}

export function initAnalytics() {
  const key = process.env.REACT_APP_POSTHOG_KEY;
  const host = process.env.REACT_APP_POSTHOG_HOST;

  if (!key || !host) {
    console.warn('PostHog: faltan REACT_APP_POSTHOG_KEY / REACT_APP_POSTHOG_HOST, analytics desactivado.');
    return;
  }
  inicializado = true;

  const cargar = () => import('posthog-js').then(({ default: ph }) => {
    ph.init(key, {
      api_host: host,
      person_profiles: 'always',
      capture_pageview: false, // pageviews manuales, una por pantalla
      capture_pageleave: true,
      autocapture: true
    });
    // Marca cada evento con si viene de la app instalada (Capacitor) o del navegador web.
    ph.register({
      plataforma: Capacitor.isNativePlatform() ? 'app' : 'web',
      plataforma_so: Capacitor.getPlatform()
    });
    posthog = ph;
    cola.splice(0).forEach((fn) => fn(ph));
  }).catch(() => { /* sin analítica si no carga */ });

  if (document.readyState === 'complete') setTimeout(cargar, 1500);
  else window.addEventListener('load', () => setTimeout(cargar, 1500), { once: true });

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
  enviar((ph) => ph.identify(user.id, {
    email: user.email,
    name: user.user_metadata?.name || user.user_metadata?.full_name || null,
    proveedor: user.app_metadata?.provider || null
  }));
}

export function resetUser() {
  if (!inicializado) return;
  enviar((ph) => ph.reset());
}

export function trackEvent(nombre, props = {}) {
  if (!inicializado) return;
  enviar((ph) => ph.capture(nombre, props));
}

export function trackPageview(pantalla) {
  if (!inicializado) return;
  enviar((ph) => ph.capture('$pageview', { pantalla }));
}

export function trackError(error, contexto = {}) {
  if (!inicializado) return;
  const err = error instanceof Error ? error : new Error(String(error));
  enviar((ph) => ph.captureException(err, contexto));
}
