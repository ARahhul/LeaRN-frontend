import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, Plus, FileText, Notebook, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useToast } from '../components/ToastContext';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('vtu_collab_notes') || '[]');
    setNotes(saved);
    if (saved.length > 0) {
      loadNote(saved[0].id);
    }
  }, []);

  const loadNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setActiveNoteId(id);
      setEditingTitle(note.title);
      setEditingText(note.content);
    }
  };

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Study Note',
      content: '',
      lastModified: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('vtu_collab_notes', JSON.stringify(updated));
    loadNote(newNote.id);
  };

  const saveNote = () => {
    const updated = notes.map(n =>
      n.id === activeNoteId
        ? { ...n, title: editingTitle, content: editingText, lastModified: new Date().toISOString() }
        : n
    );
    setNotes(updated);
    localStorage.setItem('vtu_collab_notes', JSON.stringify(updated));
    addToast('Note saved successfully!', 'success');
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('vtu_collab_notes', JSON.stringify(updated));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setEditingTitle('');
      setEditingText('');
    } else if (updated.length > 0) {
      loadNote(updated[0].id);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Branding
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('VTU Research Notes', 10, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Title: ${editingTitle || 'Untitled'}`, 10, 27);
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 190, 27, { align: 'right' });
    doc.line(10, 30, 200, 30);

    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(editingText, 180);
    doc.text(splitText, 10, 40);
    doc.save(`${editingTitle || 'note'}.pdf`);
    addToast('Note exported to PDF!', 'success');
  };

  return (
    <div className="notes-container fade-in">
      <div className="notes-sidebar">
        <div className="sidebar-header">
          <h2>My Notes</h2>
          <button className="btn-add-note" onClick={createNote} title="New Note">
            <Plus size={20} />
          </button>
        </div>
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-notes">
              <Notebook size={32} />
              <p>No notes yet. Start your research!</p>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note.id}
                className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
                onClick={() => loadNote(note.id)}
              >
                <div className="note-info">
                  <span className="note-title">{note.title || 'Untitled'}</span>
                  <span className="note-date">{new Date(note.lastModified).toLocaleDateString()}</span>
                </div>
                <button className="btn-delete-note" onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="notes-editor">
        {!activeNoteId ? (
          <div className="editor-empty">
            <FileText size={48} />
            <p>Select a note to start editing or create a new one.</p>
          </div>
        ) : (
          <div className="editor-content">
            <div className="editor-toolbar">
              <input
                className="editor-title"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                placeholder="Note Title..."
              />
              <div className="toolbar-actions">
                <button className="btn-toolbar" onClick={saveNote} title="Save Note">
                  <Save size={18} /> Save
                </button>
                <button className="btn-toolbar" onClick={exportToPDF} title="Export PDF">
                  <Download size={18} /> PDF
                </button>
              </div>
            </div>
            <textarea
              className="editor-textarea"
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
              placeholder="Start writing your research notes, formulas, and summaries here..."
            />
            <div className="editor-footer">
              <span className="last-saved">
                Last modified: {new Date(notes.find(n => n.id === activeNoteId)?.lastModified).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
