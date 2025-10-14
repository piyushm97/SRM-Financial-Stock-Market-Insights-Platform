const express = require('express');
const Stock = require('../models/Stock');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get technical analysis for a stock
router.get('/technical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = 50 } = req.query;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Calculate technical indicators
    const technicalAnalysis = calculateTechnicalIndicators(stock.priceHistory, parseInt(period));

    // Update stock with calculated indicators
    stock.technicalIndicators = technicalAnalysis;
    await stock.save();

    res.json({
      symbol: stock.symbol,
      technicalIndicators: technicalAnalysis,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Technical analysis error:', error);
    res.status(500).json({ message: 'Error calculating technical analysis' });
  }
});

// Get sentiment analysis
router.get('/sentiment/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Simulate sentiment analysis (in real app, this would use NLP APIs)
    const sentimentScore = calculateSentimentScore(stock);
    
    // Update stock sentiment
    stock.sentiment = {
      ...stock.sentiment,
      score: sentimentScore,
      lastUpdated: new Date()
    };
    await stock.save();

    res.json({
      symbol: stock.symbol,
      sentiment: stock.sentiment,
      analysis: getSentimentAnalysis(sentimentScore)
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ message: 'Error calculating sentiment analysis' });
  }
});

// Get market trends
router.get('/trends', async (req, res) => {
  try {
    const { sector, period = 30 } = req.query;

    let matchQuery = { isActive: true };
    if (sector) {
      matchQuery.sector = sector;
    }

    const stocks = await Stock.find(matchQuery)
      .sort({ lastUpdated: -1 })
      .limit(100);

    const trends = analyzeMarketTrends(stocks, parseInt(period));

    res.json({
      period: `${period} days`,
      sector: sector || 'All',
      trends
    });
  } catch (error) {
    console.error('Market trends error:', error);
    res.status(500).json({ message: 'Error analyzing market trends' });
  }
});

// Get portfolio analytics (for authenticated users)
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = req.user;
    const watchlistSymbols = user.watchlist.map(item => item.symbol);

    if (watchlistSymbols.length === 0) {
      return res.json({
        message: 'No stocks in watchlist',
        analytics: null
      });
    }

    const stocks = await Stock.find({
      symbol: { $in: watchlistSymbols },
      isActive: true
    });

    const portfolioAnalytics = calculatePortfolioAnalytics(stocks);

    res.json({
      watchlistCount: watchlistSymbols.length,
      analytics: portfolioAnalytics
    });
  } catch (error) {
    console.error('Portfolio analytics error:', error);
    res.status(500).json({ message: 'Error calculating portfolio analytics' });
  }
});

// Get sector performance
router.get('/sectors', async (req, res) => {
  try {
    const sectorPerformance = await Stock.aggregate([
      { $match: { isActive: true, sector: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$sector',
          avgChange: { $avg: '$changePercent' },
          totalStocks: { $sum: 1 },
          avgVolume: { $avg: '$volume' },
          topStocks: {
            $push: {
              symbol: '$symbol',
              name: '$name',
              changePercent: '$changePercent'
            }
          }
        }
      },
      {
        $project: {
          sector: '$_id',
          avgChange: 1,
          totalStocks: 1,
          avgVolume: 1,
          topStocks: { $slice: ['$topStocks', 5] }
        }
      },
      { $sort: { avgChange: -1 } }
    ]);

    res.json({ sectorPerformance });
  } catch (error) {
    console.error('Sector performance error:', error);
    res.status(500).json({ message: 'Error calculating sector performance' });
  }
});

// Helper function to calculate technical indicators
function calculateTechnicalIndicators(priceHistory, period) {
  if (!priceHistory || priceHistory.length < period) {
    return {};
  }

  const closes = priceHistory.slice(-period).map(candle => candle.close);
  const highs = priceHistory.slice(-period).map(candle => candle.high);
  const lows = priceHistory.slice(-period).map(candle => candle.low);

  return {
    sma20: calculateSMA(closes, 20),
    sma50: calculateSMA(closes, 50),
    sma200: calculateSMA(closes, 200),
    rsi: calculateRSI(closes, 14),
    macd: calculateMACD(closes),
    bollingerBands: calculateBollingerBands(closes, 20, 2)
  };
}

