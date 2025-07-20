import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Save, Undo, Redo, Download, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalculationEngine } from '../../utils/calculationEngine';
import { CalculationResult } from '../../types/index';
import ExportMenu from './ExportMenu';
import axios from 'axios';

const NoteEditor: React.FC = () => {
  const { state, dispatch } = useApp();
  const [content, setContent] = useState('');
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const calculationEngine = useRef(new CalculationEngine());

  // ✅ Fetch all notes on app load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/notes');
        console.log('Fetched notes response:', response.data);
        // If response.data.notes exists, use that, else use response.data
        const notes = Array.isArray(response.data) ? response.data : response.data.notes;
        dispatch({ type: 'SET_NOTES', payload: notes });
      } catch (error) {
        console.error('❌ Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, [dispatch]);

  // ✅ Load current note's content
  useEffect(() => {
    if (state.currentNote) {
      setContent(state.currentNote.content || '');
    } else {
      setContent('');
    }
  }, [state.currentNote]);

  useEffect(() => {
    if (content) {
      const newResults = calculationEngine.current.parseContent(content);
      setResults(newResults);
    } else {
      setResults([]);
    }
  }, [content]);

  useEffect(() => {
    if (
      state.settings.autoSave &&
      state.currentNote &&
      content !== state.currentNote.content
    ) {
      const timeoutId = setTimeout(() => {
        saveNote();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [content, state.settings.autoSave, state.currentNote]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (state.currentNote) {
      dispatch({ type: 'ADD_HISTORY', payload: newContent });
    }
  };

  const saveNote = async () => {
    if (!content.trim()) return;

    let noteToSave;
    if (state.currentNote) {
      noteToSave = {
        title: state.currentNote.title || 'Untitled Note',
        content,
      };
    } else {
      // Create a new note object with required fields
      noteToSave = {
        title: 'Untitled Note',
        content,
        tags: [],
      };
    }
    console.log('Saving note:', noteToSave);

    try {
      let response;
      if (state.currentNote && state.currentNote._id) {
        // ✅ Update existing note
        response = await axios.put(`http://localhost:5002/api/notes/${state.currentNote._id}`, noteToSave);
      } else {
        // ✅ Create new note
        response = await axios.post('http://localhost:5002/api/notes', noteToSave);
        console.log('POST response:', response);
        dispatch({ type: 'ADD_NOTE', payload: response.data });
        dispatch({ type: 'SET_CURRENT_NOTE', payload: response.data });
      }

      const savedNote = response.data;
      dispatch({ type: 'UPDATE_NOTE', payload: savedNote });
      // Fetch notes again so sidebar updates immediately
      const notesResponse = await axios.get('http://localhost:5002/api/notes');
      const notes = Array.isArray(notesResponse.data) ? notesResponse.data : notesResponse.data.notes;
      dispatch({ type: 'SET_NOTES', payload: notes });
      console.log('✅ Note saved:', savedNote);
    } catch (error) {
      console.error('❌ Error saving note:', error);
    }
  };

  // ✅ Delete current note
  const deleteNote = async () => {
    if (!state.currentNote?._id) return;
    try {
      await axios.delete(`http://localhost:5002/api/notes/${state.currentNote._id}`);
      dispatch({ type: 'DELETE_NOTE', payload: state.currentNote._id });
      setContent('');
      // Fetch notes again so sidebar updates immediately
      const response = await axios.get('http://localhost:5002/api/notes');
      const notes = Array.isArray(response.data) ? response.data : response.data.notes;
      dispatch({ type: 'SET_NOTES', payload: notes });
      console.log('🗑️ Note deleted');
    } catch (error) {
      console.error('❌ Error deleting note:', error);
    }
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
    const historyState = state.history[state.historyIndex - 1];
    if (historyState) setContent(historyState.content);
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
    const historyState = state.history[state.historyIndex + 1];
    if (historyState) setContent(historyState.content);
  };

  const insertCalculation = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '=' + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, start + 1);
      }, 0);
    }
  };

  const renderLineWithResults = (line: string, lineNumber: number) => {
    const result = results.find((r) => r.lineNumber === lineNumber);
    const hasError = result?.error;
    const hasResult = result && typeof result.result === 'number';

    return (
      <div
        key={lineNumber}
        className={`editor-line ${hasError ? 'error' : ''} ${hasResult ? 'calculated' : ''}`}
      >
        {state.settings.showLineNumbers && <span className="line-number">{lineNumber}</span>}
        <span className="line-content">{line}</span>
        {hasResult && (
          <span className="calculation-result">
            → {typeof result.result === 'number'
              ? result.result.toFixed(state.settings.decimalPrecision)
              : result.result}
          </span>
        )}
        {hasError && (
          <span className="calculation-error" title={result.error}>
            ⚠ Error
          </span>
        )}
      </div>
    );
  };

  if (!state.currentNote) {
    return (
      <div className="editor-container">
        <div className="empty-editor">
          <Calculator size={64} className="empty-icon" />
          <h2>Select a note to start calculating</h2>
          <p>Create a new note or select an existing one from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container" id="note-editor">
      <div className="editor-header">
        <div className="editor-title">
          <h2>{state.currentNote.title}</h2>
          <span className="calculation-count">
            {results.filter((r) => typeof r.result === 'number').length} calculations
          </span>
        </div>

        <div className="editor-actions">
          <button onClick={undo} disabled={state.historyIndex <= 0} className="editor-btn" title="Undo">
            <Undo size={16} />
          </button>

          <button onClick={redo} disabled={state.historyIndex >= state.history.length - 1} className="editor-btn" title="Redo">
            <Redo size={16} />
          </button>

          <button onClick={insertCalculation} className="editor-btn accent" title="Insert Calculation">
            <Calculator size={16} />
          </button>

          <button onClick={saveNote} className="editor-btn" title="Save">
            <Save size={16} />
          </button>

          <div className="export-menu-container">
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="editor-btn" title="Export">
              <Download size={16} />
            </button>
            {showExportMenu && (
              <ExportMenu
                note={state.currentNote}
                results={results}
                onClose={() => setShowExportMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-input">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder={`Start typing your notes with calculations...

Examples:
Coffee: 3.50
Lunch: 8.20
Total: =3.50 + 8.20

Or use variables:
rate = 45
hours = 36
Total: =rate * hours`}
            className="note-textarea"
            style={{ fontSize: `${state.settings.fontSize}px` }}
          />
        </div>

        <div className="editor-preview">
          <h3>Live Preview</h3>
          <div className="preview-content">
            {content.split('\n').map((line, index) => renderLineWithResults(line, index + 1))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
