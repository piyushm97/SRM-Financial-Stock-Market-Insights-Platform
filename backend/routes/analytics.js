const express = require('express');
const Prediction = require('../models/Prediction');
const StockHistory = require('../models/StockHistory');
const Stock = require('../models/Stock');
const { authenticateToken, optionalAuth, requirePremium } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');

const router = express.Router();

// Get stock predictions
router.get('/predictions/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe, limit = 10 } = req.query;

    const query = {
      symbol: symbol.toUpperCase(),
      status: { $in: ['active', 'pending'] }
    };

    if (timeframe) {
      query.timeframe = timeframe;
    }

    const predictions = await Prediction.find(query)
      .sort({ predictionDate: -1, confidence: -1 })
      .limit(parseInt(limit));

    res.json({
      symbol: symbol.toUpperCase(),
      predictions,
      count: predictions.length
    });
  } catch (error) {
    console.error('Predictions fetch error:', error);
    res.status(500).json({ message: 'Error fetching predictions' });
  }
});

// Generate new prediction (premium feature)
router.post('/predictions/:symbol', authenticateToken, requirePremium, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1w', predictionType = 'price' } = req.body;

    // Check if stock exists
    const stock = await Stock.findOne({ 
      symbol: symbol.toUpperCase(),
      isActive: true 
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Generate prediction using analytics service
    const prediction = await analyticsService.generatePrediction(
      symbol.toUpperCase(),
      timeframe,
      predictionType
    );

    res.json({
      message: 'Prediction generated successfully',
      prediction
    });
  } catch (error) {
    console.error('Prediction generation error:', error);
    res.status(500).json({ message: 'Error generating prediction' });
  }
});

// Get technical indicators
router.get('/technical/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '30d' } = req.query;

    const indicators = await analyticsService.calculateTechnicalIndicators(
      symbol.toUpperCase(),
      period
    );

    res.json({
      symbol: symbol.toUpperCase(),
      period,
      indicators,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Technical indicators error:', error);
    res.status(500).json({ message: 'Error calculating technical indicators' });
  }
});

// Get sentiment analysis
router.get('/sentiment/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ 
      symbol: symbol.toUpperCase(),
      isActive: true 
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Get or calculate sentiment
    let sentiment = stock.sentiment;
    
    if (!sentiment || !sentiment.lastAnalyzed || 
        (new Date() - sentiment.lastAnalyzed) > 3600000) { // 1 hour
      sentiment = await analyticsService.analyzeSentiment(symbol.toUpperCase());
      
      // Update stock with new sentiment
      stock.sentiment = sentiment;
      await stock.save();
    }

    res.json({
      symbol: symbol.toUpperCase(),
      sentiment,
      lastAnalyzed: sentiment.lastAnalyzed
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ message: 'Error analyzing sentiment' });
  }
});

// Get correlation analysis (premium feature)
router.get('/correlation/:symbol', authenticateToken, requirePremium, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { compareWith, period = '90d' } = req.query;

    if (!compareWith) {
      return res.status(400).json({ message: 'compareWith parameter required' });
    }

    const compareSymbols = compareWith.split(',').map(s => s.trim().toUpperCase());
    
    const correlations = await analyticsService.calculateCorrelation(
      symbol.toUpperCase(),
      compareSymbols,
      period
    );

    res.json({
      symbol: symbol.toUpperCase(),
      compareWith: compareSymbols,
      period,
      correlations,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Correlation analysis error:', error);
    res.status(500).json({ message: 'Error calculating correlation' });
  }
});

// Get volatility analysis
router.get('/volatility/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '30d' } = req.query;

    const volatility = await analyticsService.calculateVolatility(
      symbol.toUpperCase(),
      period
    );

    res.json({
      symbol: symbol.toUpperCase(),
      period,
      volatility,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Volatility analysis error:', error);
    res.status(500).json({ message: 'Error calculating volatility' });
  }
});

// Get support and resistance levels
router.get('/levels/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '90d' } = req.query;

    const levels = await analyticsService.calculateSupportResistance(
      symbol.toUpperCase(),
      period
    );

    res.json({
      symbol: symbol.toUpperCase(),
      period,
      levels,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Support/resistance levels error:', error);
    res.status(500).json({ message: 'Error calculating support/resistance levels' });
  }
});

// Get market analysis summary
router.get('/summary/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;

    // Get comprehensive analysis
    const [
      stock,
      predictions,
      technicalIndicators,
      volatility,
      levels
    ] = await Promise.all([
      Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true }),
      Prediction.find({ 
        symbol: symbol.toUpperCase(), 
        status: 'active' 
      }).sort({ confidence: -1 }).limit(3),
      analyticsService.calculateTechnicalIndicators(symbol.toUpperCase(), '30d'),
      analyticsService.calculateVolatility(symbol.toUpperCase(), '30d'),
      analyticsService.calculateSupportResistance(symbol.toUpperCase(), '90d')
    ]);

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const summary = {
      stock: {
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap
      },
      sentiment: stock.sentiment,
      predictions: predictions.map(p => ({
        type: p.predictionType,
        timeframe: p.timeframe,
        predictedPrice: p.predictedPrice,
        confidence: p.confidence,
        targetDate: p.targetDate
      })),
      technical: {
        trend: technicalIndicators.trend,
        rsi: technicalIndicators.rsi,
        macd: technicalIndicators.macd,
        movingAverages: technicalIndicators.movingAverages
      },
      volatility,
      levels,
      lastUpdated: new Date().toISOString()
    };

    res.json(summary);
  } catch (error) {
    console.error('Analysis summary error:', error);
    res.status(500).json({ message: 'Error generating analysis summary' });
  }
});

// Get prediction accuracy metrics
router.get('/accuracy', optionalAuth, async (req, res) => {
  try {
    const { model, timeframe, limit = 100 } = req.query;

    const query = { status: 'completed' };
    if (model) query['model.name'] = model;
    if (timeframe) query.timeframe = timeframe;

    const completedPredictions = await Prediction.find(query)
      .sort({ predictionDate: -1 })
      .limit(parseInt(limit));

    // Calculate accuracy metrics
    const accuracyMetrics = analyticsService.calculateAccuracyMetrics(completedPredictions);

    res.json({
      totalPredictions: completedPredictions.length,
      metrics: accuracyMetrics,
      filters: { model, timeframe },
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Accuracy metrics error:', error);
    res.status(500).json({ message: 'Error calculating accuracy metrics' });
  }
});

module.exports = router;