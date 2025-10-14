const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  modelType: {
    type: String,
    required: true,
    enum: ['LSTM', 'ARIMA', 'LinearRegression', 'RandomForest', 'Ensemble']
  },
  predictionType: {
    type: String,
    required: true,
    enum: ['short_term', 'medium_term', 'long_term']
  },
  currentPrice: {
    type: Number,
    required: true
  },
  predictedPrice: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  predictionDate: {
    type: Date,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  timeHorizon: {
    type: Number,
    required: true // in days
  },
  features: {
    technicalIndicators: [String],
    marketData: [String],
    sentimentData: [String]
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 1
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'validated', 'invalidated'],
    default: 'active'
  },
  validationResults: {
    actualPrice: Number,
    accuracy: Number,
    validatedAt: Date
  },
  metadata: {
    modelVersion: String,
    trainingDataSize: Number,
    featureImportance: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
predictionSchema.index({ symbol: 1, predictionDate: -1 });
predictionSchema.index({ targetDate: 1 });
predictionSchema.index({ status: 1 });
predictionSchema.index({ confidence: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);