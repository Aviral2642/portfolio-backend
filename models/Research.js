const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    type: String,
    required: true,
    trim: true
  }],
  venue: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear() + 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['published', 'accepted', 'under-review', 'submitted', 'draft'],
    default: 'published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Research', researchSchema);
