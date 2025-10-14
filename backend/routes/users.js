const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's watchlist with current prices
    const Stock = require('../models/Stock');
    const watchlistSymbols = user.preferences.watchlist.map(item => item.symbol);
    
    const watchlistStocks = await Stock.find({
      symbol: { $in: watchlistSymbols },
      isActive: true
    }).select('symbol name currentPrice change changePercent');

    // Get user analytics
    const analytics = {
      loginCount: user.analytics.loginCount,
      lastLogin: user.analytics.lastLogin,
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      watchlistSize: user.preferences.watchlist.length
    };

    res.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      },
      watchlist: watchlistStocks,
      analytics,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { notifications, dashboard, watchlist } = req.body;

    if (notifications) {
      user.preferences.notifications = { 
        ...user.preferences.notifications, 
        ...notifications 
      };
    }

    if (dashboard) {
      user.preferences.dashboard = { 
        ...user.preferences.dashboard, 
        ...dashboard 
      };
    }

    if (watchlist) {
      user.preferences.watchlist = watchlist;
    }

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

// Get user activity log
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    // This would typically come from a separate activity log collection
    // For now, return basic user analytics
    const user = req.user;
    
    const activity = {
      recentLogins: [
        {
          timestamp: user.analytics.lastLogin,
          action: 'login',
          details: 'User logged in'
        }
      ],
      watchlistChanges: user.preferences.watchlist.map(item => ({
        timestamp: item.addedAt,
        action: 'watchlist_add',
        details: `Added ${item.symbol} to watchlist`
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    };

    res.json({
      activity: [...activity.recentLogins, ...activity.watchlistChanges]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({ message: 'Error fetching activity log' });
  }
});

// Update subscription (admin only)
router.put('/:userId/subscription', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan, startDate, endDate, isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (plan) user.subscription.plan = plan;
    if (startDate) user.subscription.startDate = new Date(startDate);
    if (endDate) user.subscription.endDate = new Date(endDate);
    if (typeof isActive === 'boolean') user.subscription.isActive = isActive;

    await user.save();

    res.json({
      message: 'Subscription updated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, subscription } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') }
      ];
    }
    
    if (role) query.role = role;
    if (subscription) query['subscription.plan'] = subscription;

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (admin only)
router.get('/:userId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -verificationToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Deactivate user (admin only)
router.put('/:userId/deactivate', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({
      message: 'User deactivated successfully',
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('User deactivation error:', error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ 'subscription.plan': { $ne: 'free' }, 'subscription.isActive': true }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    // Get user growth over last 12 months
    const monthlyGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      monthlyGrowth.push({
        month: startOfMonth.toISOString().substring(0, 7), // YYYY-MM format
        newUsers: count
      });
    }

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        premiumUsers,
        newUsersThisMonth,
        conversionRate: totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(2) : 0
      },
      growth: monthlyGrowth
    });
  } catch (error) {
    console.error('User statistics error:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

module.exports = router;