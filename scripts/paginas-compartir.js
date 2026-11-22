// Genera una página por cada práctica con su título, descripción y foto
// (etiquetas Open Graph), para que al compartir un enlace en WhatsApp, Instagram
// o iMessage la vista previa muestre esa práctica. La página es la misma app:
// solo cambia la cabecera. Se ejecuta después de "npm run build" (postbuild).
const fs = require('fs');
const path = require('path');

const SITIO = 'https://www.umbralapp.lat';
const BUILD = path.join(__dirname, '..', 'build');

const PAGINAS = [
  { ruta: '/', titulo: 'Umbral: meditación en español', desc: 'Meditaciones guiadas, afirmaciones y yoga en español. Gratis, desde Chile.', img: 'inicio' },
  { ruta: '/meditaciones', titulo: 'Meditaciones | Umbral', desc: 'Tres sesiones guiadas para empezar a meditar. Tu punto de partida hacia la calma.', img: 'meditaciones' },
  { ruta: '/meditaciones/respiracion-la-base-de-todo', titulo: 'Respiración, la base de todo | Umbral', desc: 'Meditación guiada de 11 minutos para usar la respiración como ancla al momento presente.', img: 'respiracion-la-base-de-todo' },
  { ruta: '/meditaciones/imaginacion-que-purifica', titulo: 'Imaginación que purifica | Umbral', desc: 'Meditación guiada de 15 minutos: visualiza una luz que recorre tu cuerpo y te libera de lo que no necesitas cargar.', img: 'imaginacion-que-purifica' },
  { ruta: '/meditaciones/observacion-que-libera', titulo: 'Observación que libera | Umbral', desc: 'Meditación guiada de 18 minutos para observar tus pensamientos sin engancharte en ellos.', img: 'observacion-que-libera' },
  { ruta: '/afirmaciones', titulo: 'Afirmaciones | Umbral', desc: 'Frases para reprogramar tu subconsciente, guiadas en español.', img: 'calma' },
  { ruta: '/afirmaciones/calma', titulo: 'Afirmaciones para la calma | Umbral', desc: 'Diez minutos de afirmaciones para instalar la calma como tu estado natural.', img: 'calma' },
  { ruta: '/yoga', titulo: 'Yoga | Umbral', desc: 'Clases cortas de yoga para todos los niveles, guiadas por Caty.', img: 'yoga' },
  { ruta: '/yoga/conecta-con-tu-cuerpo', titulo: 'Conecta con tu cuerpo, yoga suave | Umbral', desc: 'Clase de yoga de 11 minutos para todos los niveles. Movimientos simples para volver a habitar tu cuerpo.', img: 'conecta-con-tu-cuerpo' },
  { ruta: '/yoga/movimiento-que-libera', titulo: 'Movimiento que libera, yoga para soltar tensión | Umbral', desc: 'Clase de yoga de 13 minutos: movimientos fluidos guiados por la respiración para liberar tensión.', img: 'movimiento-que-libera' },
  { ruta: '/respirar', titulo: 'Un minuto para respirar | Umbral', desc: 'Seis respiraciones lentas, guiadas. Un minuto para volver a ti.', img: 'respirar' },
];

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function cabecera(p) {
  const url = SITIO + (p.ruta === '/' ? '/' : p.ruta);
  const img = `${SITIO}/og/${p.img}.jpg`;
  return [
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Umbral">`,
    `<meta property="og:locale" content="es_CL">`,
    `<meta property="og:title" content="${escapar(p.titulo)}">`,
    `<meta property="og:description" content="${escapar(p.desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="canonical" href="${url}">`,
  ].join('');
}

const base = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
if (!base.includes('</head>')) throw new Error('index.html sin </head>');

const salida = path.join(BUILD, 'compartir');
fs.mkdirSync(salida, { recursive: true });

for (const p of PAGINAS) {
  let html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${escapar(p.titulo)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapar(p.desc)}"/>`)
    .replace('</head>', `${cabecera(p)}</head>`);
  if (p.ruta === '/') {
    fs.writeFileSync(path.join(BUILD, 'index.html'), html);
  } else {
    fs.writeFileSync(path.join(salida, `${p.ruta.slice(1).replace(/\//g, '--')}.html`), html);
  }
}
console.log(`Páginas para compartir: ${PAGINAS.length}`);
