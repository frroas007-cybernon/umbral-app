// Mapa entre las pantallas internas de la app y sus URLs.
// Cada pantalla tiene su propia dirección, para poder compartirla y para que
// funcione el botón "atrás" del navegador.

const SESIONES_SLUG = {
  1: 'respiracion-la-base-de-todo',
  2: 'imaginacion-que-purifica',
  3: 'observacion-que-libera',
};

const YOGA_SLUG = {
  1: 'conecta-con-tu-cuerpo',
  2: 'movimiento-que-libera',
};

const RUTAS_FIJAS = {
  home: '/',
  meditaciones: '/meditaciones',
  afirmaciones: '/afirmaciones',
  'afirmacion-detalle': '/afirmaciones/calma',
  yoga: '/yoga',
  perfil: '/perfil',
  'editar-perfil': '/perfil/editar',
  login: '/perfil/ingresar',
  privacy: '/perfil/privacidad',
  respirar: '/respirar',
};

export function pathDe(screen, param) {
  if (screen === 'sesion') {
    const slug = SESIONES_SLUG[param] || SESIONES_SLUG[1];
    return `/meditaciones/${slug}`;
  }
  if (screen === 'yoga-detalle') {
    const slug = YOGA_SLUG[param] || YOGA_SLUG[1];
    return `/yoga/${slug}`;
  }
  return RUTAS_FIJAS[screen] || '/';
}

// Devuelve { screen, param } para una URL, o null si la URL no existe.
export function pantallaDe(pathname) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';

  for (const [screen, ruta] of Object.entries(RUTAS_FIJAS)) {
    if (ruta === path) return { screen, param: null };
  }

  const sesion = path.match(/^\/meditaciones\/([^/]+)$/);
  if (sesion) {
    const id = Object.keys(SESIONES_SLUG).find((k) => SESIONES_SLUG[k] === sesion[1]);
    if (id) return { screen: 'sesion', param: Number(id) };
  }

  const clase = path.match(/^\/yoga\/([^/]+)$/);
  if (clase) {
    const id = Object.keys(YOGA_SLUG).find((k) => YOGA_SLUG[k] === clase[1]);
    if (id) return { screen: 'yoga-detalle', param: Number(id) };
  }

  return null;
}
