import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Note, AppSettings, HistoryState } from '../types/index.ts';


interface AppState {
  notes: Note[];
  currentNote: Note | null;
  settings: AppSettings;
  history: HistoryState[];
  historyIndex: number;
  isLocked: boolean;
}

type AppAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_CURRENT_NOTE'; payload: Note | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_HISTORY'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOCKED'; payload: boolean };

const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 16,
  decimalPrecision: 2,
  currencySymbol: '$',
  autoSave: true,
  showLineNumbers: true,
  currency: 'USD',
};

const initialState: AppState = {
  notes: [],
  currentNote: null,
  settings: defaultSettings,
  history: [],
  historyIndex: -1,
  isLocked: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: state.currentNote?._id === action.payload._id ? action.payload : state.currentNote,
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload),
        currentNote: state.currentNote?._id === action.payload ? null : state.currentNote,
      };
    case 'SET_CURRENT_NOTE':
      return { ...state, currentNote: action.payload, history: [], historyIndex: -1 };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_HISTORY':
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ content: action.payload, timestamp: Date.now() });
      return {
        ...state,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      };
    case 'UNDO':
      if (state.historyIndex > 0) {
        return { ...state, historyIndex: state.historyIndex - 1 };
      }
      return state;
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return { ...state, historyIndex: state.historyIndex + 1 };
      }
      return state;
    case 'SET_LOCKED':
      return { ...state, isLocked: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage
    const savedNotes = localStorage.getItem('notes');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedNotes) {
      dispatch({ type: 'SET_NOTES', payload: JSON.parse(savedNotes) });
    }
    
    if (savedSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) });
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};