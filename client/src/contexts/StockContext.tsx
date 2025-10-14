import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  exchange?: string;
  sector?: string;
  industry?: string;
}

interface PriceHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  sma20?: number;
  sma50?: number;
  sma200?: number;
  rsi?: number;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
}

interface Prediction {
  id: string;
  symbol: string;
  modelType: string;
  predictionType: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  predictionDate: string;
  targetDate: string;
  timeHorizon: number;
  accuracy?: number;
}

interface StockContextType {
  stocks: Stock[];
  watchlist: string[];
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  fetchStock: (symbol: string) => Promise<Stock>;
  fetchMultipleStocks: (symbols: string[]) => Promise<Stock[]>;
  searchStocks: (query: string) => Promise<Stock[]>;
  getPriceHistory: (symbol: string, period?: string) => Promise<PriceHistory[]>;
  getTechnicalAnalysis: (symbol: string) => Promise<TechnicalIndicators>;
  getPredictions: (symbol: string) => Promise<Prediction[]>;
  generatePrediction: (symbol: string, type?: string) => Promise<Prediction>;
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
  clearError: () => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchStock = async (symbol: string): Promise<Stock> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stocks/${symbol}`);
      const stock = response.data;
      
      setStocks(prev => {
        const existing = prev.find(s => s.symbol === stock.symbol);
        if (existing) {
          return prev.map(s => s.symbol === stock.symbol ? stock : s);
        }
        return [...prev, stock];
      });
      
      return stock;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch stock data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultipleStocks = async (symbols: string[]): Promise<Stock[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/stocks/batch`, { symbols });
      const stocksData = response.data.stocks;
      
      setStocks(prev => {
        const existingSymbols = new Set(prev.map(s => s.symbol));
        const newStocks = stocksData.filter((stock: Stock) => !existingSymbols.has(stock.symbol));
        return [...prev, ...newStocks];
      });
      
      return stocksData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch stocks data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchStocks = async (query: string): Promise<Stock[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stocks/search/${query}`);
      return response.data.stocks;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search stocks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPriceHistory = async (symbol: string, period = '1y'): Promise<PriceHistory[]> => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stocks/${symbol}/history?period=${period}`);
      return response.data.priceHistory;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch price history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getTechnicalAnalysis = async (symbol: string): Promise<TechnicalIndicators> => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/technical/${symbol}`);
      return response.data.technicalIndicators;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch technical analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPredictions = async (symbol: string): Promise<Prediction[]> => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/${symbol}`);
      const predictions = response.data.predictions;
      
      setPredictions(prev => {
        const filtered = prev.filter(p => p.symbol !== symbol);
        return [...filtered, ...predictions];
      });
      
      return predictions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch predictions';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const generatePrediction = async (symbol: string, type = 'short_term'): Promise<Prediction> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predictions/generate`, { symbol, predictionType: type });
      const prediction = response.data.prediction;
      
      setPredictions(prev => [...prev, prediction]);
      
      return prediction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate prediction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol: string): Promise<void> => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/watchlist`, { symbol });
      setWatchlist(prev => [...prev, symbol]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to watchlist';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeFromWatchlist = async (symbol: string): Promise<void> => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/watchlist/${symbol}`);
      setWatchlist(prev => prev.filter(s => s !== symbol));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove from watchlist';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: StockContextType = {
    stocks,
    watchlist,
    predictions,
    loading,
    error,
    fetchStock,
    fetchMultipleStocks,
    searchStocks,
    getPriceHistory,
    getTechnicalAnalysis,
    getPredictions,
    generatePrediction,
    addToWatchlist,
    removeFromWatchlist,
    clearError,
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};