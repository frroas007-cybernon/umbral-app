// Recuerda la proporción de cada foto de portada ya cargada, para que al volver
// a una pantalla la foto ocupe su alto desde el primer cuadro (sin saltos).
const proporciones = new Map();

export const proporcionDe = (src) => proporciones.get(src) || null;

export function medirProporcion(src, img, setProporcion) {
  const p = img.naturalWidth / img.naturalHeight;
  proporciones.set(src, p);
  setProporcion(p);
}
