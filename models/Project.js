const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    required: true
  }],
  githubUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['cybersecurity', 'ai', 'web', 'mobile', 'desktop', 'research', 'tool']
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'in-progress', 'planned', 'archived'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
