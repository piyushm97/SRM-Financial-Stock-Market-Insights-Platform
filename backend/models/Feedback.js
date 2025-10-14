const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Feedback type
  type: {
    type: String,
    enum: ['survey', 'bug_report', 'feature_request', 'general', 'rating', 'ab_test'],
    required: true
  },
  
  // Survey-specific fields
  surveyId: String,
  surveyVersion: String,
  
  // A/B Test specific fields
  testId: String,
  variant: String,
  
  // Content
  title: String,
  content: {
    type: String,
    required: true
  },
  
  // Rating (1-5 scale)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Structured data for surveys
  responses: [{
    questionId: String,
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    answerType: {
      type: String,
      enum: ['text', 'number', 'boolean', 'multiple_choice', 'scale']
    }
  }],
  
  // Feature/page context
  context: {
    page: String,
    feature: String,
    userAgent: String,
    sessionId: String,
    timestamp: { type: Date, default: Date.now }
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['ui_ux', 'performance', 'data_accuracy', 'features', 'mobile', 'other']
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'in_review', 'acknowledged', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  
  // Admin response
  adminResponse: {
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: String,
    respondedAt: Date
  },
  
  // Metadata
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  tags: [String],
  
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Analytics
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ type: 1, status: 1 });
FeedbackSchema.index({ surveyId: 1 });
FeedbackSchema.index({ testId: 1, variant: 1 });
FeedbackSchema.index({ priority: 1, status: 1 });
FeedbackSchema.index({ createdAt: -1 });

// Virtual for response time (if admin has responded)
FeedbackSchema.virtual('responseTime').get(function() {
  if (!this.adminResponse.respondedAt) return null;
  
  const responseTime = this.adminResponse.respondedAt - this.createdAt;
  return Math.round(responseTime / (1000 * 60 * 60)); // hours
});

module.exports = mongoose.model('Feedback', FeedbackSchema);