const express = require('express');
const Stock = require('../models/Stock');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get predictions for a specific stock
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { type = 'short_term', limit = 5 } = req.query;

    const predictions = await Prediction.find({
      symbol: symbol.toUpperCase(),
      predictionType: type,
      status: 'active'
    })
    .sort({ confidence: -1, predictionDate: -1 })
    .limit(parseInt(limit));

    res.json({
      symbol: symbol.toUpperCase(),
      predictionType: type,
      predictions: predictions.map(pred => ({
        id: pred._id,
        modelType: pred.modelType,
        currentPrice: pred.currentPrice,
        predictedPrice: pred.predictedPrice,
        confidence: pred.confidence,
        predictionDate: pred.predictionDate,
        targetDate: pred.targetDate,
        timeHorizon: pred.timeHorizon,
        accuracy: pred.accuracy
      }))
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ message: 'Error fetching predictions' });
  }
});

// Generate new prediction
router.post('/generate', auth, async (req, res) => {
  try {
    const { symbol, predictionType = 'short_term', modelType = 'Ensemble' } = req.body;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Generate prediction using ML models
    const prediction = await generatePrediction(stock, predictionType, modelType);

    if (!prediction) {
      return res.status(400).json({ message: 'Unable to generate prediction' });
    }

    // Save prediction to database
    const savedPrediction = await Prediction.create(prediction);

    res.status(201).json({
      message: 'Prediction generated successfully',
      prediction: {
        id: savedPrediction._id,
        symbol: savedPrediction.symbol,
        modelType: savedPrediction.modelType,
        predictionType: savedPrediction.predictionType,
        currentPrice: savedPrediction.currentPrice,
        predictedPrice: savedPrediction.predictedPrice,
        confidence: savedPrediction.confidence,
        predictionDate: savedPrediction.predictionDate,
        targetDate: savedPrediction.targetDate,
        timeHorizon: savedPrediction.timeHorizon
      }
    });
  } catch (error) {
    console.error('Generate prediction error:', error);
    res.status(500).json({ message: 'Error generating prediction' });
  }
});

// Get all predictions for user's watchlist
router.get('/watchlist/all', auth, async (req, res) => {
  try {
    const user = req.user;
    const watchlistSymbols = user.watchlist.map(item => item.symbol);

    if (watchlistSymbols.length === 0) {
      return res.json({ predictions: [] });
    }

    const predictions = await Prediction.find({
      symbol: { $in: watchlistSymbols },
      status: 'active'
    })
    .sort({ confidence: -1, predictionDate: -1 })
    .populate('symbol', 'name currentPrice');

    res.json({
      watchlistSymbols,
      predictions: predictions.map(pred => ({
        id: pred._id,
        symbol: pred.symbol,
        modelType: pred.modelType,
        predictionType: pred.predictionType,
        currentPrice: pred.currentPrice,
        predictedPrice: pred.predictedPrice,
        confidence: pred.confidence,
        predictionDate: pred.predictionDate,
        targetDate: pred.targetDate,
        timeHorizon: pred.timeHorizon,
        accuracy: pred.accuracy
      }))
    });
  } catch (error) {
    console.error('Get watchlist predictions error:', error);
    res.status(500).json({ message: 'Error fetching watchlist predictions' });
  }
});

// Get prediction accuracy statistics
router.get('/stats/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const predictions = await Prediction.find({
      symbol: symbol.toUpperCase(),
      status: { $in: ['validated', 'expired'] },
      predictionDate: { $gte: startDate }
    });

    const stats = calculatePredictionStats(predictions);

    res.json({
      symbol: symbol.toUpperCase(),
      period: `${days} days`,
      totalPredictions: predictions.length,
      stats
    });
  } catch (error) {
    console.error('Get prediction stats error:', error);
    res.status(500).json({ message: 'Error fetching prediction statistics' });
  }
});

// Validate prediction accuracy
router.post('/validate/:predictionId', auth, async (req, res) => {
  try {
    const { predictionId } = req.params;
    const { actualPrice } = req.body;

    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    // Calculate accuracy
    const accuracy = calculateAccuracy(prediction.predictedPrice, actualPrice);
    
    // Update prediction
    prediction.status = 'validated';
    prediction.validationResults = {
      actualPrice,
      accuracy,
      validatedAt: new Date()
    };
    prediction.accuracy = accuracy;

    await prediction.save();

    res.json({
      message: 'Prediction validated successfully',
      predictionId: prediction._id,
      predictedPrice: prediction.predictedPrice,
      actualPrice,
      accuracy
    });
  } catch (error) {
    console.error('Validate prediction error:', error);
    res.status(500).json({ message: 'Error validating prediction' });
  }
});

