const StockHistory = require('../models/StockHistory');
const Stock = require('../models/Stock');
const Prediction = require('../models/Prediction');
const Sentiment = require('sentiment');
const ss = require('simple-statistics');

class AnalyticsService {
  constructor() {
    this.sentiment = new Sentiment();
  }

  // Calculate technical indicators
  async calculateTechnicalIndicators(symbol, period = '30d') {
    try {
      const days = this.parsePeriodToDays(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        date: { $gte: startDate }
      }).sort({ date: 1 });

      if (history.length < 14) {
        throw new Error('Insufficient historical data for technical analysis');
      }

      const closes = history.map(h => h.close);
      const highs = history.map(h => h.high);
      const lows = history.map(h => h.low);
      const volumes = history.map(h => h.volume);

      // Calculate moving averages
      const sma20 = this.calculateSMA(closes, 20);
      const sma50 = this.calculateSMA(closes, 50);
      const ema12 = this.calculateEMA(closes, 12);
      const ema26 = this.calculateEMA(closes, 26);

      // Calculate RSI
      const rsi = this.calculateRSI(closes, 14);

      // Calculate MACD
      const macd = this.calculateMACD(closes);

      // Calculate Bollinger Bands
      const bollingerBands = this.calculateBollingerBands(closes, 20, 2);

      // Determine trend
      const trend = this.determineTrend(closes, sma20, sma50);

      return {
        symbol: symbol.toUpperCase(),
        period,
        movingAverages: {
          sma20: sma20[sma20.length - 1],
          sma50: sma50[sma50.length - 1],
          ema12: ema12[ema12.length - 1],
          ema26: ema26[ema26.length - 1]
        },
        rsi: rsi[rsi.length - 1],
        macd: {
          macd: macd.macd[macd.macd.length - 1],
          signal: macd.signal[macd.signal.length - 1],
          histogram: macd.histogram[macd.histogram.length - 1]
        },
        bollingerBands: {
          upper: bollingerBands.upper[bollingerBands.upper.length - 1],
          middle: bollingerBands.middle[bollingerBands.middle.length - 1],
          lower: bollingerBands.lower[bollingerBands.lower.length - 1]
        },
        trend,
        volume: {
          current: volumes[volumes.length - 1],
          average: ss.mean(volumes),
          relative: volumes[volumes.length - 1] / ss.mean(volumes)
        }
      };
    } catch (error) {
      console.error(`Technical indicators error for ${symbol}:`, error);
      throw error;
    }
  }

  // Calculate Simple Moving Average
  calculateSMA(prices, period) {
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  // Calculate Exponential Moving Average
  calculateEMA(prices, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    ema[0] = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 1; i < prices.length - period + 1; i++) {
      ema[i] = (prices[i + period - 1] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
  }

  // Calculate RSI
  calculateRSI(prices, period = 14) {
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const rsi = [];
    
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = ss.mean(gains.slice(i - period + 1, i + 1));
      const avgLoss = ss.mean(losses.slice(i - period + 1, i + 1));
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  // Calculate MACD
  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const macd = [];
    const minLength = Math.min(ema12.length, ema26.length);
    
    for (let i = 0; i < minLength; i++) {
      macd.push(ema12[i] - ema26[i]);
    }
    
    const signal = this.calculateEMA(macd, 9);
    const histogram = [];
    
    for (let i = 0; i < signal.length; i++) {
      histogram.push(macd[i] - signal[i]);
    }
    
    return { macd, signal, histogram };
  }

  // Calculate Bollinger Bands
  calculateBollingerBands(prices, period = 20, multiplier = 2) {
    const sma = this.calculateSMA(prices, period);
    const upper = [];
    const lower = [];
    
    for (let i = 0; i < sma.length; i++) {
      const slice = prices.slice(i, i + period);
      const stdDev = ss.standardDeviation(slice);
      
      upper.push(sma[i] + (stdDev * multiplier));
      lower.push(sma[i] - (stdDev * multiplier));
    }
    
    return {
      upper,
      middle: sma,
      lower
    };
  }

  // Determine trend
  determineTrend(prices, sma20, sma50) {
    const currentPrice = prices[prices.length - 1];
    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    
    if (currentPrice > currentSMA20 && currentSMA20 > currentSMA50) {
      return 'bullish';
    } else if (currentPrice < currentSMA20 && currentSMA20 < currentSMA50) {
      return 'bearish';
    } else {
      return 'neutral';
    }
  }

  // Calculate volatility
  async calculateVolatility(symbol, period = '30d') {
    try {
      const days = this.parsePeriodToDays(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        date: { $gte: startDate }
      }).sort({ date: 1 });

      if (history.length < 2) {
        throw new Error('Insufficient data for volatility calculation');
      }

      // Calculate daily returns
      const returns = [];
      for (let i = 1; i < history.length; i++) {
        const dailyReturn = (history[i].close - history[i - 1].close) / history[i - 1].close;
        returns.push(dailyReturn);
      }

      const volatility = ss.standardDeviation(returns);
      const annualizedVolatility = volatility * Math.sqrt(252); // 252 trading days per year

      return {
        daily: volatility,
        annualized: annualizedVolatility,
        percentile: this.calculateVolatilityPercentile(volatility),
        classification: this.classifyVolatility(annualizedVolatility)
      };
    } catch (error) {
      console.error(`Volatility calculation error for ${symbol}:`, error);
      throw error;
    }
  }

  // Calculate support and resistance levels
  async calculateSupportResistance(symbol, period = '90d') {
    try {
      const days = this.parsePeriodToDays(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        date: { $gte: startDate }
      }).sort({ date: 1 });

      if (history.length < 20) {
        throw new Error('Insufficient data for support/resistance calculation');
      }

      const highs = history.map(h => h.high);
      const lows = history.map(h => h.low);
      const closes = history.map(h => h.close);

      // Find pivot points
      const pivotHighs = this.findPivotPoints(highs, 'high');
      const pivotLows = this.findPivotPoints(lows, 'low');

      // Calculate support and resistance levels
      const resistanceLevels = this.calculateLevels(pivotHighs, 'resistance');
      const supportLevels = this.calculateLevels(pivotLows, 'support');

      const currentPrice = closes[closes.length - 1];

      return {
        currentPrice,
        resistance: resistanceLevels.filter(level => level.price > currentPrice).slice(0, 3),
        support: supportLevels.filter(level => level.price < currentPrice).slice(-3),
        pivotPoints: {
          highs: pivotHighs.slice(-5),
          lows: pivotLows.slice(-5)
        }
      };
    } catch (error) {
      console.error(`Support/resistance calculation error for ${symbol}:`, error);
      throw error;
    }
  }

  // Find pivot points
  findPivotPoints(prices, type) {
    const pivots = [];
    const window = 5;

    for (let i = window; i < prices.length - window; i++) {
      const current = prices[i];
      const leftWindow = prices.slice(i - window, i);
      const rightWindow = prices.slice(i + 1, i + window + 1);

      if (type === 'high') {
        if (leftWindow.every(p => p <= current) && rightWindow.every(p => p <= current)) {
          pivots.push({ index: i, price: current });
        }
      } else {
        if (leftWindow.every(p => p >= current) && rightWindow.every(p => p >= current)) {
          pivots.push({ index: i, price: current });
        }
      }
    }

    return pivots;
  }

  // Calculate support/resistance levels
  calculateLevels(pivots, type) {
    const prices = pivots.map(p => p.price);
    const levels = [];

    // Group similar prices (within 2% of each other)
    const tolerance = 0.02;
    const grouped = [];

    prices.forEach(price => {
      let added = false;
      for (let group of grouped) {
        if (Math.abs(price - group[0]) / group[0] <= tolerance) {
          group.push(price);
          added = true;
          break;
        }
      }
      if (!added) {
        grouped.push([price]);
      }
    });

    // Calculate level strength based on number of touches
    grouped.forEach(group => {
      levels.push({
        price: ss.mean(group),
        strength: group.length,
        type
      });
    });

    return levels.sort((a, b) => b.strength - a.strength);
  }

  // Analyze sentiment (basic implementation)
  async analyzeSentiment(symbol) {
    try {
      // In a real implementation, this would analyze news articles, social media, etc.
      // For now, we'll use a simple mock implementation
      
      const mockNewsText = `${symbol} stock shows strong performance with positive earnings outlook. 
                           Analysts recommend buy with target price increase. Market sentiment remains bullish.`;
      
      const analysis = this.sentiment.analyze(mockNewsText);
      
      const normalizedScore = Math.max(-1, Math.min(1, analysis.score / 10));
      
      let label;
      if (normalizedScore > 0.1) label = 'Bullish';
      else if (normalizedScore < -0.1) label = 'Bearish';
      else label = 'Neutral';

      return {
        score: normalizedScore,
        label,
        confidence: Math.abs(normalizedScore),
        lastAnalyzed: new Date(),
        sources: {
          news: Math.floor(Math.random() * 20) + 5,
          social: Math.floor(Math.random() * 100) + 20
        }
      };
    } catch (error) {
      console.error(`Sentiment analysis error for ${symbol}:`, error);
      throw error;
    }
  }

  // Generate prediction
  async generatePrediction(symbol, timeframe, predictionType) {
    try {
      const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
      if (!stock) {
        throw new Error('Stock not found');
      }

      // Get historical data for model input
      const days = this.getTimeframeDays(timeframe);
      const inputDays = Math.max(days * 5, 60); // Use 5x the prediction period or minimum 60 days
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - inputDays);

      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        date: { $gte: startDate }
      }).sort({ date: 1 });

      if (history.length < 30) {
        throw new Error('Insufficient historical data for prediction');
      }

      // Calculate technical indicators for prediction
      const indicators = await this.calculateTechnicalIndicators(symbol, `${inputDays}d`);
      
      // Simple prediction model (in production, this would be a more sophisticated ML model)
      const prediction = this.generateSimplePrediction(stock, history, indicators, timeframe, predictionType);

      // Save prediction to database
      const predictionDoc = new Prediction({
        symbol: symbol.toUpperCase(),
        predictionType,
        timeframe,
        predictedPrice: prediction.predictedPrice,
        predictedHigh: prediction.predictedHigh,
        predictedLow: prediction.predictedLow,
        predictedTrend: prediction.predictedTrend,
        confidence: prediction.confidence,
        model: {
          name: 'SimpleMovingAverageModel',
          version: '1.0',
          parameters: prediction.modelParams
        },
        inputData: {
          startDate: startDate,
          endDate: new Date(),
          dataPoints: history.length,
          features: ['price', 'volume', 'sma', 'rsi', 'macd']
        },
        targetDate: this.calculateTargetDate(timeframe)
      });

      await predictionDoc.save();
      return predictionDoc;
    } catch (error) {
      console.error(`Prediction generation error for ${symbol}:`, error);
      throw error;
    }
  }

  // Simple prediction model
  generateSimplePrediction(stock, history, indicators, timeframe, predictionType) {
    const currentPrice = stock.currentPrice;
    const closes = history.map(h => h.close);
    const recentPrices = closes.slice(-20); // Last 20 days
    
    // Calculate trend strength
    const trendStrength = this.calculateTrendStrength(recentPrices);
    const volatility = ss.standardDeviation(recentPrices.map((price, i) => 
      i > 0 ? (price - recentPrices[i-1]) / recentPrices[i-1] : 0
    ).slice(1));

    // Base prediction on moving averages and trend
    const sma20 = indicators.movingAverages.sma20;
    const rsi = indicators.rsi;
    
    // Prediction logic
    let priceMultiplier = 1;
    let confidence = 0.6; // Base confidence
    
    // Adjust based on trend
    if (indicators.trend === 'bullish') {
      priceMultiplier += trendStrength * 0.1;
      confidence += 0.1;
    } else if (indicators.trend === 'bearish') {
      priceMultiplier -= trendStrength * 0.1;
      confidence += 0.1;
    }
    
    // Adjust based on RSI
    if (rsi < 30) { // Oversold
      priceMultiplier += 0.05;
      confidence += 0.05;
    } else if (rsi > 70) { // Overbought
      priceMultiplier -= 0.05;
      confidence += 0.05;
    }
    
    // Time decay for longer predictions
    const timeframeDays = this.getTimeframeDays(timeframe);
    const timeDecay = Math.max(0.3, 1 - (timeframeDays / 90));
    confidence *= timeDecay;
    
    const predictedPrice = currentPrice * priceMultiplier;
    const priceRange = currentPrice * volatility * Math.sqrt(timeframeDays / 30);
    
    return {
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      predictedHigh: Math.round((predictedPrice + priceRange) * 100) / 100,
      predictedLow: Math.round((predictedPrice - priceRange) * 100) / 100,
      predictedTrend: priceMultiplier > 1.02 ? 'bullish' : priceMultiplier < 0.98 ? 'bearish' : 'neutral',
      confidence: Math.min(0.95, Math.max(0.1, confidence)),
      modelParams: {
        trendStrength,
        volatility,
        rsi,
        timeframeDays,
        priceMultiplier
      }
    };
  }

  // Calculate correlation between stocks
  async calculateCorrelation(symbol1, symbols2, period = '90d') {
    try {
      const days = this.parsePeriodToDays(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get historical data for all symbols
      const allSymbols = [symbol1, ...symbols2];
      const historyPromises = allSymbols.map(symbol =>
        StockHistory.find({
          symbol: symbol.toUpperCase(),
          date: { $gte: startDate }
        }).sort({ date: 1 })
      );

      const histories = await Promise.all(historyPromises);
      
      // Calculate daily returns for each stock
      const returns = histories.map(history => {
        const dailyReturns = [];
        for (let i = 1; i < history.length; i++) {
          const dailyReturn = (history[i].close - history[i - 1].close) / history[i - 1].close;
          dailyReturns.push(dailyReturn);
        }
        return dailyReturns;
      });

      // Calculate correlations
      const correlations = [];
      const baseReturns = returns[0];

      for (let i = 1; i < returns.length; i++) {
        const compareReturns = returns[i];
        const minLength = Math.min(baseReturns.length, compareReturns.length);
        
        if (minLength > 10) {
          const correlation = ss.sampleCorrelation(
            baseReturns.slice(-minLength),
            compareReturns.slice(-minLength)
          );
          
          correlations.push({
            symbol: allSymbols[i],
            correlation: Math.round(correlation * 1000) / 1000,
            strength: this.classifyCorrelation(correlation),
            dataPoints: minLength
          });
        }
      }

      return correlations;
    } catch (error) {
      console.error(`Correlation calculation error:`, error);
      throw error;
    }
  }

  // Helper methods
  parsePeriodToDays(period) {
    const match = period.match(/(\d+)([dwmy])/);
    if (!match) return 30;
    
    const [, num, unit] = match;
    const number = parseInt(num);
    
    switch (unit) {
      case 'd': return number;
      case 'w': return number * 7;
      case 'm': return number * 30;
      case 'y': return number * 365;
      default: return 30;
    }
  }

  getTimeframeDays(timeframe) {
    const timeframeMap = {
      '1d': 1,
      '3d': 3,
      '1w': 7,
      '2w': 14,
      '1m': 30,
      '3m': 90
    };
    return timeframeMap[timeframe] || 7;
  }

  calculateTargetDate(timeframe) {
    const days = this.getTimeframeDays(timeframe);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    return targetDate;
  }

  calculateTrendStrength(prices) {
    if (prices.length < 2) return 0;
    
    let upDays = 0;
    let downDays = 0;
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) upDays++;
      else if (prices[i] < prices[i - 1]) downDays++;
    }
    
    const totalDays = prices.length - 1;
    return Math.abs(upDays - downDays) / totalDays;
  }

  calculateVolatilityPercentile(volatility) {
    // Mock implementation - in production, this would compare against historical volatility database
    if (volatility < 0.01) return 'Low (< 25th percentile)';
    if (volatility < 0.02) return 'Medium (25-75th percentile)';
    return 'High (> 75th percentile)';
  }

  classifyVolatility(annualizedVolatility) {
    if (annualizedVolatility < 0.2) return 'Low';
    if (annualizedVolatility < 0.4) return 'Medium';
    return 'High';
  }

  classifyCorrelation(correlation) {
    const abs = Math.abs(correlation);
    if (abs < 0.3) return 'Weak';
    if (abs < 0.7) return 'Moderate';
    return 'Strong';
  }

  calculateAccuracyMetrics(predictions) {
    if (predictions.length === 0) {
      return {
        averageAccuracy: 0,
        totalPredictions: 0,
        accuracyByTimeframe: {},
        accuracyByType: {}
      };
    }

    const accuracies = predictions.map(p => p.accuracy).filter(a => a !== null && a !== undefined);
    const averageAccuracy = accuracies.length > 0 ? ss.mean(accuracies) : 0;

    // Group by timeframe
    const byTimeframe = {};
    predictions.forEach(p => {
      if (!byTimeframe[p.timeframe]) byTimeframe[p.timeframe] = [];
      if (p.accuracy !== null && p.accuracy !== undefined) {
        byTimeframe[p.timeframe].push(p.accuracy);
      }
    });

    // Group by type
    const byType = {};
    predictions.forEach(p => {
      if (!byType[p.predictionType]) byType[p.predictionType] = [];
      if (p.accuracy !== null && p.accuracy !== undefined) {
        byType[p.predictionType].push(p.accuracy);
      }
    });

    return {
      averageAccuracy: Math.round(averageAccuracy * 1000) / 1000,
      totalPredictions: predictions.length,
      accuracyByTimeframe: Object.keys(byTimeframe).reduce((acc, key) => {
        acc[key] = {
          average: Math.round(ss.mean(byTimeframe[key]) * 1000) / 1000,
          count: byTimeframe[key].length
        };
        return acc;
      }, {}),
      accuracyByType: Object.keys(byType).reduce((acc, key) => {
        acc[key] = {
          average: Math.round(ss.mean(byType[key]) * 1000) / 1000,
          count: byType[key].length
        };
        return acc;
      }, {})
    };
  }
}

module.exports = new AnalyticsService();