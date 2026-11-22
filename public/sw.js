// Service worker de Umbral.
// Estrategia: network-first con fallback a caché, y cacheo progresivo de todo
// lo que el usuario va visitando (en vez de una lista fija de archivos, que se
// rompe cada vez que cambian los nombres hasheados del build de React).
//
// IMPORTANTE: si se cambia esta lógica, subir el número de versión de CACHE
// para que 'activate' limpie la caché vieja.
const CACHE = 'umbral-v6';
// Audios que la persona guardó para escuchar sin conexión: no se borran al actualizar.
const CACHE_AUDIO = 'umbral-audio';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];
// Los audios ya no se descargan al instalar (eran más de 20 MB en la primera visita):
// se guardan solo cuando la persona toca "Guardar para escuchar sin conexión".

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== CACHE_AUDIO).map((k) => caches.delete(k)))
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

  // Audios: si la persona lo guardó sin conexión, se sirve desde ahí; si no,
  // va directo a la red sin guardarse (para no llenar el teléfono).
  if (/\.(mp3|m4a)$/.test(url.pathname)) {
    event.respondWith(caches.match(request.url).then((guardado) => guardado || fetch(request)));
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
      .catch(() =>
        caches.match(request).then((cached) => {
          // Sin conexión, cualquier página de la app (ej. /meditaciones/...)
          // se resuelve con el index.html guardado.
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('/index.html');
          return undefined;
        })
      )
  );
});
