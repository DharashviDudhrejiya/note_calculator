const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// 🛡️ Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 🚦 Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
});
app.use(limiter);

// 📦 Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔌 MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/note-calculator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 📁 API routes
const notesRoute = require('./routes/notes');
app.use('/api/notes', notesRoute);

// 🔐 Optional routes — only include if files exist
try {
  const authRoute = require('./routes/auth');
  app.use('/api/auth', authRoute);
} catch (e) {
  console.log('ℹ️ Auth route not found, skipping.');
}

try {
  const settingsRoute = require('./routes/settings');
  app.use('/api/settings', settingsRoute);
} catch (e) {
  console.log('ℹ️ Settings route not found, skipping.');
}

// 🩺 Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ❗ Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Server error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 🚫 404 Not Found
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
});
