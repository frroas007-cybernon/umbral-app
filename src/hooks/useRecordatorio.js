import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '../supabase';
import { trackEvent, trackError } from '../analytics';

// Notificación local diaria que invita a practicar. No requiere backend ni
// push real: Capacitor programa la notificación en el propio dispositivo.
// Solo funciona dentro de la app instalada (Android/iOS), no en el navegador.
//
// La PREFERENCIA (activo/hora) se guarda en Supabase para usuarios con cuenta,
// igual que la racha (ver useRacha.js) — así es la misma en cualquier
// dispositivo donde inicien sesión. Lo que sí es local por naturaleza es la
// alarma del sistema operativo: no puede "viajar" sola entre dispositivos, así
// que cada vez que la app abre en un dispositivo nuevo, si el perfil dice que
// el recordatorio está activo, se vuelve a programar ahí mismo.
//
// Usuarios invitados (sin cuenta) siguen usando localStorage, igual que en
// useRacha.js, ya que no tienen fila propia en Supabase.

const esGuest = (user) => !user || user.id === 'guest';

const REMINDER_ID = 1001;
const KEY_ACTIVO = 'umbral_recordatorio_activo';
const KEY_HORA = 'umbral_recordatorio_hora'; // formato 'HH:MM'
const HORA_DEFECTO = '20:00';

const TITULOS = [
  'Un momento para ti 🌅',
  'Tu práctica te está esperando 🧘',
  'Un respiro antes de seguir 🌬️'
];

export function useRecordatorio(user) {
  const [activo, setActivo] = useState(false);
  const [hora, setHora] = useState(HORA_DEFECTO);
  const [permisoDenegado, setPermisoDenegado] = useState(false);
  const esNativo = Capacitor.isNativePlatform();
  const reprogramado = useRef(false);

  const programar = useCallback(async (horaTexto) => {
    if (!esNativo) return { ok: false, motivo: 'no-nativo' };

    const [h, m] = horaTexto.split(':').map(Number);

    try {
      const permiso = await LocalNotifications.requestPermissions();
      if (permiso.display !== 'granted') {
        setPermisoDenegado(true);
        trackEvent('recordatorio_permiso_denegado');
        return { ok: false, motivo: 'permiso-denegado' };
      }

      await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
      await LocalNotifications.schedule({
        notifications: [
          {
            id: REMINDER_ID,
            title: TITULOS[Math.floor(Math.random() * TITULOS.length)],
            body: 'Tómate unos minutos para respirar, meditar o hacer tu clase de yoga.',
            schedule: { on: { hour: h, minute: m }, repeats: true, allowWhileIdle: true }
          }
        ]
      });

      setPermisoDenegado(false);
      return { ok: true };
    } catch (err) {
      trackError(err, { origen: 'useRecordatorio programar' });
      return { ok: false, motivo: 'error' };
    }
  }, [esNativo]);

  useEffect(() => {
    let activoEfecto = true;

    const cargarLocal = () => {
      const a = localStorage.getItem(KEY_ACTIVO) === 'true';
      const h = localStorage.getItem(KEY_HORA) || HORA_DEFECTO;
      if (activoEfecto) {
        setActivo(a);
        setHora(h);
      }
    };

    const cargarDeSupabase = async () => {
      const { data, error } = await supabase
        .from('Perfiles')
        .select('recordatorio_activo, recordatorio_hora')
        .eq('id', user.id)
        .single();

      if (error) {
        trackError(error, { origen: 'useRecordatorio cargarDeSupabase' });
        cargarLocal();
        return;
      }

      const a = data?.recordatorio_activo || false;
      const h = data?.recordatorio_hora || HORA_DEFECTO;

      if (activoEfecto) {
        setActivo(a);
        setHora(h);
      }

      // El perfil dice que debería estar activo, pero la alarma es del
      // dispositivo: hay que volver a programarla aquí si aún no se hizo.
      if (a && esNativo && !reprogramado.current) {
        reprogramado.current = true;
        await programar(h);
      }
    };

    if (esGuest(user)) {
      cargarLocal();
    } else {
      cargarDeSupabase();
    }

    return () => { activoEfecto = false; };
  }, [user, esNativo, programar]);

  const guardarPreferencia = useCallback(async (nuevoActivo, nuevaHora) => {
    if (esGuest(user)) {
      localStorage.setItem(KEY_ACTIVO, nuevoActivo.toString());
      localStorage.setItem(KEY_HORA, nuevaHora);
      return;
    }

    const { error } = await supabase
      .from('Perfiles')
      .update({ recordatorio_activo: nuevoActivo, recordatorio_hora: nuevaHora })
      .eq('id', user.id);

    if (error) trackError(error, { origen: 'useRecordatorio guardarPreferencia' });
  }, [user]);

  const activarRecordatorio = useCallback(async (horaTexto) => {
    const resultado = await programar(horaTexto);
    if (resultado.ok) {
      setActivo(true);
      setHora(horaTexto);
      await guardarPreferencia(true, horaTexto);
      trackEvent('recordatorio_activado', { hora: horaTexto });
    }
    return resultado;
  }, [programar, guardarPreferencia]);

  const desactivarRecordatorio = useCallback(async () => {
    if (esNativo) {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
      } catch (err) {
        trackError(err, { origen: 'useRecordatorio desactivar' });
      }
    }
    setActivo(false);
    await guardarPreferencia(false, hora);
    trackEvent('recordatorio_desactivado');
  }, [esNativo, guardarPreferencia, hora]);

  const cambiarHora = useCallback(async (horaTexto) => {
    setHora(horaTexto);
    if (activo) {
      await programar(horaTexto);
      trackEvent('recordatorio_hora_cambiada', { hora: horaTexto });
    }
    await guardarPreferencia(activo, horaTexto);
  }, [activo, programar, guardarPreferencia]);

  return {
    activo,
    hora,
    esNativo,
    permisoDenegado,
    activarRecordatorio,
    desactivarRecordatorio,
    cambiarHora
  };
}
