import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import NoteEditor from './components/Editor/NoteEditor';
import LockScreen from './components/Auth/LockScreen';
import { seedNotes } from './data/seedNotes';
import './styles/App.css';

const AppContent = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Load seed notes if no notes exist
    if (state.notes.length === 0) {
      seedNotes.forEach(note => {
        dispatch({ type: 'ADD_NOTE', payload: note });
      });
      // Set the first note as current
      dispatch({ type: 'SET_CURRENT_NOTE', payload: seedNotes[0] });
    }
  }, [state.notes.length, dispatch]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  if (state.isLocked) {
    return <LockScreen />;
  }

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <NoteEditor />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;