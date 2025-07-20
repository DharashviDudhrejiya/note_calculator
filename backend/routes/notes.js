const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


// GET /api/notes - Get all notes (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { search, tags, limit = 50, page = 1 } = req.query;
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // For now, get all notes (no user filtering until auth is implemented)
    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-calculations'); // Exclude calculations for list view
    
    const total = await Note.countDocuments(query);
    
    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// GET /api/notes/:id - Get a specific note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const note = new Note({
      title: title.trim(),
      content,
      tags: tags || []
    });
    
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, calculations } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (calculations !== undefined) updateData.calculations = calculations;
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

// POST /api/notes/:id/share - Generate share token for a note
router.post('/:id/share', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.isPublic = true;
    const shareToken = note.generateShareToken();
    await note.save();
    
    res.json({ 
      shareToken,
      shareUrl: `${req.protocol}://${req.get('host')}/api/notes/shared/${shareToken}`
    });
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ message: 'Error sharing note', error: error.message });
  }
});

// GET /api/notes/shared/:token - Get a shared note
router.get('/shared/:token', async (req, res) => {
  try {
    const note = await Note.findOne({ 
      shareToken: req.params.token,
      isPublic: true 
    }).select('-userId');
    
    if (!note) {
      return res.status(404).json({ message: 'Shared note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching shared note:', error);
    res.status(500).json({ message: 'Error fetching shared note', error: error.message });
  }
});

// POST /api/notes/:id/calculations - Update calculations for a note
router.post('/:id/calculations', async (req, res) => {
  try {
    const { calculations } = req.body;
    
    if (!Array.isArray(calculations)) {
      return res.status(400).json({ message: 'Calculations must be an array' });
    }
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { calculations },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Calculations updated successfully', calculations: note.calculations });
  } catch (error) {
    console.error('Error updating calculations:', error);
    res.status(500).json({ message: 'Error updating calculations', error: error.message });
  }
});

module.exports = router;