import React, { useState, useEffect } from 'react';
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
import Splash from './components/Splash';
import { supabase } from './supabase';

function App() {
  const [screen, setScreen] = useState('home');
  const [modalMood, setModalMood] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoadingAuth(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) {
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
      setTimeout(() => setShowSplash(false), 300);
    }, 400);
  };

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