// Helper function to calculate Simple Moving Average
function calculateSMA(prices, period) {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

// Helper function to calculate RSI
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Helper function to calculate MACD
function calculateMACD(prices) {
  if (prices.length < 26) return { macd: null, signal: null, histogram: null };

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;

  // For signal line, we'd need more data points
  return { macd, signal: null, histogram: null };
}

// Helper function to calculate EMA
function calculateEMA(prices, period) {
  if (prices.length < period) return null;

  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }

  return ema;
}

// Helper function to calculate Bollinger Bands
function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  if (prices.length < period) return { upper: null, middle: null, lower: null };

  const sma = calculateSMA(prices, period);
  const recentPrices = prices.slice(-period);
  
  const variance = recentPrices.reduce((acc, price) => {
    return acc + Math.pow(price - sma, 2);
  }, 0) / period;

  const standardDeviation = Math.sqrt(variance);

  return {
    upper: sma + (standardDeviation * stdDev),
    middle: sma,
    lower: sma - (standardDeviation * stdDev)
  };
}

// Helper function to calculate sentiment score
function calculateSentimentScore(stock) {
  // Simulate sentiment calculation based on price movement and volume
  let score = 0;

  if (stock.changePercent > 0) score += 0.3;
  else if (stock.changePercent < 0) score -= 0.3;

  if (stock.volume > stock.technicalIndicators?.sma20 * 1.5) score += 0.2;
  else if (stock.volume < stock.technicalIndicators?.sma20 * 0.5) score -= 0.2;

  if (stock.currentPrice > stock.technicalIndicators?.sma50) score += 0.2;
  else if (stock.currentPrice < stock.technicalIndicators?.sma50) score -= 0.2;

  return Math.max(-1, Math.min(1, score));
}

// Helper function to get sentiment analysis text
function getSentimentAnalysis(score) {
  if (score > 0.5) return 'Very Bullish';
  if (score > 0.2) return 'Bullish';
  if (score > -0.2) return 'Neutral';
  if (score > -0.5) return 'Bearish';
  return 'Very Bearish';
}

// Helper function to analyze market trends
function analyzeMarketTrends(stocks, period) {
  const totalStocks = stocks.length;
  const positiveStocks = stocks.filter(stock => stock.changePercent > 0).length;
  const negativeStocks = stocks.filter(stock => stock.changePercent < 0).length;
  const neutralStocks = totalStocks - positiveStocks - negativeStocks;

  const avgChange = stocks.reduce((sum, stock) => sum + (stock.changePercent || 0), 0) / totalStocks;
  const totalVolume = stocks.reduce((sum, stock) => sum + (stock.volume || 0), 0);

  return {
    marketSentiment: {
      bullish: (positiveStocks / totalStocks) * 100,
      bearish: (negativeStocks / totalStocks) * 100,
      neutral: (neutralStocks / totalStocks) * 100
    },
    averageChange: avgChange,
    totalVolume,
    topGainers: stocks
      .filter(stock => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5),
    topLosers: stocks
      .filter(stock => stock.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5)
  };
}

// Helper function to calculate portfolio analytics
function calculatePortfolioAnalytics(stocks) {
  if (stocks.length === 0) return null;

  const totalValue = stocks.reduce((sum, stock) => sum + stock.currentPrice, 0);
  const totalChange = stocks.reduce((sum, stock) => sum + (stock.change || 0), 0);
  const avgChangePercent = stocks.reduce((sum, stock) => sum + (stock.changePercent || 0), 0) / stocks.length;

  const sectorDistribution = stocks.reduce((acc, stock) => {
    const sector = stock.sector || 'Unknown';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});

  return {
    totalStocks: stocks.length,
    totalValue,
    totalChange,
    averageChangePercent: avgChangePercent,
    sectorDistribution,
    riskScore: calculateRiskScore(stocks)
  };
}

// Helper function to calculate risk score
function calculateRiskScore(stocks) {
  if (stocks.length === 0) return 0;

  const changes = stocks.map(stock => stock.changePercent || 0);
  const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
  const standardDeviation = Math.sqrt(variance);

  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, standardDeviation * 10));
}

module.exports = router;