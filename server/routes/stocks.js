const express = require('express');
const axios = require('axios');
const Stock = require('../models/Stock');
const auth = require('../middleware/auth');

const router = express.Router();

// Alpha Vantage API configuration
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Get stock data by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { source = 'alpha_vantage' } = req.query;

    let stockData;

    if (source === 'alpha_vantage') {
      stockData = await getAlphaVantageData(symbol);
    } else if (source === 'yahoo') {
      stockData = await getYahooFinanceData(symbol);
    } else {
      return res.status(400).json({ message: 'Invalid data source' });
    }

    if (!stockData) {
      return res.status(404).json({ message: 'Stock data not found' });
    }

    // Save or update stock data in database
    await saveStockData(stockData);

    res.json(stockData);
  } catch (error) {
    console.error('Get stock data error:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

// Get multiple stocks
router.post('/batch', async (req, res) => {
  try {
    const { symbols, source = 'alpha_vantage' } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Symbols array is required' });
    }

    const stockDataPromises = symbols.map(symbol => {
      if (source === 'alpha_vantage') {
        return getAlphaVantageData(symbol);
      } else if (source === 'yahoo') {
        return getYahooFinanceData(symbol);
      }
      return null;
    });

    const results = await Promise.allSettled(stockDataPromises);
    const stockData = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    // Save all stock data
    await Promise.all(stockData.map(data => saveStockData(data)));

    res.json({ stocks: stockData });
  } catch (error) {
    console.error('Get batch stock data error:', error);
    res.status(500).json({ message: 'Error fetching batch stock data' });
  }
});

// Search stocks
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    // Search in database first
    const dbResults = await Stock.find({
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).limit(parseInt(limit));

    res.json({ stocks: dbResults });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({ message: 'Error searching stocks' });
  }
});

// Get stock price history
router.get('/:symbol/history', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y', interval = '1d' } = req.query;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Get historical data from Alpha Vantage
    const historicalData = await getHistoricalData(symbol, period, interval);
    
    if (historicalData) {
      // Update stock with new historical data
      stock.priceHistory = historicalData;
      stock.lastUpdated = new Date();
      await stock.save();
    }

    res.json({
      symbol: stock.symbol,
      name: stock.name,
      priceHistory: stock.priceHistory,
      lastUpdated: stock.lastUpdated
    });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ message: 'Error fetching price history' });
  }
});

// Get market overview
router.get('/market/overview', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get top stocks by market cap
    const topStocks = await Stock.find({ isActive: true })
      .sort({ marketCap: -1 })
      .limit(parseInt(limit));

    // Calculate market statistics
    const totalStocks = await Stock.countDocuments({ isActive: true });
    const avgChange = await Stock.aggregate([
      { $match: { isActive: true, changePercent: { $exists: true } } },
      { $group: { _id: null, avgChange: { $avg: '$changePercent' } } }
    ]);

    res.json({
      totalStocks,
      averageChange: avgChange[0]?.avgChange || 0,
      topStocks: topStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap
      }))
    });
  } catch (error) {
    console.error('Get market overview error:', error);
    res.status(500).json({ message: 'Error fetching market overview' });
  }
});

// Helper function to get Alpha Vantage data
async function getAlphaVantageData(symbol) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: process.env.ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Global Quote'];
    if (!data || data['01. symbol'] === '') {
      return null;
    }

    return {
      symbol: data['01. symbol'],
      name: data['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
      currentPrice: parseFloat(data['05. price']),
      previousClose: parseFloat(data['08. previous close']),
      open: parseFloat(data['02. open']),
      high: parseFloat(data['03. high']),
      low: parseFloat(data['04. low']),
      volume: parseInt(data['06. volume']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent'].replace('%', ''))
    };
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    return null;
  }
}

// Helper function to get Yahoo Finance data
async function getYahooFinanceData(symbol) {
  try {
    const response = await axios.get(`${YAHOO_FINANCE_BASE_URL}/${symbol}`, {
      params: {
        range: '1d',
        interval: '1m',
        includePrePost: true,
        useYfid: true,
        corsDomain: 'finance.yahoo.com'
      }
    });

    const data = response.data.chart.result[0];
    if (!data) return null;

    const meta = data.meta;
    const quote = data.indicators.quote[0];

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName,
      currentPrice: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      open: meta.regularMarketOpen,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      exchange: meta.exchangeName,
      marketCap: meta.marketCap
    };
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    return null;
  }
}

// Helper function to get historical data
async function getHistoricalData(symbol, period, interval) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
        outputsize: period === '1y' ? 'full' : 'compact'
      }
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) return null;

    return Object.entries(timeSeries).map(([date, data]) => ({
      date: new Date(date),
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume'])
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Historical data error:', error);
    return null;
  }
}

// Helper function to save stock data
async function saveStockData(stockData) {
  try {
    await Stock.findOneAndUpdate(
      { symbol: stockData.symbol },
      {
        ...stockData,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Save stock data error:', error);
  }
}

module.exports = router;