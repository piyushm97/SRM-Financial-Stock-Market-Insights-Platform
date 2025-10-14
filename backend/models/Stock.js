const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
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
    required: true
  },
  sector: String,
  industry: String,
  marketCap: Number,
  description: String,
  
  // Current market data
  currentPrice: {
    type: Number,
    required: true
  },
  previousClose: Number,
  openPrice: Number,
  dayHigh: Number,
  dayLow: Number,
  volume: Number,
  avgVolume: Number,
  
  // Price changes
  change: Number,
  changePercent: Number,
  
  // Key metrics
  pe: Number, // Price-to-Earnings ratio
  eps: Number, // Earnings per share
  dividend: Number,
  dividendYield: Number,
  beta: Number,
  
  // 52-week data
  week52High: Number,
  week52Low: Number,
  
  // Historical data reference
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Sentiment data
  sentiment: {
    score: { type: Number, min: -1, max: 1 },
    label: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'] },
    confidence: { type: Number, min: 0, max: 1 },
    lastAnalyzed: Date
  },
  
  // News and social media mentions
  mentions: {
    news: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    lastCounted: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
StockSchema.index({ symbol: 1 });
StockSchema.index({ sector: 1 });
StockSchema.index({ marketCap: -1 });
StockSchema.index({ lastUpdated: -1 });

// Virtual for market cap formatting
StockSchema.virtual('marketCapFormatted').get(function() {
  if (!this.marketCap) return 'N/A';
  
  if (this.marketCap >= 1e12) {
    return `$${(this.marketCap / 1e12).toFixed(2)}T`;
  } else if (this.marketCap >= 1e9) {
    return `$${(this.marketCap / 1e9).toFixed(2)}B`;
  } else if (this.marketCap >= 1e6) {
    return `$${(this.marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${this.marketCap.toLocaleString()}`;
  }
});

module.exports = mongoose.model('Stock', StockSchema);