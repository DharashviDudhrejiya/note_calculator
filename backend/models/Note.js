// const mongoose = require('mongoose');

// const noteSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   content: {
//     type: String,
//     required: true,
//     maxlength: 50000
//   },
//   tags: [{
//     type: String,
//     trim: true,
//     maxlength: 50
//   }],
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: false // Optional for now, can be made required when auth is implemented
//   },
//   calculations: [{
//     lineNumber: Number,
//     expression: String,
//     result: mongoose.Schema.Types.Mixed,
//     error: String,
//     dependencies: [Number]
//   }],
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
//   shareToken: {
//     type: String,
//     unique: true,
//     sparse: true
//   }
// }, {
//   timestamps: true
// });

// // Indexes for better performance
// noteSchema.index({ userId: 1, createdAt: -1 });
// noteSchema.index({ title: 'text', content: 'text' });
// noteSchema.index({ shareToken: 1 });

// // Virtual for formatted creation date
// noteSchema.virtual('formattedCreatedAt').get(function() {
//   return this.createdAt.toLocaleDateString();
// });

// // Method to generate share token
// noteSchema.methods.generateShareToken = function() {
//   const crypto = require('crypto');
//   this.shareToken = crypto.randomBytes(16).toString('hex');
//   return this.shareToken;
// };

// // Static method to find public notes
// noteSchema.statics.findPublicNotes = function() {
//   return this.find({ isPublic: true }).sort({ createdAt: -1 });
// };

// module.exports = mongoose.model('Note', noteSchema);

// const express = require('express');
// const router = express.Router();
// const Note = require('../models/Note');

// // Create a new note
// router.post('/', async (req, res) => {
//   try {
//     const note = new Note(req.body);

//     // Optional: generate share token if requested
//     if (req.body.generateToken) {
//       note.generateShareToken();
//     }

//     await note.save();
//     res.status(201).json(note);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get all notes
// router.get('/', async (req, res) => {
//   try {
//     const notes = await Note.find();
//     res.json(notes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get public notes
// router.get('/public', async (req, res) => {
//   try {
//     const publicNotes = await Note.findPublicNotes();
//     res.json(publicNotes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get a note by share token
// router.get('/share/:token', async (req, res) => {
//   try {
//     const note = await Note.findOne({ shareToken: req.params.token });
//     if (!note) {
//       return res.status(404).json({ error: 'Note not found' });
//     }
//     res.json(note);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const mongoose = require('mongoose');
const crypto = require('crypto');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  tags: {
    type: [String],
    default: []
  },
  calculations: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true // Allows multiple notes without shareToken
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ✅ Instance method to generate a share token
noteSchema.methods.generateShareToken = function () {
  const token = crypto.randomBytes(16).toString('hex');
  this.shareToken = token;
  this.isPublic = true; // Mark it as public when sharing
  return token;
};

// ✅ Static method to find public notes
noteSchema.statics.findPublicNotes = function () {
  return this.find({ isPublic: true });
};

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
