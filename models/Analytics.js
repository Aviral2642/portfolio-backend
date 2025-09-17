const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  uniqueViews: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
analyticsSchema.index({ page: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
