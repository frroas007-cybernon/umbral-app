// Service worker de Umbral.
// Estrategia: network-first con fallback a caché, y cacheo progresivo de todo
// lo que el usuario va visitando (en vez de una lista fija de archivos, que se
// rompe cada vez que cambian los nombres hasheados del build de React).
//
// IMPORTANTE: si se cambia esta lógica, subir el número de versión de CACHE
// para que 'activate' limpie la caché vieja.
const CACHE = 'umbral-v3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/audio1.mp3',
  '/afirmacion-calma.mp3',
  '/yoga2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const esMismoOrigen = url.origin === self.location.origin;
  const esApi = url.pathname.startsWith('/api/');

  // Deja pasar sin tocar: peticiones que no son GET, o que van a nuestro
  // backend (/api/*) o a servicios externos (Supabase, PostHog, Mercado Pago).
  // Esto evita cachear pagos, auth, o analítica.
  if (request.method !== 'GET' || !esMismoOrigen || esApi) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copia = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
