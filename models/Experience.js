const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  current: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
