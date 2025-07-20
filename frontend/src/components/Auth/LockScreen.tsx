import * as React from 'react';
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LockScreen = () => {
  const { dispatch } = useApp();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  // Mock passcode - in a real app, this would be stored securely
  const MOCK_PASSCODE = '1234';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcode === MOCK_PASSCODE) {
      dispatch({ type: 'SET_LOCKED', payload: false });
      setError('');
    } else {
      setError('Invalid passcode');
      setPasscode('');
    }
  };

  const handleBiometric = () => {
    // Mock biometric authentication
    if (window.confirm('Use biometric authentication? (This is a demo)')) {
      dispatch({ type: 'SET_LOCKED', payload: false });
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-container">
        <div className="lock-header">
          <Lock size={64} className="lock-icon" />
          <h1>Note Calculator</h1>
          <p>Enter your passcode to continue</p>
        </div>

        <form onSubmit={handleUnlock} className="lock-form">
          <div className="passcode-input-container">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="passcode-input"
              maxLength={10}
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="toggle-visibility"
            >
              {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="unlock-btn">
            Unlock
          </button>

          <button
            type="button"
            onClick={handleBiometric}
            className="biometric-btn"
          >
            Use Biometric Authentication
          </button>

          <div className="demo-hint">
            <small>Demo passcode: 1234</small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;