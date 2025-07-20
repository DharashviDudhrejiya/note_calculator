import React, { useState } from 'react';
import { Moon, Sun, Settings, Lock, Unlock } from 'lucide-react';
import SettingsPanel from './SettingsModal';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { theme: state.settings.theme === 'light' ? 'dark' : 'light' }
    });
  };

  const toggleLock = () => {
    dispatch({ type: 'SET_LOCKED', payload: !state.isLocked });
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Note Calculator</h1>

        <div className="header-buttons flex items-center space-x-4">
          <button onClick={toggleLock} title="Lock/Unlock">
            {state.isLocked ? <Unlock size={20} /> : <Lock size={30} />}
          </button>

          <button onClick={toggleTheme} title="Toggle Theme">
            {state.settings.theme === 'light' ? <Moon size={30} /> : <Sun size={30} />}
          </button>

          <button onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={30} />
          </button>
        </div>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </header>
  );
};

export default Header;