const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'SUPPORT'
});

module.exports = mongoose.model('Support', supportSchema); 