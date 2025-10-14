const stockService = require('../services/stockService');
const cron = require('node-cron');

class StartupService {
  async initialize() {
    console.log('🚀 Initializing Stock Market Analysis Platform...');
    
    try {
      // Initialize popular stocks in database
      console.log('📊 Initializing stock data...');
      await stockService.initializePopularStocks();
      
      // Set up scheduled tasks
      this.setupScheduledTasks();
      
      console.log('✅ Platform initialization completed successfully!');
    } catch (error) {
      console.error('❌ Platform initialization failed:', error);
    }
  }

  setupScheduledTasks() {
    console.log('⏰ Setting up scheduled tasks...');
    
    // Update stock data every 15 minutes during market hours (9:30 AM - 4:00 PM EST)
    cron.schedule('*/15 9-16 * * 1-5', async () => {
      console.log('🔄 Updating stock data...');
      try {
        const popularStocks = stockService.getPopularStocks();
        await stockService.refreshMultipleStocks(popularStocks.slice(0, 10)); // Update top 10 to avoid rate limits
      } catch (error) {
        console.error('Stock update error:', error);
      }
    }, {
      timezone: "America/New_York"
    });

    // Update all stocks daily at 6 PM EST (after market close)
    cron.schedule('0 18 * * 1-5', async () => {
      console.log('📈 Daily stock data update...');
      try {
        const popularStocks = stockService.getPopularStocks();
        await stockService.refreshMultipleStocks(popularStocks);
      } catch (error) {
        console.error('Daily update error:', error);
      }
    }, {
      timezone: "America/New_York"
    });

    // Clean up old predictions weekly
    cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Weekly cleanup...');
      try {
        const Prediction = require('../models/Prediction');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Mark expired predictions
        await Prediction.updateMany(
          { 
            targetDate: { $lt: new Date() },
            status: { $in: ['active', 'pending'] }
          },
          { status: 'expired' }
        );
        
        console.log('✅ Weekly cleanup completed');
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });

    console.log('✅ Scheduled tasks configured');
  }
}

module.exports = new StartupService();