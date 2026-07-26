import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { trackError } from '../analytics';

// Usuarios invitados (sin cuenta) siguen usando localStorage, ya que no tienen
// una fila propia en Supabase donde guardar esto.
const esGuest = (user) => !user || user.id === 'guest';

// La racha (días seguidos) es única y general — cualquier tipo de práctica la
// mantiene viva. Lo que sí se separa por tipo es el conteo de sesiones y la
// última calificación, para poder ver/analizar cada categoría por separado.
const COLUMNA_SESIONES = {
  meditacion: 'sesiones_meditacion',
  afirmacion: 'sesiones_afirmacion',
  yoga: 'sesiones_yoga'
};
const COLUMNA_RATING = {
  meditacion: 'rating_meditacion',
  afirmacion: 'rating_afirmacion',
  yoga: 'rating_yoga'
};

export function useRacha(user, tipo) {
  const [racha, setRacha] = useState(0);
  const [sesiones, setSesiones] = useState(0);
  const [sesionesPorTipo, setSesionesPorTipo] = useState({ meditacion: 0, afirmacion: 0, yoga: 0 });
  const [ultimaFecha, setUltimaFecha] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarLocal = () => {
      const r = parseInt(localStorage.getItem('umbral_racha') || '0');
      const s = parseInt(localStorage.getItem('umbral_sesiones') || '0');
      const f = localStorage.getItem('umbral_ultima_fecha') || null;
      const porTipo = {
        meditacion: parseInt(localStorage.getItem('umbral_sesiones_meditacion') || '0'),
        afirmacion: parseInt(localStorage.getItem('umbral_sesiones_afirmacion') || '0'),
        yoga: parseInt(localStorage.getItem('umbral_sesiones_yoga') || '0')
      };
      if (activo) {
        setRacha(r);
        setSesiones(s);
        setSesionesPorTipo(porTipo);
        setUltimaFecha(f);
      }
    };

    const cargarDeSupabase = async () => {
      const { data, error } = await supabase
        .from('Perfiles')
        .select('racha_actual, sesiones_completadas, ultima_fecha_practica, sesiones_meditacion, sesiones_afirmacion, sesiones_yoga')
        .eq('id', user.id)
        .single();

      if (error) {
        trackError(error, { origen: 'useRacha cargarDeSupabase' });
        cargarLocal(); // si falla la carga, no deja al usuario en 0 sin explicación
        return;
      }

      let rFinal = data?.racha_actual || 0;
      let sFinal = data?.sesiones_completadas || 0;
      let fFinal = data?.ultima_fecha_practica || null;
      let porTipoFinal = {
        meditacion: data?.sesiones_meditacion || 0,
        afirmacion: data?.sesiones_afirmacion || 0,
        yoga: data?.sesiones_yoga || 0
      };

      if (activo) {
        setRacha(rFinal);
        setSesiones(sFinal);
        setSesionesPorTipo(porTipoFinal);
        setUltimaFecha(fFinal);
      }
    };

    if (esGuest(user)) {
      cargarLocal();
    } else {
      cargarDeSupabase();
    }

    return () => { activo = false; };
  }, [user]);

  // Se llama al tocar "Marcar como completada" — siempre cuenta, sin importar
  // si después se califica o no la sesión (eso es un paso aparte y opcional).
  const marcarCompletada = async () => {
    const hoy = new Date().toDateString();
    const ayer = new Date(Date.now() - 86400000).toDateString();

    let nuevaRacha = racha;
    if (ultimaFecha === hoy) {
      // Ya completó hoy, no suma racha
    } else if (ultimaFecha === ayer) {
      nuevaRacha = racha + 1;
    } else {
      nuevaRacha = 1;
    }

    const nuevasSesiones = sesiones + 1;
    const columnaTipo = COLUMNA_SESIONES[tipo];
    const nuevoValorTipo = tipo ? (sesionesPorTipo[tipo] || 0) + 1 : null;
    const nuevoPorTipo = tipo ? { ...sesionesPorTipo, [tipo]: nuevoValorTipo } : sesionesPorTipo;

    setRacha(nuevaRacha);
    setSesiones(nuevasSesiones);
    setSesionesPorTipo(nuevoPorTipo);
    setUltimaFecha(hoy);

    if (esGuest(user)) {
      localStorage.setItem('umbral_racha', nuevaRacha.toString());
      localStorage.setItem('umbral_sesiones', nuevasSesiones.toString());
      localStorage.setItem('umbral_ultima_fecha', hoy);
      if (tipo) {
        localStorage.setItem(`umbral_sesiones_${tipo}`, nuevoValorTipo.toString());
      }
      return;
    }

    const { error } = await supabase
      .from('Perfiles')
      .update({
        racha_actual: nuevaRacha,
        sesiones_completadas: nuevasSesiones,
        ultima_fecha_practica: hoy,
        ...(columnaTipo ? { [columnaTipo]: nuevoValorTipo } : {})
      })
      .eq('id', user.id);

    if (error) trackError(error, { origen: 'useRacha marcarCompletada' });
  };

  // Paso aparte y opcional: guarda la calificación (1-5 estrellas) si el
  // usuario decide darla. No toca racha ni sesiones, esas ya se contaron.
  // Se guarda por tipo de sesión (meditación/afirmación/yoga por separado).
  const guardarRating = async (rating) => {
    if (!rating || rating <= 0) return;

    if (esGuest(user)) {
      if (tipo) localStorage.setItem(`umbral_rating_${tipo}`, rating.toString());
      return;
    }

    const columnaRating = COLUMNA_RATING[tipo];
    if (!columnaRating) return;

    const { error } = await supabase
      .from('Perfiles')
      .update({ [columnaRating]: rating })
      .eq('id', user.id);

    if (error) trackError(error, { origen: 'useRacha guardarRating' });
  };

  return { racha, sesiones, sesionesPorTipo, marcarCompletada, guardarRating };
}
