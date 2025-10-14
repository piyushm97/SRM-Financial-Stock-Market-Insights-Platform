const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  
  // Prediction details
  predictionType: {
    type: String,
    enum: ['price', 'trend', 'volatility', 'support_resistance'],
    required: true
  },
  
  timeframe: {
    type: String,
    enum: ['1d', '3d', '1w', '2w', '1m', '3m'],
    required: true
  },
  
  // Predicted values
  predictedPrice: Number,
  predictedHigh: Number,
  predictedLow: Number,
  predictedTrend: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral']
  },
  
  // Confidence and accuracy
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  
  accuracy: {
    type: Number,
    min: 0,
    max: 1
  },
  
  // Model information
  model: {
    name: {
      type: String,
      required: true
    },
    version: String,
    parameters: mongoose.Schema.Types.Mixed
  },
  
  // Input data used
  inputData: {
    startDate: Date,
    endDate: Date,
    dataPoints: Number,
    features: [String]
  },
  
  // Prediction date and target date
  predictionDate: {
    type: Date,
    default: Date.now
  },
  
  targetDate: {
    type: Date,
    required: true
  },
  
  // Actual outcome (filled when target date is reached)
  actualOutcome: {
    actualPrice: Number,
    actualHigh: Number,
    actualLow: Number,
    actualTrend: String,
    evaluatedAt: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'expired'],
    default: 'active'
  },
  
  // Metadata
  isPublic: {
    type: Boolean,
    default: true
  },
  
  tags: [String],
  
  notes: String
}, {
  timestamps: true
});

// Indexes
PredictionSchema.index({ symbol: 1, predictionDate: -1 });
PredictionSchema.index({ targetDate: 1, status: 1 });
PredictionSchema.index({ model: 1 });
PredictionSchema.index({ confidence: -1 });

// Virtual for days until target
PredictionSchema.virtual('daysUntilTarget').get(function() {
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to evaluate prediction accuracy
PredictionSchema.methods.evaluateAccuracy = function() {
  if (!this.actualOutcome.actualPrice || !this.predictedPrice) {
    return null;
  }
  
  const error = Math.abs(this.actualOutcome.actualPrice - this.predictedPrice);
  const percentError = (error / this.actualOutcome.actualPrice) * 100;
  
  // Accuracy is inverse of percent error, capped at 100%
  this.accuracy = Math.max(0, (100 - percentError) / 100);
  
  return this.accuracy;
};

module.exports = mongoose.model('Prediction', PredictionSchema);