// Get model performance comparison
router.get('/models/performance', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const modelPerformance = await Prediction.aggregate([
      {
        $match: {
          status: 'validated',
          predictionDate: { $gte: startDate },
          accuracy: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$modelType',
          avgAccuracy: { $avg: '$accuracy' },
          totalPredictions: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
          successfulPredictions: {
            $sum: {
              $cond: [{ $gte: ['$accuracy', 0.7] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          modelType: '$_id',
          avgAccuracy: 1,
          totalPredictions: 1,
          avgConfidence: 1,
          successRate: {
            $multiply: [
              { $divide: ['$successfulPredictions', '$totalPredictions'] },
              100
            ]
          }
        }
      },
      { $sort: { avgAccuracy: -1 } }
    ]);

    res.json({
      period: `${days} days`,
      modelPerformance
    });
  } catch (error) {
    console.error('Get model performance error:', error);
    res.status(500).json({ message: 'Error fetching model performance' });
  }
});

// Helper function to generate prediction
async function generatePrediction(stock, predictionType, modelType) {
  try {
    const timeHorizons = {
      short_term: 7,
      medium_term: 30,
      long_term: 90
    };

    const timeHorizon = timeHorizons[predictionType] || 7;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + timeHorizon);

    // Simulate ML prediction (in real app, this would call ML service)
    const prediction = simulateMLPrediction(stock, timeHorizon, modelType);

    if (!prediction) return null;

    return {
      symbol: stock.symbol,
      modelType,
      predictionType,
      currentPrice: stock.currentPrice,
      predictedPrice: prediction.price,
      confidence: prediction.confidence,
      predictionDate: new Date(),
      targetDate,
      timeHorizon,
      features: {
        technicalIndicators: ['sma20', 'sma50', 'rsi', 'macd'],
        marketData: ['volume', 'price_history'],
        sentimentData: ['news_sentiment', 'social_sentiment']
      },
      metadata: {
        modelVersion: '1.0.0',
        trainingDataSize: 10000,
        featureImportance: {
          price_history: 0.4,
          volume: 0.2,
          technical_indicators: 0.3,
          sentiment: 0.1
        }
      }
    };
  } catch (error) {
    console.error('Generate prediction error:', error);
    return null;
  }
}

// Helper function to simulate ML prediction
function simulateMLPrediction(stock, timeHorizon, modelType) {
  // This is a simplified simulation - in reality, this would call a trained ML model
  const currentPrice = stock.currentPrice;
  const volatility = 0.02; // 2% daily volatility
  const trend = stock.changePercent > 0 ? 0.001 : -0.001; // Slight trend continuation
  
  // Generate random walk with trend
  let predictedPrice = currentPrice;
  for (let i = 0; i < timeHorizon; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    predictedPrice *= (1 + trend + randomChange);
  }

  // Calculate confidence based on data quality and model type
  let confidence = 0.5;
  if (stock.priceHistory && stock.priceHistory.length > 50) confidence += 0.2;
  if (stock.technicalIndicators) confidence += 0.1;
  if (modelType === 'Ensemble') confidence += 0.2;

  confidence = Math.min(0.95, Math.max(0.1, confidence));

  return {
    price: Math.round(predictedPrice * 100) / 100,
    confidence
  };
}

// Helper function to calculate prediction accuracy
function calculateAccuracy(predictedPrice, actualPrice) {
  const error = Math.abs(predictedPrice - actualPrice) / actualPrice;
  return Math.max(0, 1 - error);
}

// Helper function to calculate prediction statistics
function calculatePredictionStats(predictions) {
  if (predictions.length === 0) {
    return {
      averageAccuracy: 0,
      totalPredictions: 0,
      highAccuracyPredictions: 0,
      averageConfidence: 0
    };
  }

  const accuracies = predictions.map(p => p.accuracy || 0);
  const confidences = predictions.map(p => p.confidence || 0);

  const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
  const averageConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  const highAccuracyPredictions = accuracies.filter(acc => acc >= 0.7).length;

  return {
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
    totalPredictions: predictions.length,
    highAccuracyPredictions,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    accuracyDistribution: {
      excellent: accuracies.filter(acc => acc >= 0.9).length,
      good: accuracies.filter(acc => acc >= 0.7 && acc < 0.9).length,
      fair: accuracies.filter(acc => acc >= 0.5 && acc < 0.7).length,
      poor: accuracies.filter(acc => acc < 0.5).length
    }
  };
}

module.exports = router;