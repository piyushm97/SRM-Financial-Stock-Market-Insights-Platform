const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  exchange: {
    type: String,
    required: true,
    trim: true
  },
  sector: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  marketCap: {
    type: Number
  },
  currentPrice: {
    type: Number,
    required: true
  },
  previousClose: {
    type: Number
  },
  open: {
    type: Number
  },
  high: {
    type: Number
  },
  low: {
    type: Number
  },
  volume: {
    type: Number
  },
  change: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  priceHistory: [{
    date: { type: Date, required: true },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  }],
  technicalIndicators: {
    sma20: Number,
    sma50: Number,
    sma200: Number,
    rsi: Number,
    macd: {
      macd: Number,
      signal: Number,
      histogram: Number
    },
    bollingerBands: {
      upper: Number,
      middle: Number,
      lower: Number
    }
  },
  sentiment: {
    score: { type: Number, min: -1, max: 1 },
    newsCount: { type: Number, default: 0 },
    socialMentions: { type: Number, default: 0 },
    analystRating: {
      buy: { type: Number, default: 0 },
      hold: { type: Number, default: 0 },
      sell: { type: Number, default: 0 }
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });
stockSchema.index({ lastUpdated: -1 });
stockSchema.index({ 'priceHistory.date': -1 });

module.exports = mongoose.model('Stock', stockSchema);