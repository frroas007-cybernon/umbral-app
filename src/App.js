import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './screens/Home';
import Meditaciones from './screens/Meditaciones';
import Sesion from './screens/Sesion';
import Afirmaciones from './screens/Afirmaciones';
import AfirmacionDetalle from './screens/AfirmacionDetalle';
import Perfil from './screens/Perfil';
import Login from './screens/Login';
import CompletarPerfil from './screens/CompletarPerfil';
import MoodModal from './components/MoodModal';
import ApoyoGraciasModal from './components/ApoyoGraciasModal';
import Splash from './components/Splash';
import { supabase } from './supabase';
import { identifyUser, resetUser, trackPageview, trackEvent } from './analytics';

function App() {
  const [screen, setScreen] = useState('home');
  const [modalMood, setModalMood] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(null);
  const [showGracias, setShowGracias] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('apoyo') === 'exito') {
      setShowGracias(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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

  useEffect(() => {
    if (!user || user.id === 'guest') {
      setNeedsProfile(false);
      return;
    }
    setNeedsProfile(null);
    supabase
      .from('Perfiles')
      .select('gender, date_of_birth')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const incompleto = !data || !data.gender || !data.date_of_birth;
        setNeedsProfile(incompleto);
      });
  }, [user]);

  const navigate = (dest) => {
    setShowSplash(true);
    setTimeout(() => {
      setScreen(dest);
      trackPageview(dest);
      setTimeout(() => setShowSplash(false), 300);
    }, 400);
  };

  const homeTrackeado = useRef(false);
  useEffect(() => {
    if (user && needsProfile === false && !homeTrackeado.current) {
      homeTrackeado.current = true;
      trackPageview('home');
    }
  }, [user, needsProfile]);

  if (loadingAuth || (user && needsProfile === null)) return <div className="app" />;

  if (!user) return (
    <div className="app">
      <Login onLogin={setUser} />
    </div>
  );

  if (needsProfile) return (
    <div className="app">
      <CompletarPerfil user={user} onComplete={() => setNeedsProfile(false)} />
    </div>
  );

  return (
    <div className="app">
      {screen === 'home' && <Home onNavigate={navigate} onMood={setModalMood} user={user} />}
      {screen === 'meditaciones' && <Meditaciones onNavigate={navigate} user={user} />}
      {screen === 'sesion' && <Sesion onNavigate={navigate} user={user} />}
      {screen === 'afirmaciones' && <Afirmaciones onNavigate={navigate} user={user} />}
      {screen === 'afirmacion-detalle' && <AfirmacionDetalle onNavigate={navigate} user={user} />}
      {screen === 'perfil' && <Perfil onNavigate={navigate} user={user} onLogout={() => { trackEvent('logout'); supabase.auth.signOut(); setUser(null); }} />}
      <MoodModal mood={modalMood} onClose={() => setModalMood(null)} />
      <ApoyoGraciasModal visible={showGracias} onClose={() => setShowGracias(false)} />
      <Splash visible={showSplash} />
    </div>
  );
}

export default App;