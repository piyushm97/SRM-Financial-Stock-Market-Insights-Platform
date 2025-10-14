import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stock, MarketOverview, WebSocketMessage } from '../types';
import apiService from '../services/api';

interface StockDataContextType {
  trendingStocks: Stock[];
  marketOverview: MarketOverview | null;
  watchlist: any[];
  selectedStock: Stock | null;
  isLoading: boolean;
  error: string | null;
  refreshTrendingStocks: () => Promise<void>;
  refreshMarketOverview: () => Promise<void>;
  refreshWatchlist: () => Promise<void>;
  setSelectedStock: (stock: Stock | null) => void;
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
  subscribeToStock: (symbol: string) => void;
  unsubscribeFromStock: (symbol: string) => void;
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined);

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (context === undefined) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};

interface StockDataProviderProps {
  children: ReactNode;
}

export const StockDataProvider: React.FC<StockDataProviderProps> = ({ children }) => {
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (websocket.readyState === WebSocket.CLOSED) {
          // Reinitialize WebSocket
        }
      }, 5000);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'stock_update':
        if (message.symbol && message.data) {
          updateStockData(message.symbol, message.data);
        }
        break;
      case 'subscribed':
      case 'unsubscribed':
        console.log(message.message);
        break;
      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  const updateStockData = (symbol: string, data: any) => {
    // Update trending stocks
    setTrendingStocks(prev => 
      prev.map(stock => 
        stock.symbol === symbol 
          ? { ...stock, ...data }
          : stock
      )
    );

    // Update selected stock
    if (selectedStock?.symbol === symbol) {
      setSelectedStock(prev => prev ? { ...prev, ...data } : null);
    }

    // Update watchlist
    setWatchlist(prev =>
      prev.map(item =>
        item.symbol === symbol
          ? { ...item, ...data }
          : item
      )
    );
  };

  const refreshTrendingStocks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { stocks } = await apiService.getTrendingStocks(10);
      setTrendingStocks(stocks);
    } catch (err) {
      setError('Failed to fetch trending stocks');
      console.error('Error fetching trending stocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMarketOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const overview = await apiService.getMarketOverview();
      setMarketOverview(overview);
    } catch (err) {
      setError('Failed to fetch market overview');
      console.error('Error fetching market overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWatchlist = async () => {
    try {
      setError(null);
      const { watchlist: userWatchlist } = await apiService.getWatchlist();
      setWatchlist(userWatchlist);
    } catch (err) {
      setError('Failed to fetch watchlist');
      console.error('Error fetching watchlist:', err);
    }
  };

  const addToWatchlist = async (symbol: string) => {
    try {
      await apiService.addToWatchlist(symbol);
      await refreshWatchlist();
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      throw err;
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    try {
      await apiService.removeFromWatchlist(symbol);
      await refreshWatchlist();
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      throw err;
    }
  };

  const subscribeToStock = (symbol: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'subscribe',
        symbol: symbol.toUpperCase()
      }));
    }
  };

  const unsubscribeFromStock = (symbol: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'unsubscribe',
        symbol: symbol.toUpperCase()
      }));
    }
  };

  // Initialize data on mount
  useEffect(() => {
    refreshTrendingStocks();
    refreshMarketOverview();
  }, []);

  const value: StockDataContextType = {
    trendingStocks,
    marketOverview,
    watchlist,
    selectedStock,
    isLoading,
    error,
    refreshTrendingStocks,
    refreshMarketOverview,
    refreshWatchlist,
    setSelectedStock,
    addToWatchlist,
    removeFromWatchlist,
    subscribeToStock,
    unsubscribeFromStock,
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};