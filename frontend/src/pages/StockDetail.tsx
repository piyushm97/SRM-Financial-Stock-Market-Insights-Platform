import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Remove,
  ArrowBack,
  Refresh,
  Psychology,
  ShowChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useStockData } from '../contexts/StockDataContext';
import { Stock, StockHistory, TechnicalIndicators, Prediction } from '../types';
import apiService from '../services/api';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { watchlist, addToWatchlist, removeFromWatchlist, subscribeToStock, unsubscribeFromStock } = useStockData();
  
  const [stock, setStock] = useState<Stock | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('1y');

  useEffect(() => {
    if (symbol) {
      loadStockData(symbol.toUpperCase());
      subscribeToStock(symbol.toUpperCase());
    }

    return () => {
      if (symbol) {
        unsubscribeFromStock(symbol.toUpperCase());
      }
    };
  }, [symbol]);

  const loadStockData = async (stockSymbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        stockResponse,
        historyResponse,
        technicalResponse,
        predictionsResponse,
        sentimentResponse
      ] = await Promise.allSettled([
        apiService.getStock(stockSymbol),
        apiService.getStockHistory(stockSymbol, period),
        apiService.getTechnicalIndicators(stockSymbol),
        apiService.getPredictions(stockSymbol),
        apiService.getSentiment(stockSymbol)
      ]);

      if (stockResponse.status === 'fulfilled') {
        setStock(stockResponse.value.stock);
      } else {
        throw new Error('Failed to load stock data');
      }

      if (historyResponse.status === 'fulfilled') {
        setStockHistory(historyResponse.value.data);
      }

      if (technicalResponse.status === 'fulfilled') {
        setTechnicalIndicators(technicalResponse.value);
      }

      if (predictionsResponse.status === 'fulfilled') {
        setPredictions(predictionsResponse.value.predictions);
      }

      if (sentimentResponse.status === 'fulfilled') {
        setSentiment(sentimentResponse.value.sentiment);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const isInWatchlist = () => {
    return watchlist.some((item: any) => item.symbol === symbol?.toUpperCase());
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!symbol) return;

    try {
      if (isInWatchlist()) {
        await removeFromWatchlist(symbol.toUpperCase());
      } else {
        await addToWatchlist(symbol.toUpperCase());
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error);
    }
  };

  const chartData = stockHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.close,
    volume: item.volume
  }));

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stock) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Stock not found'}
        </Alert>
        <Button onClick={() => navigate('/market')} startIcon={<ArrowBack />}>
          Back to Market
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight="bold">
            {stock.symbol}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {stock.name}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {isAuthenticated && (
            <Button
              variant={isInWatchlist() ? 'contained' : 'outlined'}
              startIcon={isInWatchlist() ? <Remove /> : <Add />}
              onClick={handleWatchlistToggle}
            >
              {isInWatchlist() ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => symbol && loadStockData(symbol.toUpperCase())}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Price Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h3" fontWeight="bold">
                  {formatPrice(stock.currentPrice)}
                </Typography>
                <Box display="flex" alignItems="center">
                  {stock.change !== undefined && stock.changePercent !== undefined && (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      color={stock.change >= 0 ? 'success.main' : 'error.main'}
                    >
                      {stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {formatPrice(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box display="flex" gap={2} mb={3}>
                {stock.sector && <Chip label={stock.sector} />}
                {stock.exchange && <Chip label={stock.exchange} variant="outlined" />}
                {sentiment && (
                  <Chip 
                    label={`${sentiment.label} Sentiment`}
                    color={
                      sentiment.label === 'Bullish' ? 'success' : 
                      sentiment.label === 'Bearish' ? 'error' : 'default'
                    }
                    icon={<Psychology />}
                  />
                )}
              </Box>

              {/* Price Chart */}
              <Typography variant="h6" gutterBottom>
                Price Chart ({period})
              </Typography>
              <Box height={300} mb={2}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#1976d2" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              <Box display="flex" gap={1}>
                {['1d', '5d', '1m', '3m', '6m', '1y', '2y'].map((p) => (
                  <Button
                    key={p}
                    size="small"
                    variant={period === p ? 'contained' : 'outlined'}
                    onClick={() => {
                      setPeriod(p);
                      if (symbol) {
                        apiService.getStockHistory(symbol.toUpperCase(), p)
                          .then(response => setStockHistory(response.data));
                      }
                    }}
                  >
                    {p.toUpperCase()}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Previous Close" secondary={stock.previousClose ? formatPrice(stock.previousClose) : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Day Range" secondary={
                    stock.dayLow && stock.dayHigh ? 
                    `${formatPrice(stock.dayLow)} - ${formatPrice(stock.dayHigh)}` : 'N/A'
                  } />
                </ListItem>
                <ListItem>
                  <ListItemText primary="52 Week Range" secondary={
                    stock.week52Low && stock.week52High ? 
                    `${formatPrice(stock.week52Low)} - ${formatPrice(stock.week52High)}` : 'N/A'
                  } />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Volume" secondary={stock.volume?.toLocaleString() || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Market Cap" secondary={stock.marketCap ? formatMarketCap(stock.marketCap) : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="P/E Ratio" secondary={stock.pe?.toFixed(2) || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="EPS" secondary={stock.eps ? formatPrice(stock.eps) : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Beta" secondary={stock.beta?.toFixed(2) || 'N/A'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Technical Indicators */}
        {technicalIndicators && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Technical Analysis
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Trend" 
                      secondary={
                        <Chip 
                          label={technicalIndicators.trend.toUpperCase()}
                          color={
                            technicalIndicators.trend === 'bullish' ? 'success' : 
                            technicalIndicators.trend === 'bearish' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      } 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="RSI" 
                      secondary={`${technicalIndicators.rsi.toFixed(2)} ${
                        technicalIndicators.rsi > 70 ? '(Overbought)' : 
                        technicalIndicators.rsi < 30 ? '(Oversold)' : ''
                      }`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="SMA 20" 
                      secondary={formatPrice(technicalIndicators.movingAverages.sma20)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="SMA 50" 
                      secondary={formatPrice(technicalIndicators.movingAverages.sma50)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="MACD" 
                      secondary={technicalIndicators.macd.macd.toFixed(4)} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Predictions */}
        {predictions.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔮 AI Predictions
                </Typography>
                <List dense>
                  {predictions.slice(0, 3).map((prediction, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${prediction.timeframe.toUpperCase()} Prediction`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Target: {prediction.predictedPrice ? formatPrice(prediction.predictedPrice) : 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Confidence: {(prediction.confidence * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Trend: {prediction.predictedTrend || 'N/A'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShowChart />}
                  onClick={() => navigate('/analytics')}
                  sx={{ mt: 2 }}
                >
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Company Description */}
        {stock.description && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About {stock.name}
                </Typography>
                <Typography variant="body1">
                  {stock.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StockDetail;