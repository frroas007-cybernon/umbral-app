import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './screens/Home';
import Meditaciones from './screens/Meditaciones';
import Sesion from './screens/Sesion';
import Afirmaciones from './screens/Afirmaciones';
import AfirmacionDetalle from './screens/AfirmacionDetalle';
import Yoga from './screens/Yoga';
import YogaDetalle from './screens/YogaDetalle';
import Perfil from './screens/Perfil';
import EditarPerfil from './screens/EditarPerfil';
import Privacy from './screens/Privacy';
import Login from './screens/Login';
import CompletarPerfil from './screens/CompletarPerfil';
import MoodModal from './components/MoodModal';
import Splash from './components/Splash';
import { supabase } from './supabase';
import { identifyUser, resetUser, trackPageview, trackEvent } from './analytics';
import { pathDe, pantallaDe } from './routes';

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
  const [showSplash, setShowSplash] = useState(false);
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
    setShowSplash(true);
    setTimeout(() => {
      setScreen(dest);
      setScreenParam(param);
      const nuevoPath = pathDe(dest, param);
      if (nuevoPath !== window.location.pathname) {
        window.history.pushState({ screen: dest, param }, '', nuevoPath);
      }
      window.scrollTo(0, 0);
      trackPageview(dest);
      setTimeout(() => setShowSplash(false), 300);
    }, 400);
  };

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

  if (loadingAuth || !user || (user.id !== 'guest' && needsProfile === null)) return <div className="app" />;

  if (needsProfile) return (
    <div className="app">
      <CompletarPerfil user={user} onComplete={() => setNeedsProfile(false)} />
    </div>
  );

  return (
    <div className="app">
      {screen === 'home' && <Home onNavigate={navigate} onMood={setModalMood} user={user} avatarUrl={avatarUrl} />}
      {screen === 'meditaciones' && <Meditaciones onNavigate={navigate} user={user} />}
      {screen === 'sesion' && <Sesion onNavigate={navigate} user={user} sesionId={screenParam} />}
      {screen === 'afirmaciones' && <Afirmaciones onNavigate={navigate} user={user} />}
      {screen === 'afirmacion-detalle' && <AfirmacionDetalle onNavigate={navigate} user={user} />}
      {screen === 'yoga' && <Yoga onNavigate={navigate} user={user} />}
      {screen === 'yoga-detalle' && <YogaDetalle onNavigate={navigate} user={user} />}
      {screen === 'perfil' && <Perfil onNavigate={navigate} user={user} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} onLogout={() => { trackEvent('logout'); supabase.auth.signOut(); setUser(null); }} />}
      {screen === 'editar-perfil' && <EditarPerfil onNavigate={navigate} user={user} />}
      {screen === 'privacy' && <Privacy onNavigate={navigate} />}
      {screen === 'login' && (
        <Login
          onNavigate={navigate}
          onLogin={(u) => {
            setUser(u);
            navigate('perfil');
          }}
        />
      )}
      <MoodModal mood={modalMood} onClose={() => setModalMood(null)} />
      <Splash visible={showSplash} />
    </div>
  );
}

export default App;