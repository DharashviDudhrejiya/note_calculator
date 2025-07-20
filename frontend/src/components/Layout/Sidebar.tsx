import React, { useState } from 'react';
import { Plus, FileText, Search, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Note } from '../../types/index.ts';
import { v4 as uuidv4 } from 'uuid';
import { JSX } from 'react/jsx-dev-runtime';

const Sidebar = (): JSX.Element => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const createNewNote = () => {
    const newNote: Note = {
      _id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    dispatch({ type: 'SET_CURRENT_NOTE', payload: newNote });
  };

  const selectNote = (note: Note) => {
    dispatch({ type: 'SET_CURRENT_NOTE', payload: note });
  };

  const deleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      // Delete from backend
      fetch(`http://localhost:5002/api/notes/${noteId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          // Refresh notes list
          fetch('http://localhost:5002/api/notes')
            .then(res => res.json())
            .then(data => {
              const notes = Array.isArray(data) ? data : data.notes;
              dispatch({ type: 'SET_NOTES', payload: notes });
            });
        });
    }
  };

  const startEditing = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(note._id);
    setEditTitle(note.title);
  };

  const saveTitle = (noteId: string) => {
    const note = state.notes.find(n => n._id === noteId);
    if (note) {
      const updatedNote = { ...note, title: editTitle, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
    }
    setEditingId(null);
  };

  const filteredNotes = Array.isArray(state.notes)
    ? state.notes.filter(note =>
        (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      )
    : [];

  return (
    <>
    <aside className="sidebar">
      <div className="sidebar-header">
        <button onClick={createNewNote} className="new-note-btn">
          <Plus size={20} />
          New Note
        </button>
        
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="notes-list">
        {filteredNotes.map(note => (
          <div
            key={note._id}
            onClick={() => selectNote(note)}
            className={`note-item ${state.currentNote?._id === note._id ? 'active' : ''}`}
          >
            <div className="note-item-header">
              <FileText size={16} className="note-icon" />
              {editingId === note._id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveTitle(note._id)}
                  onKeyPress={(e) => e.key === 'Enter' && saveTitle(note._id)}
                  className="note-title-edit"
                  autoFocus
                />
              ) : (
                <span className="note-title">{note.title}</span>
              )}
              
              <div className="note-actions">
                <button
                  onClick={(e) => startEditing(note, e)}
                  className="note-action-btn"
                  title="Rename"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => deleteNote(note._id, e)}
                  className="note-action-btn delete"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="note-preview">
              {note.content.split('\n')[0] || 'Empty note'}
            </div>
            
            <div className="note-date">
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {filteredNotes.length === 0 && (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <p>No notes found</p>
            <button onClick={createNewNote} className="create-first-note">
              Create your first note
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;