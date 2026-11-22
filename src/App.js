import React, { useState, useEffect, useRef, Suspense, use } from 'react';
import { flushSync } from 'react-dom';
import './App.css';
import Home from './screens/Home';

import MoodModal from './components/MoodModal';
import Splash from './components/Splash';
import { supabase } from './supabase';
import { identifyUser, resetUser, trackPageview, trackEvent } from './analytics';
import { pathDe, pantallaDe } from './routes';

// Las pantallas que no son el Inicio se cargan aparte, para que la app abra más rápido.
// Una vez descargada, una pantalla se muestra al instante (sin pasar por Suspense),
// así la transición nunca captura una pantalla vacía.
function perezoso(cargarModulo) {
  let modulo = null;
  let promesa = null;
  const cargar = () => promesa || (promesa = cargarModulo().then((m) => { modulo = m; return m; }));
  function Pantalla(props) {
    const m = modulo || use(cargar());
    const Componente = m.default;
    return <Componente {...props} />;
  }
  Pantalla.cargar = cargar;
  return Pantalla;
}

const Meditaciones = perezoso(() => import('./screens/Meditaciones'));
const Sesion = perezoso(() => import('./screens/Sesion'));
const Afirmaciones = perezoso(() => import('./screens/Afirmaciones'));
const AfirmacionDetalle = perezoso(() => import('./screens/AfirmacionDetalle'));
const Yoga = perezoso(() => import('./screens/Yoga'));
const YogaDetalle = perezoso(() => import('./screens/YogaDetalle'));
const Perfil = perezoso(() => import('./screens/Perfil'));
const EditarPerfil = perezoso(() => import('./screens/EditarPerfil'));
const Privacy = perezoso(() => import('./screens/Privacy'));
const Login = perezoso(() => import('./screens/Login'));
const CompletarPerfil = perezoso(() => import('./screens/CompletarPerfil'));
const Respirar = perezoso(() => import('./screens/Respirar'));

const PANTALLAS = {
  meditaciones: Meditaciones, sesion: Sesion, afirmaciones: Afirmaciones,
  'afirmacion-detalle': AfirmacionDetalle, yoga: Yoga, 'yoga-detalle': YogaDetalle,
  perfil: Perfil, 'editar-perfil': EditarPerfil, privacy: Privacy, login: Login, respirar: Respirar,
};

// Transición entre pantallas. Ir hacia adentro (de una sección a una clase)
// desliza la nueva pantalla desde la derecha; volver la desliza desde la izquierda;
// moverse entre secciones del mismo nivel es un fundido. Usa View Transitions
// cuando el navegador la tiene; si no, la pantalla nueva solo aparece con un fundido.
const PROFUNDIDAD = {
  home: 0,
  meditaciones: 1, afirmaciones: 1, yoga: 1, perfil: 1, respirar: 1,
  sesion: 2, 'afirmacion-detalle': 2, 'yoga-detalle': 2, 'editar-perfil': 2, privacy: 2, login: 2,
};

function sinMovimiento() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
}

function conTransicion(desde, hacia, cambiar) {
  const pantalla = PANTALLAS[hacia];
  if (pantalla) {
    // Primero se asegura la descarga de la pantalla; si falla, se cambia igual.
    pantalla.cargar().then(() => transicionar(desde, hacia, cambiar), () => cambiar());
  } else {
    transicionar(desde, hacia, cambiar);
  }
}

// Espera (máximo 180 ms) a que las fotos visibles de la pantalla nueva estén
// cargadas, para que entre completa y no con fotos apareciendo a medias.
function fotosListas() {
  const alto = window.innerHeight;
  const fotos = [...document.querySelectorAll('.screen img, .programa img')]
    .filter((img) => !img.complete && img.getBoundingClientRect().top < alto);
  const cargas = fotos.map((img) => new Promise((ok) => {
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', ok, { once: true });
  }));
  const limite = new Promise((ok) => setTimeout(ok, 180));
  return Promise.race([Promise.all(cargas), limite])
    // Un respiro para que React aplique la proporción de la foto recién medida.
    // (Aquí no sirve requestAnimationFrame: el navegador no pinta durante la transición.)
    .then(() => new Promise((ok) => setTimeout(ok, 16)));
}

function transicionar(desde, hacia, cambiar) {
  const raiz = document.documentElement;
  if (!document.startViewTransition || sinMovimiento()) {
    cambiar();
    return;
  }
  const a = PROFUNDIDAD[desde] ?? 1;
  const b = PROFUNDIDAD[hacia] ?? 1;
  raiz.dataset.transicion = b > a ? 'adentro' : b < a ? 'afuera' : 'lado';
  const t = document.startViewTransition(async () => {
    flushSync(cambiar);
    await fotosListas();
  });
  t.finished.finally(() => { delete raiz.dataset.transicion; });
}

