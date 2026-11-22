import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import './App.css';
import Home from './screens/Home';

import MoodModal from './components/MoodModal';
import Splash from './components/Splash';
import { supabase } from './supabase';
import { identifyUser, resetUser, trackPageview, trackEvent } from './analytics';
import { pathDe, pantallaDe } from './routes';

// Las pantallas que no son el Inicio se cargan aparte, para que la app abra más rápido.
const Meditaciones = lazy(() => import('./screens/Meditaciones'));
const Sesion = lazy(() => import('./screens/Sesion'));
const Afirmaciones = lazy(() => import('./screens/Afirmaciones'));
const AfirmacionDetalle = lazy(() => import('./screens/AfirmacionDetalle'));
const Yoga = lazy(() => import('./screens/Yoga'));
const YogaDetalle = lazy(() => import('./screens/YogaDetalle'));
const Perfil = lazy(() => import('./screens/Perfil'));
const EditarPerfil = lazy(() => import('./screens/EditarPerfil'));
const Privacy = lazy(() => import('./screens/Privacy'));
const Login = lazy(() => import('./screens/Login'));
const CompletarPerfil = lazy(() => import('./screens/CompletarPerfil'));
const Respirar = lazy(() => import('./screens/Respirar'));

// Pantalla inicial según la URL con que se abre la app (ej. un enlace compartido).
// Una URL desconocida lleva al inicio.
const inicial = pantallaDe(window.location.pathname) || { screen: 'home', param: null };
if (!pantallaDe(window.location.pathname)) {
  window.history.replaceState(null, '', '/' + window.location.search + window.location.hash);
}

function App() {
  const [screen, setScreen] = useState(inicial.screen);
  const [screenParam, setScreenParam] = useState(inicial.param);
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
    setScreen(dest);
    setScreenParam(param);
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
      () => import('./screens/Meditaciones'), () => import('./screens/Sesion'),
      () => import('./screens/Afirmaciones'), () => import('./screens/AfirmacionDetalle'),
      () => import('./screens/Yoga'), () => import('./screens/YogaDetalle'),
      () => import('./screens/Perfil'), () => import('./screens/Respirar'),
    ].forEach((cargar) => cargar().catch(() => {}));
    const t = setTimeout(precargar, 2500);
    return () => clearTimeout(t);
  }, []);

  // Botón "atrás" / "adelante" del navegador.
  useEffect(() => {
    const onPopState = () => {
      const destino = pantallaDe(window.location.pathname) || { screen: 'home', param: null };
      setScreen(destino.screen);
      setScreenParam(destino.param);
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