const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['survey', 'rating', 'suggestion', 'bug_report', 'feature_request']
  },
  category: {
    type: String,
    required: true,
    enum: ['dashboard', 'predictions', 'analytics', 'ui_ux', 'performance', 'data_accuracy']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in_review', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  tags: [String],
  metadata: {
    userAgent: String,
    screenResolution: String,
    browser: String,
    os: String,
    pageUrl: String,
    timestamp: { type: Date, default: Date.now }
  },
  responses: [{
    responderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: String,
    respondedAt: { type: Date, default: Date.now }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ priority: 1, status: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);