// Pantalla inicial según la URL con que se abre la app (ej. un enlace compartido).
// Una URL desconocida lleva al inicio.
const inicial = pantallaDe(window.location.pathname) || { screen: 'home', param: null };
if (!pantallaDe(window.location.pathname)) {
  window.history.replaceState(null, '', '/' + window.location.search + window.location.hash);
}

function App() {
  const [screen, setScreen] = useState(inicial.screen);
  const [screenParam, setScreenParam] = useState(inicial.param);
  const pantallaActual = useRef(inicial.screen);
  pantallaActual.current = screen;
  const [modalMood, setModalMood] = useState(null);
  const [showSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      setLoadingAuth(false);
      if (sessionUser) identifyUser(sessionUser);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        identifyUser(sessionUser);
      } else {
        resetUser();
      }
    });
  }, []);

  // Sin sesión real: se entra directo como invitado, sin pantalla de login de por medio.
  // Crear cuenta / iniciar sesión queda disponible desde Perfil cuando la persona lo decida.
  useEffect(() => {
    if (!loadingAuth && !user) {
      setUser({ id: 'guest', email: 'guest' });
    }
  }, [loadingAuth, user]);

  useEffect(() => {
    if (!user || user.id === 'guest') {
      setNeedsProfile(false);
      return;
    }
    setNeedsProfile(null);
    supabase
      .from('Perfiles')
      .select('gender, date_of_birth, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const incompleto = !data || !data.gender || !data.date_of_birth;
        setNeedsProfile(incompleto);
        setAvatarUrl(data?.avatar_url || null);
      });
  }, [user]);

  const navigate = (dest, param = null) => {
    if (dest === screen && param === screenParam) return; // ya estamos ahí
    conTransicion(screen, dest, () => {
      setScreen(dest);
      setScreenParam(param);
    });
    const nuevoPath = pathDe(dest, param);
    if (nuevoPath !== window.location.pathname) {
      window.history.pushState({ screen: dest, param }, '', nuevoPath);
    }
    window.scrollTo(0, 0);
    trackPageview(dest);
  };

  // Después de abrir, se precargan las demás pantallas sin bloquear el Inicio.
  useEffect(() => {
    const precargar = () => [
      Meditaciones, Sesion, Afirmaciones, AfirmacionDetalle, Yoga, YogaDetalle, Perfil, Respirar,
    ].forEach((p) => p.cargar().catch(() => {}));
    const t = setTimeout(precargar, 2500);
    return () => clearTimeout(t);
  }, []);

  // Botón "atrás" / "adelante" del navegador.
  useEffect(() => {
    const onPopState = () => {
      const destino = pantallaDe(window.location.pathname) || { screen: 'home', param: null };
      conTransicion(pantallaActual.current, destino.screen, () => {
        setScreen(destino.screen);
        setScreenParam(destino.param);
      });
      trackPageview(destino.screen);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const primeraVistaTrackeada = useRef(false);
  useEffect(() => {
    if (user && needsProfile === false && !primeraVistaTrackeada.current) {
      primeraVistaTrackeada.current = true;
      trackPageview(inicial.screen);
    }
  }, [user, needsProfile]);

  if (loadingAuth || !user || (user.id !== 'guest' && needsProfile === null)) return <div className="app"><Splash visible /></div>;

  if (needsProfile) return (
    <div className="app">
      <Suspense fallback={<Splash visible />}>
        <CompletarPerfil user={user} onComplete={() => setNeedsProfile(false)} />
      </Suspense>
    </div>
  );

  return (
    <div className="app">
      <Suspense fallback={<div className="screen" />}>
      {screen === 'home' && <Home onNavigate={navigate} onMood={setModalMood} user={user} avatarUrl={avatarUrl} />}
      {screen === 'meditaciones' && <Meditaciones onNavigate={navigate} user={user} />}
      {screen === 'sesion' && <Sesion onNavigate={navigate} user={user} sesionId={screenParam} />}
      {screen === 'afirmaciones' && <Afirmaciones onNavigate={navigate} user={user} />}
      {screen === 'afirmacion-detalle' && <AfirmacionDetalle onNavigate={navigate} user={user} />}
      {screen === 'yoga' && <Yoga onNavigate={navigate} user={user} />}
      {screen === 'yoga-detalle' && <YogaDetalle onNavigate={navigate} user={user} claseId={screenParam} />}
      {screen === 'perfil' && <Perfil onNavigate={navigate} user={user} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} onLogout={() => { trackEvent('logout'); supabase.auth.signOut(); setUser(null); }} />}
      {screen === 'editar-perfil' && <EditarPerfil onNavigate={navigate} user={user} />}
      {screen === 'privacy' && <Privacy onNavigate={navigate} />}
      {screen === 'respirar' && <Respirar onNavigate={navigate} />}
      {screen === 'login' && (
        <Login
          onNavigate={navigate}
          onLogin={(u) => {
            setUser(u);
            navigate('perfil');
          }}
        />
      )}
      </Suspense>
      <MoodModal mood={modalMood} onClose={() => setModalMood(null)} />
      <Splash visible={showSplash} />
    </div>
  );
}

export default App;