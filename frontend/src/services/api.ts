import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Stock, 
  StockHistory, 
  Prediction, 
  TechnicalIndicators, 
  Volatility, 
  SupportResistanceLevels,
  Feedback,
  Survey,
  MarketOverview,
  ApiResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ token: string; user: User }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const response = await this.api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.put('/auth/change-password', { currentPassword, newPassword });
  }

  // Stock endpoints
  async getTrendingStocks(limit?: number): Promise<{ stocks: Stock[]; timestamp: string }> {
    const response = await this.api.get('/stocks/trending', { params: { limit } });
    return response.data;
  }

  async searchStocks(query: string, limit?: number): Promise<{ results: Stock[]; count: number }> {
    const response = await this.api.get('/stocks/search', { params: { q: query, limit } });
    return response.data;
  }

  async getStock(symbol: string): Promise<{ stock: Stock; recentHistory: StockHistory[] }> {
    const response = await this.api.get(`/stocks/${symbol}`);
    return response.data;
  }

  async getStockHistory(
    symbol: string, 
    period: string = '1y', 
    interval: string = '1d'
  ): Promise<{ data: StockHistory[]; count: number }> {
    const response = await this.api.get(`/stocks/${symbol}/history`, { 
      params: { period, interval } 
    });
    return response.data;
  }

  async getMarketOverview(): Promise<MarketOverview> {
    const response = await this.api.get('/stocks/market/overview');
    return response.data;
  }

  async getStocksBySector(sector: string, limit?: number): Promise<{ stocks: Stock[]; count: number }> {
    const response = await this.api.get(`/stocks/sector/${sector}`, { params: { limit } });
    return response.data;
  }

  async addToWatchlist(symbol: string): Promise<{ watchlist: any[] }> {
    const response = await this.api.post(`/stocks/${symbol}/watchlist`);
    return response.data;
  }

  async removeFromWatchlist(symbol: string): Promise<{ watchlist: any[] }> {
    const response = await this.api.delete(`/stocks/${symbol}/watchlist`);
    return response.data;
  }

  async getWatchlist(): Promise<{ watchlist: any[] }> {
    const response = await this.api.get('/stocks/user/watchlist');
    return response.data;
  }

  async refreshStock(symbol: string): Promise<{ stock: Stock }> {
    const response = await this.api.post(`/stocks/${symbol}/refresh`);
    return response.data;
  }

  // Analytics endpoints
  async getPredictions(symbol: string, timeframe?: string): Promise<{ predictions: Prediction[] }> {
    const response = await this.api.get(`/analytics/predictions/${symbol}`, { 
      params: { timeframe } 
    });
    return response.data;
  }

  async generatePrediction(
    symbol: string, 
    timeframe: string, 
    predictionType: string
  ): Promise<{ prediction: Prediction }> {
    const response = await this.api.post(`/analytics/predictions/${symbol}`, { 
      timeframe, 
      predictionType 
    });
    return response.data;
  }

  async getTechnicalIndicators(symbol: string, period?: string): Promise<TechnicalIndicators> {
    const response = await this.api.get(`/analytics/technical/${symbol}`, { 
      params: { period } 
    });
    return response.data;
  }

  async getSentiment(symbol: string): Promise<{ sentiment: any }> {
    const response = await this.api.get(`/analytics/sentiment/${symbol}`);
    return response.data;
  }

  async getCorrelation(
    symbol: string, 
    compareWith: string[], 
    period?: string
  ): Promise<{ correlations: any[] }> {
    const response = await this.api.get(`/analytics/correlation/${symbol}`, { 
      params: { compareWith: compareWith.join(','), period } 
    });
    return response.data;
  }

  async getVolatility(symbol: string, period?: string): Promise<Volatility> {
    const response = await this.api.get(`/analytics/volatility/${symbol}`, { 
      params: { period } 
    });
    return response.data;
  }

  async getSupportResistance(symbol: string, period?: string): Promise<SupportResistanceLevels> {
    const response = await this.api.get(`/analytics/levels/${symbol}`, { 
      params: { period } 
    });
    return response.data;
  }

  async getAnalysisSummary(symbol: string): Promise<any> {
    const response = await this.api.get(`/analytics/summary/${symbol}`);
    return response.data;
  }

  // User endpoints
  async getDashboardData(): Promise<any> {
    const response = await this.api.get('/users/dashboard');
    return response.data;
  }

  async updatePreferences(preferences: any): Promise<{ preferences: any }> {
    const response = await this.api.put('/users/preferences', preferences);
    return response.data;
  }

  async getUserActivity(limit?: number, page?: number): Promise<{ activity: any[] }> {
    const response = await this.api.get('/users/activity', { params: { limit, page } });
    return response.data;
  }

  // Feedback endpoints
  async submitFeedback(feedback: Partial<Feedback>): Promise<{ feedback: Feedback }> {
    const response = await this.api.post('/feedback', feedback);
    return response.data;
  }

  async getFeedbackHistory(
    page?: number, 
    limit?: number, 
    type?: string
  ): Promise<ApiResponse<Feedback[]>> {
    const response = await this.api.get('/feedback/my-feedback', { 
      params: { page, limit, type } 
    });
    return response.data;
  }

  async getActiveSurveys(page?: string): Promise<{ surveys: Survey[] }> {
    const response = await this.api.get('/feedback/surveys/active', { params: { page } });
    return response.data;
  }

  async submitSurveyResponse(
    surveyId: string, 
    responses: any[], 
    variant?: string
  ): Promise<void> {
    await this.api.post(`/feedback/surveys/${surveyId}/responses`, { responses, variant });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export default new ApiService();