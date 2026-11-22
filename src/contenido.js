// Contenido aprobado por Francisco (documento "Umbral: tarjetas de ánimo", 22 nov 2026).
// Cada tarjeta: nombra lo que siente la persona, una micro práctica de 30 a 60 s
// y la sesión a la que sigue (clave de PRACTICAS en Home).

export const TARJETAS_ANIMO = {
  ansioso: [
    { nombra: 'Tu cuerpo se está preparando para algo que todavía no pasa. Estás aquí, y aquí estás a salvo.', practica: 'Inhala en 4 tiempos y exhala en 6. Hazlo tres veces, soltando los hombros en cada exhalación.', sigue: 'respirar' },
    { nombra: 'La ansiedad acelera todo. No tienes que resolverlo ahora, solo volver a este momento.', practica: 'Nombra en voz baja 5 cosas que ves, 4 que puedes tocar y 3 que escuchas.', sigue: 'respiracion' },
    { nombra: 'Un pensamiento que asusta no es un hecho. Puedes mirarlo sin creerle.', practica: 'Pon una mano en el pecho y otra en el abdomen. Respira hasta que se mueva más la de abajo, cinco veces.', sigue: 'respiracion' },
    { nombra: 'Sentir ansiedad no significa que algo esté mal contigo. Es una señal, no una sentencia.', practica: 'Inhala por la nariz, y antes de exhalar toma un segundo sorbo corto de aire. Suelta todo lento por la boca. Tres veces.', sigue: 'respirar' },
  ],
  tenso: [
    { nombra: 'Estás sosteniendo más de lo que crees. Tu cuerpo lo sabe antes que tú.', practica: 'Aprieta los puños y sube los hombros 5 segundos. Suelta de golpe y nota la diferencia. Dos veces.', sigue: 'yoga' },
    { nombra: 'No necesitas tenerlo todo bajo control para estar bien un momento.', practica: 'Afloja la mandíbula: separa un poco los dientes y deja la lengua suelta. Respira así 30 segundos.', sigue: 'respirar' },
    { nombra: 'Llevas un rato en modo alerta. Puedes bajar la guardia unos minutos.', practica: 'Gira el cuello lento hacia un lado y hacia el otro, tres veces, exhalando en cada giro.', sigue: 'yoga' },
    { nombra: 'La tensión es energía que no encontró salida. Déjala moverse.', practica: 'Sacude las manos y los brazos 15 segundos, como si te secaras sin toalla. Después quédate quieto y siente.', sigue: 'yoga' },
  ],
  bien: [
    { nombra: 'Hoy llegas bien. Vale la pena notarlo en vez de pasar de largo.', practica: 'Cierra los ojos y nota dónde sientes ese bienestar en el cuerpo. Quédate ahí tres respiraciones.', sigue: 'imaginacion' },
    { nombra: 'El bienestar también se entrena. Lo que miras, crece.', practica: 'Piensa en tres cosas concretas que salieron bien hoy, por pequeñas que sean.', sigue: 'calma' },
    { nombra: 'Estás en un buen lugar para ir un poco más profundo.', practica: 'Respira lento y en cada exhalación repite por dentro: "estoy aquí". Cinco veces.', sigue: 'imaginacion' },
    { nombra: 'Este estado también es tuyo. Puedes volver a él cuando lo necesites.', practica: 'Elige un gesto pequeño, como juntar el pulgar y el índice, y hazlo mientras respiras hondo tres veces. Será tu ancla.', sigue: 'imaginacion' },
  ],
  tranquilo: [
    { nombra: 'Llegas en calma. No hace falta hacer nada más que estar.', practica: 'Escucha el sonido más lejano que puedas oír. Después el más cercano. Treinta segundos.', sigue: 'calma' },
    { nombra: 'La calma no es la ausencia de ruido, es cómo lo recibes.', practica: 'Mira un punto fijo y suaviza la mirada hasta ver todo el borde de lo que tienes delante. Respira ahí.', sigue: 'observacion' },
    { nombra: 'Este es un buen momento para escucharte sin apuro.', practica: 'Pregúntate en silencio "¿qué necesito hoy?" y espera la respuesta tres respiraciones, sin buscarla.', sigue: 'calma' },
    { nombra: 'Lo que cultivas en calma te sostiene cuando llega el movimiento.', practica: 'Cuenta diez respiraciones lentas. Si te distraes, vuelve a uno sin juzgarte.', sigue: 'observacion' },
  ],
  paz: [
    { nombra: 'Hay un espacio en ti que no depende de lo que pase afuera. Hoy lo estás tocando.', practica: 'Observa el pequeño silencio entre que termina una exhalación y empieza la siguiente. Tres veces.', sigue: 'observacion' },
    { nombra: 'Desde la paz se ve todo más claro. Es un buen momento para mirar hacia adentro.', practica: 'Deja que los pensamientos pasen como nubes. No los sigas: solo nótalos y vuelve a la respiración. Un minuto.', sigue: 'observacion' },
    { nombra: 'Esta paz no se gana, se recuerda. Siempre ha estado ahí.', practica: 'Pon atención en todo el cuerpo a la vez, de la cabeza a los pies, como si fuera una sola sensación. Treinta segundos.', sigue: 'observacion' },
    { nombra: 'Lo que sientes ahora también puedes compartirlo. La calma se contagia.', practica: 'Piensa en alguien que quieres y envíale en silencio un deseo de bienestar, en tres respiraciones.', sigue: 'imaginacion' },
  ],
};

