const express = require('express');
const router = express.Router();

// Mock settings for now (will be integrated with User model when auth is implemented)
let globalSettings = {
  decimalPrecision: 2,
  currencySymbol: '$',
  fontSize: 16,
  autoSave: true,
  showLineNumbers: true,
  // syntaxHighlighting: true
};

// GET /api/settings - Get current settings
router.get('/', (req, res) => {
  res.json(globalSettings);
});

// PUT /api/settings - Update settings
router.put('/', (req, res) => {
  try {
    const allowedSettings = [
      'decimalPrecision', 
      'currencySymbol', 'autoSave', 'showLineNumbers', 'syntaxHighlighting'
    ];
    
    const updates = {};
    
    // Validate and filter settings
    Object.keys(req.body).forEach(key => {
      if (allowedSettings.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    // Validate specific settings
    if (updates.fontSize && (updates.fontSize < 12 || updates.fontSize > 24)) {
      return res.status(400).json({ message: 'Font size must be between 12 and 24' });
    }
    
    if (updates.decimalPrecision && (updates.decimalPrecision < 0 || updates.decimalPrecision > 10)) {
      return res.status(400).json({ message: 'Decimal precision must be between 0 and 10' });
    }
    
    if (updates.currencySymbol && updates.currencySymbol.length > 5) {
      return res.status(400).json({ message: 'Currency symbol must be 5 characters or less' });
    }
    
    // Update settings
    globalSettings = { ...globalSettings, ...updates };
    
    res.json({
      message: 'Settings updated successfully',
      settings: globalSettings
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// POST /api/settings/reset - Reset settings to defaults
router.post('/reset', (req, res) => {
  globalSettings = {
    decimalPrecision: 2,
    currencySymbol: '$',
    fontSize: 16,
    autoSave: true,
    showLineNumbers: true,
    syntaxHighlighting: true
  };
  
  res.json({
    message: 'Settings reset to defaults',
    settings: globalSettings
  });
});

module.exports = router;