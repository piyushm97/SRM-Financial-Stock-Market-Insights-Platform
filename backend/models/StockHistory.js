const mongoose = require('mongoose');

const StockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  adjustedClose: Number,
  volume: {
    type: Number,
    required: true
  },
  
  // Technical indicators
  sma20: Number, // 20-day Simple Moving Average
  sma50: Number, // 50-day Simple Moving Average
  sma200: Number, // 200-day Simple Moving Average
  ema12: Number, // 12-day Exponential Moving Average
  ema26: Number, // 26-day Exponential Moving Average
  rsi: Number, // Relative Strength Index
  macd: Number, // MACD
  macdSignal: Number,
  macdHistogram: Number,
  
  // Volatility measures
  volatility: Number,
  
  // Market data quality
  dataSource: {
    type: String,
    enum: ['alpha_vantage', 'yahoo_finance', 'manual'],
    default: 'alpha_vantage'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're using createdAt manually
});

// Compound index for efficient queries
StockHistorySchema.index({ symbol: 1, date: -1 });
StockHistorySchema.index({ symbol: 1, date: 1 });
StockHistorySchema.index({ date: -1 });

// Virtual for daily change
StockHistorySchema.virtual('dailyChange').get(function() {
  return this.close - this.open;
});

// Virtual for daily change percentage
StockHistorySchema.virtual('dailyChangePercent').get(function() {
  return ((this.close - this.open) / this.open) * 100;
});

module.exports = mongoose.model('StockHistory', StockHistorySchema);