// Frase grande del Inicio: cambia cada día dentro de su momento.
export const FRASES_PORTADA = {
  amanecer: [
    { titulo: 'El día aún no empieza.', sub: 'Tienes unos minutos antes de que todo se mueva.' },
    { titulo: 'Empieza por dentro.', sub: 'Antes de revisar el teléfono, revísate a ti.' },
    { titulo: 'Hoy es nuevo.', sub: 'No cargues con el día de ayer.' },
    { titulo: 'Despierta despacio.', sub: 'El cuerpo también necesita llegar.' },
  ],
  dia: [
    { titulo: 'Haz una pausa.', sub: 'Unos minutos para volver a ti en medio del día.' },
    { titulo: 'Vuelve al cuerpo.', sub: 'La mente corre; tú puedes caminar.' },
    { titulo: 'Respira antes de seguir.', sub: 'Lo que viene sale mejor desde la calma.' },
    { titulo: 'Una cosa a la vez.', sub: 'No tienes que hacerlo todo ahora.' },
  ],
  atardecer: [
    { titulo: 'Suelta el día.', sub: 'Lo que pasó, ya pasó. Ahora puedes bajar el ritmo.' },
    { titulo: 'Hiciste suficiente.', sub: 'Lo que faltó puede esperar a mañana.' },
    { titulo: 'Baja el volumen.', sub: 'El día se despide, tú también puedes.' },
    { titulo: 'Mira hacia adentro.', sub: 'Antes de que caiga la noche, revisa cómo estás.' },
  ],
  noche: [
    { titulo: 'Es hora de bajar el ritmo.', sub: 'Prepara el cuerpo y la mente para descansar.' },
    { titulo: 'Deja el día afuera.', sub: 'Lo que no se resolvió también puede dormir.' },
    { titulo: 'Descansar también es avanzar.', sub: 'Tu cuerpo hace su trabajo mientras duermes.' },
    { titulo: 'Afloja todo.', sub: 'Empieza por la frente y termina en los pies.' },
  ],
};

export function fraseDelDia(momento, fecha = new Date()) {
  const inicioAnio = new Date(fecha.getFullYear(), 0, 0);
  const dia = Math.floor((fecha - inicioAnio) / 86400000);
  const lista = FRASES_PORTADA[momento];
  return lista[dia % lista.length];
}
