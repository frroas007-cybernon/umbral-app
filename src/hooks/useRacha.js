import { useState, useEffect } from 'react';

export function useRacha() {
  const [racha, setRacha] = useState(0);
  const [sesiones, setSesiones] = useState(0);

  useEffect(() => {
    const r = parseInt(localStorage.getItem('umbral_racha') || '0');
    const s = parseInt(localStorage.getItem('umbral_sesiones') || '0');
    setRacha(r);
    setSesiones(s);
  }, []);

  const marcarCompletada = (rating) => {
    const hoy = new Date().toDateString();
    const ultimaFecha = localStorage.getItem('umbral_ultima_fecha');
    const ayer = new Date(Date.now() - 86400000).toDateString();

    let nuevaRacha = racha;

    if (ultimaFecha === hoy) {
      // Ya completó hoy, no suma racha
    } else if (ultimaFecha === ayer) {
      // Día consecutivo
      nuevaRacha = racha + 1;
    } else {
      // Racha rota o primera vez
      nuevaRacha = 1;
    }

    const nuevasSesiones = sesiones + 1;

    localStorage.setItem('umbral_racha', nuevaRacha.toString());
    localStorage.setItem('umbral_sesiones', nuevasSesiones.toString());
    localStorage.setItem('umbral_ultima_fecha', hoy);
    if (rating > 0) {
      localStorage.setItem('umbral_ultimo_rating', rating.toString());
    }

    setRacha(nuevaRacha);
    setSesiones(nuevasSesiones);
  };

  return { racha, sesiones, marcarCompletada };
}