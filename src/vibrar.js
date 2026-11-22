// Vibración suave para acompañar momentos clave (empezar, cambiar de fase de
// respiración, terminar). Si el teléfono o el navegador no la soportan, no hace
// nada. Respeta a quien pidió reducir el movimiento.
export function vibrar(patron) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator.vibrate) navigator.vibrate(patron);
  } catch (e) {
    // sin vibración disponible
  }
}
