import React, { useState } from 'react';
import './App.css';
import Home from './screens/Home';
import Meditaciones from './screens/Meditaciones';
import Sesion from './screens/Sesion';
import Perfil from './screens/Perfil';
import MoodModal from './components/MoodModal';
import Splash from './components/Splash';

function App() {
  const [screen, setScreen] = useState('home');
  const [modalMood, setModalMood] = useState(null);
  const [showSplash, setShowSplash] = useState(false);

  const navigate = (dest) => {
    setShowSplash(true);
    setTimeout(() => {
      setScreen(dest);
      setTimeout(() => setShowSplash(false), 300);
    }, 400);
  };

  return (
    <div className="app">
      {screen === 'home' && <Home onNavigate={navigate} onMood={setModalMood} />}
      {screen === 'meditaciones' && <Meditaciones onNavigate={navigate} />}
      {screen === 'sesion' && <Sesion onNavigate={navigate} />}
      {screen === 'perfil' && <Perfil onNavigate={navigate} />}
      <MoodModal mood={modalMood} onClose={() => setModalMood(null)} />
      <Splash visible={showSplash} />
    </div>
  );
}

export default App;