const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: String,
  
  // Survey configuration
  version: {
    type: String,
    default: '1.0'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Targeting
  targetAudience: {
    userTypes: [{
      type: String,
      enum: ['all', 'new', 'returning', 'premium', 'free']
    }],
    minSessionCount: Number,
    maxSessionCount: Number,
    features: [String] // Features user must have used
  },
  
  // Display settings
  displaySettings: {
    trigger: {
      type: String,
      enum: ['page_load', 'time_based', 'action_based', 'exit_intent'],
      default: 'page_load'
    },
    pages: [String], // Which pages to show on
    delay: { type: Number, default: 0 }, // Delay in seconds
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'always'],
      default: 'once'
    }
  },
  
  // Questions
  questions: [{
    id: String,
    type: {
      type: String,
      enum: ['text', 'textarea', 'radio', 'checkbox', 'scale', 'rating'],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String], // For radio/checkbox questions
    scaleMin: Number, // For scale questions
    scaleMax: Number,
    scaleLabels: [String],
    placeholder: String,
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String
    }
  }],
  
  // A/B Testing
  abTest: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    variants: [{
      name: String,
      weight: { type: Number, default: 50 }, // Percentage
      modifications: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Analytics
  analytics: {
    totalShows: { type: Number, default: 0 },
    totalResponses: { type: Number, default: 0 },
    averageRating: Number,
    responseRate: Number,
    lastCalculated: Date
  },
  
  // Schedule
  schedule: {
    startDate: Date,
    endDate: Date,
    maxResponses: Number
  },
  
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
SurveySchema.index({ isActive: 1, 'schedule.startDate': 1, 'schedule.endDate': 1 });
SurveySchema.index({ createdBy: 1 });
SurveySchema.index({ 'targetAudience.userTypes': 1 });

// Method to calculate response rate
SurveySchema.methods.calculateResponseRate = function() {
  if (this.analytics.totalShows === 0) {
    this.analytics.responseRate = 0;
  } else {
    this.analytics.responseRate = (this.analytics.totalResponses / this.analytics.totalShows) * 100;
  }
  this.analytics.lastCalculated = new Date();
  return this.analytics.responseRate;
};

// Method to check if survey should be shown to user
SurveySchema.methods.shouldShowToUser = function(user, userContext) {
  // Check if survey is active
  if (!this.isActive) return false;
  
  // Check schedule
  const now = new Date();
  if (this.schedule.startDate && now < this.schedule.startDate) return false;
  if (this.schedule.endDate && now > this.schedule.endDate) return false;
  
  // Check max responses
  if (this.schedule.maxResponses && this.analytics.totalResponses >= this.schedule.maxResponses) {
    return false;
  }
  
  // Check target audience
  if (this.targetAudience.userTypes.length > 0) {
    const userType = user.subscription.plan === 'free' ? 'free' : 'premium';
    if (!this.targetAudience.userTypes.includes('all') && 
        !this.targetAudience.userTypes.includes(userType)) {
      return false;
    }
  }
  
  return true;
};

module.exports = mongoose.model('Survey', SurveySchema);