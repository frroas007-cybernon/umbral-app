import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './screens/Home';
import Meditaciones from './screens/Meditaciones';
import Sesion from './screens/Sesion';
import Afirmaciones from './screens/Afirmaciones';
import AfirmacionDetalle from './screens/AfirmacionDetalle';
import Perfil from './screens/Perfil';
import Login from './screens/Login';
import MoodModal from './components/MoodModal';
import Splash from './components/Splash';
import { supabase } from './supabase';

function App() {
  const [screen, setScreen] = useState('home');
  const [modalMood, setModalMood] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoadingAuth(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const navigate = (dest) => {
    setShowSplash(true);
    setTimeout(() => {
      setScreen(dest);
      setTimeout(() => setShowSplash(false), 300);
    }, 400);
  };

  if (loadingAuth) return <div className="app" />;

  if (!user) return (
    <div className="app">
      <Login onLogin={setUser} />
    </div>
  );

  return (
    <div className="app">
      {screen === 'home' && <Home onNavigate={navigate} onMood={setModalMood} user={user} />}
      {screen === 'meditaciones' && <Meditaciones onNavigate={navigate} />}
      {screen === 'sesion' && <Sesion onNavigate={navigate} />}
      {screen === 'afirmaciones' && <Afirmaciones onNavigate={navigate} />}
      {screen === 'afirmacion-detalle' && <AfirmacionDetalle onNavigate={navigate} />}
      {screen === 'perfil' && <Perfil onNavigate={navigate} user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); }} />}
      <MoodModal mood={modalMood} onClose={() => setModalMood(null)} />
      <Splash visible={showSplash} />
    </div>
  );
}

export default App;