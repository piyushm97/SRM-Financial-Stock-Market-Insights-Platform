const axios = require('axios');
const yahooFinance = require('yahoo-finance2').default;
const Stock = require('../models/Stock');
const StockHistory = require('../models/StockHistory');

class StockService {
  constructor() {
    this.alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.alphaVantageBaseUrl = 'https://www.alphavantage.co/query';
  }

  // Fetch stock data from Alpha Vantage
  async fetchFromAlphaVantage(symbol, functionType = 'GLOBAL_QUOTE') {
    try {
      const response = await axios.get(this.alphaVantageBaseUrl, {
        params: {
          function: functionType,
          symbol: symbol,
          apikey: this.alphaVantageApiKey
        },
        timeout: 10000
      });

      if (response.data['Error Message']) {
        throw new Error(`Alpha Vantage API Error: ${response.data['Error Message']}`);
      }

      if (response.data['Note']) {
        throw new Error('Alpha Vantage API rate limit exceeded');
      }

      return response.data;
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Fetch stock data from Yahoo Finance
  async fetchFromYahooFinance(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol);
      const summary = await yahooFinance.quoteSummary(symbol, {
        modules: ['summaryDetail', 'defaultKeyStatistics']
      });

      return {
        quote,
        summary
      };
    } catch (error) {
      console.error(`Yahoo Finance API error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get current stock quote
  async getCurrentQuote(symbol) {
    try {
      // Try Yahoo Finance first (more reliable and free)
      const yahooData = await this.fetchFromYahooFinance(symbol);
      const quote = yahooData.quote;

      return {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName,
        currentPrice: quote.regularMarketPrice,
        previousClose: quote.regularMarketPreviousClose,
        openPrice: quote.regularMarketOpen,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        marketCap: quote.marketCap,
        pe: quote.trailingPE,
        eps: quote.trailingEps,
        dividend: quote.dividendRate,
        dividendYield: quote.dividendYield,
        beta: quote.beta,
        week52High: quote.fiftyTwoWeekHigh,
        week52Low: quote.fiftyTwoWeekLow,
        exchange: quote.fullExchangeName,
        sector: yahooData.summary?.summaryProfile?.sector,
        industry: yahooData.summary?.summaryProfile?.industry,
        lastUpdated: new Date()
      };
    } catch (yahooError) {
      console.log(`Yahoo Finance failed for ${symbol}, trying Alpha Vantage...`);
      
      try {
        // Fallback to Alpha Vantage
        const alphaData = await this.fetchFromAlphaVantage(symbol);
        const quote = alphaData['Global Quote'];

        if (!quote) {
          throw new Error('No quote data received from Alpha Vantage');
        }

        return {
          symbol: quote['01. symbol'],
          currentPrice: parseFloat(quote['05. price']),
          previousClose: parseFloat(quote['08. previous close']),
          openPrice: parseFloat(quote['02. open']),
          dayHigh: parseFloat(quote['03. high']),
          dayLow: parseFloat(quote['04. low']),
          volume: parseInt(quote['06. volume']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          lastUpdated: new Date()
        };
      } catch (alphaError) {
        throw new Error(`Both APIs failed: Yahoo (${yahooError.message}), Alpha Vantage (${alphaError.message})`);
      }
    }
  }

  // Get historical data
  async getHistoricalData(symbol, period = '1y') {
    try {
      const endDate = new Date();
      const startDate = new Date();

      // Calculate start date based on period
      switch (period) {
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

      const historical = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      });

      return historical.map(item => ({
        symbol: symbol.toUpperCase(),
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        adjustedClose: item.adjClose,
        volume: item.volume,
        dataSource: 'yahoo_finance'
      }));
    } catch (error) {
      console.error(`Historical data error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Update stock in database
  async updateStock(stockData) {
    try {
      const stock = await Stock.findOneAndUpdate(
        { symbol: stockData.symbol },
        { ...stockData, lastUpdated: new Date() },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );

      // Broadcast real-time update if available
      if (global.broadcastStockUpdate) {
        global.broadcastStockUpdate(stock.symbol, {
          currentPrice: stock.currentPrice,
          change: stock.change,
          changePercent: stock.changePercent,
          volume: stock.volume,
          lastUpdated: stock.lastUpdated
        });
      }

      return stock;
    } catch (error) {
      console.error(`Database update error for ${stockData.symbol}:`, error.message);
      throw error;
    }
  }

  // Refresh stock data
  async refreshStockData(symbol) {
    try {
      const quoteData = await this.getCurrentQuote(symbol);
      const updatedStock = await this.updateStock(quoteData);
      
      console.log(`Updated stock data for ${symbol}`);
      return updatedStock;
    } catch (error) {
      console.error(`Refresh error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Bulk refresh multiple stocks
  async refreshMultipleStocks(symbols) {
    const results = {
      success: [],
      failed: []
    };

    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      const promises = batch.map(async (symbol) => {
        try {
          const stock = await this.refreshStockData(symbol);
          results.success.push(stock);
        } catch (error) {
          results.failed.push({ symbol, error: error.message });
        }
      });

      await Promise.all(promises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Save historical data to database
  async saveHistoricalData(symbol, historicalData) {
    try {
      const operations = historicalData.map(data => ({
        updateOne: {
          filter: { symbol: data.symbol, date: data.date },
          update: data,
          upsert: true
        }
      }));

      if (operations.length > 0) {
        await StockHistory.bulkWrite(operations);
        console.log(`Saved ${operations.length} historical records for ${symbol}`);
      }
    } catch (error) {
      console.error(`Historical data save error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get popular stocks to track
  getPopularStocks() {
    return [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
      'SPY', 'QQQ', 'DIA', 'IWM', 'VTI', 'VOO',
      'JPM', 'BAC', 'WFC', 'GS', 'MS',
      'JNJ', 'PFE', 'UNH', 'ABBV', 'MRK',
      'XOM', 'CVX', 'COP', 'SLB',
      'KO', 'PEP', 'WMT', 'HD', 'MCD'
    ];
  }

  // Initialize popular stocks in database
  async initializePopularStocks() {
    try {
      const popularStocks = this.getPopularStocks();
      console.log('Initializing popular stocks...');
      
      const results = await this.refreshMultipleStocks(popularStocks);
      
      console.log(`Initialized ${results.success.length} stocks successfully`);
      if (results.failed.length > 0) {
        console.log(`Failed to initialize ${results.failed.length} stocks:`, 
          results.failed.map(f => f.symbol));
      }
      
      return results;
    } catch (error) {
      console.error('Stock initialization error:', error);
      throw error;
    }
  }
}

module.exports = new StockService();