// User types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'premium';
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
  };
  preferences: {
    watchlist: WatchlistItem[];
    notifications: {
      email: boolean;
      push: boolean;
      priceAlerts: boolean;
    };
    dashboard: {
      layout: string;
      widgets: string[];
    };
  };
}

export interface WatchlistItem {
  symbol: string;
  addedAt: Date;
}

// Stock types
export interface Stock {
  _id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  description?: string;
  currentPrice: number;
  previousClose?: number;
  openPrice?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  avgVolume?: number;
  change?: number;
  changePercent?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  beta?: number;
  week52High?: number;
  week52Low?: number;
  lastUpdated: Date;
  sentiment?: {
    score: number;
    label: 'Bullish' | 'Bearish' | 'Neutral';
    confidence: number;
    lastAnalyzed: Date;
  };
}

export interface StockHistory {
  _id: string;
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose?: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
  ema12?: number;
  ema26?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  volatility?: number;
}

// Analytics types
export interface Prediction {
  _id: string;
  symbol: string;
  predictionType: 'price' | 'trend' | 'volatility' | 'support_resistance';
  timeframe: '1d' | '3d' | '1w' | '2w' | '1m' | '3m';
  predictedPrice?: number;
  predictedHigh?: number;
  predictedLow?: number;
  predictedTrend?: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  accuracy?: number;
  model: {
    name: string;
    version: string;
    parameters?: any;
  };
  predictionDate: Date;
  targetDate: Date;
  status: 'pending' | 'active' | 'completed' | 'expired';
}

export interface TechnicalIndicators {
  symbol: string;
  period: string;
  movingAverages: {
    sma20: number;
    sma50: number;
    ema12: number;
    ema26: number;
  };
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  trend: 'bullish' | 'bearish' | 'neutral';
  volume: {
    current: number;
    average: number;
    relative: number;
  };
}

export interface Volatility {
  daily: number;
  annualized: number;
  percentile: string;
  classification: 'Low' | 'Medium' | 'High';
}

export interface SupportResistanceLevels {
  currentPrice: number;
  resistance: Array<{
    price: number;
    strength: number;
    type: string;
  }>;
  support: Array<{
    price: number;
    strength: number;
    type: string;
  }>;
  pivotPoints: {
    highs: Array<{ index: number; price: number }>;
    lows: Array<{ index: number; price: number }>;
  };
}

// Feedback types
export interface Feedback {
  _id: string;
  userId: string;
  type: 'survey' | 'bug_report' | 'feature_request' | 'general' | 'rating' | 'ab_test';
  title?: string;
  content: string;
  rating?: number;
  category?: 'ui_ux' | 'performance' | 'data_accuracy' | 'features' | 'mobile' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_review' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  adminResponse?: {
    response: string;
    respondedAt: Date;
  };
}

export interface Survey {
  _id: string;
  title: string;
  description?: string;
  version: string;
  isActive: boolean;
  questions: SurveyQuestion[];
  analytics: {
    totalShows: number;
    totalResponses: number;
    responseRate: number;
  };
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale' | 'rating';
  question: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
  placeholder?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MarketOverview {
  indices: Stock[];
  statistics: {
    totalStocks: number;
    gainers: number;
    losers: number;
    unchanged: number;
  };
  topGainers: Stock[];
  topLosers: Stock[];
  lastUpdated: string;
}

// Chart data types
export interface ChartDataPoint {
  x: Date | string | number;
  y: number;
  [key: string]: any;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'area' | 'column' | 'candlestick';
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'stock_update' | 'subscribed' | 'unsubscribed';
  symbol?: string;
  data?: any;
  message?: string;
}