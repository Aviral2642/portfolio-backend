const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'cybersecurity', 'ai', 'cloud', 'tools', 'soft-skills']
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
