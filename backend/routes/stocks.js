const express = require('express');
const Stock = require('../models/Stock');
const StockHistory = require('../models/StockHistory');
const { authenticateToken, optionalAuth, requirePremium } = require('../middleware/auth');
const stockService = require('../services/stockService');

const router = express.Router();

// Get trending stocks
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get stocks with highest volume and price changes
    const trendingStocks = await Stock.find({ isActive: true })
      .sort({ volume: -1, changePercent: -1 })
      .limit(limit)
      .select('symbol name currentPrice change changePercent volume sector');

    res.json({
      stocks: trendingStocks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending stocks error:', error);
    res.status(500).json({ message: 'Error fetching trending stocks' });
  }
});

// Search stocks
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 1) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const stocks = await Stock.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { symbol: searchRegex },
            { name: searchRegex }
          ]
        }
      ]
    })
    .limit(parseInt(limit))
    .select('symbol name currentPrice change changePercent sector exchange')
    .sort({ symbol: 1 });

    res.json({
      query: q,
      results: stocks,
      count: stocks.length
    });
  } catch (error) {
    console.error('Stock search error:', error);
    res.status(500).json({ message: 'Error searching stocks' });
  }
});

// Get stock details
router.get('/:symbol', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const stock = await Stock.findOne({ 
      symbol: symbol.toUpperCase(),
      isActive: true 
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Get recent price history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentHistory = await StockHistory.find({
      symbol: symbol.toUpperCase(),
      date: { $gte: thirtyDaysAgo }
    })
    .sort({ date: -1 })
    .limit(30);

    res.json({
      stock,
      recentHistory,
      lastUpdated: stock.lastUpdated
    });
  } catch (error) {
    console.error('Stock details error:', error);
    res.status(500).json({ message: 'Error fetching stock details' });
  }
});

// Get stock historical data
router.get('/:symbol/history', optionalAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y', interval = '1d' } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '5d':
        startDate.setDate(startDate.getDate() - 5);
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '2y':
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const history = await StockHistory.find({
      symbol: symbol.toUpperCase(),
      date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: 1 });

    res.json({
      symbol: symbol.toUpperCase(),
      period,
      interval,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('Stock history error:', error);
    res.status(500).json({ message: 'Error fetching stock history' });
  }
});

// Get market overview
router.get('/market/overview', optionalAuth, async (req, res) => {
  try {
    // Get major indices and market stats
    const majorIndices = ['SPY', 'QQQ', 'DIA', 'IWM'];
    
    const indices = await Stock.find({
      symbol: { $in: majorIndices },
      isActive: true
    }).select('symbol name currentPrice change changePercent');

    // Get market statistics
    const totalStocks = await Stock.countDocuments({ isActive: true });
    const gainers = await Stock.countDocuments({ 
      isActive: true, 
      changePercent: { $gt: 0 } 
    });
    const losers = await Stock.countDocuments({ 
      isActive: true, 
      changePercent: { $lt: 0 } 
    });

    // Get top gainers and losers
    const topGainers = await Stock.find({ 
      isActive: true,
      changePercent: { $gt: 0 }
    })
    .sort({ changePercent: -1 })
    .limit(5)
    .select('symbol name currentPrice change changePercent');

    const topLosers = await Stock.find({ 
      isActive: true,
      changePercent: { $lt: 0 }
    })
    .sort({ changePercent: 1 })
    .limit(5)
    .select('symbol name currentPrice change changePercent');

    res.json({
      indices,
      statistics: {
        totalStocks,
        gainers,
        losers,
        unchanged: totalStocks - gainers - losers
      },
      topGainers,
      topLosers,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market overview error:', error);
    res.status(500).json({ message: 'Error fetching market overview' });
  }
});

// Get stocks by sector
router.get('/sector/:sector', optionalAuth, async (req, res) => {
  try {
    const { sector } = req.params;
    const { limit = 50, sort = 'marketCap' } = req.query;
    
    const sortOptions = {};
    sortOptions[sort] = -1;

    const stocks = await Stock.find({
      sector: new RegExp(sector, 'i'),
      isActive: true
    })
    .sort(sortOptions)
    .limit(parseInt(limit))
    .select('symbol name currentPrice change changePercent marketCap volume');

    res.json({
      sector,
      stocks,
      count: stocks.length
    });
  } catch (error) {
    console.error('Sector stocks error:', error);
    res.status(500).json({ message: 'Error fetching sector stocks' });
  }
});

// Add stock to watchlist (authenticated users only)
router.post('/:symbol/watchlist', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = req.user;

    // Check if stock exists
    const stock = await Stock.findOne({ 
      symbol: symbol.toUpperCase(),
      isActive: true 
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Check if already in watchlist
    const existingWatch = user.preferences.watchlist.find(
      item => item.symbol === symbol.toUpperCase()
    );

    if (existingWatch) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    // Add to watchlist
    user.preferences.watchlist.push({
      symbol: symbol.toUpperCase(),
      addedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Stock added to watchlist',
      watchlist: user.preferences.watchlist
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Error adding stock to watchlist' });
  }
});

// Remove stock from watchlist
router.delete('/:symbol/watchlist', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = req.user;

    user.preferences.watchlist = user.preferences.watchlist.filter(
      item => item.symbol !== symbol.toUpperCase()
    );

    await user.save();

    res.json({
      message: 'Stock removed from watchlist',
      watchlist: user.preferences.watchlist
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Error removing stock from watchlist' });
  }
});

// Get user's watchlist
router.get('/user/watchlist', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const symbols = user.preferences.watchlist.map(item => item.symbol);

    if (symbols.length === 0) {
      return res.json({ watchlist: [] });
    }

    const stocks = await Stock.find({
      symbol: { $in: symbols },
      isActive: true
    }).select('symbol name currentPrice change changePercent');

    // Merge with watchlist metadata
    const watchlistWithData = user.preferences.watchlist.map(watchItem => {
      const stockData = stocks.find(stock => stock.symbol === watchItem.symbol);
      return {
        ...watchItem.toObject(),
        ...stockData?.toObject()
      };
    });

    res.json({ watchlist: watchlistWithData });
  } catch (error) {
    console.error('Watchlist fetch error:', error);
    res.status(500).json({ message: 'Error fetching watchlist' });
  }
});

// Refresh stock data (premium feature)
router.post('/:symbol/refresh', authenticateToken, requirePremium, async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Trigger stock data refresh
    const updatedStock = await stockService.refreshStockData(symbol.toUpperCase());
    
    res.json({
      message: 'Stock data refreshed',
      stock: updatedStock,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stock refresh error:', error);
    res.status(500).json({ message: 'Error refreshing stock data' });
  }
});

module.exports = router;