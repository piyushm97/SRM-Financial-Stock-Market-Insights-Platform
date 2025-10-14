import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStock } from '../contexts/StockContext';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    stocks,
    watchlist,
    predictions,
    loading,
    error,
    fetchStock,
    searchStocks,
    getPriceHistory,
    addToWatchlist,
    removeFromWatchlist,
    clearError,
  } = useStock();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [marketOverview, setMarketOverview] = useState<any>(null);

  useEffect(() => {
    fetchMarketOverview();
  }, []);

  const fetchMarketOverview = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/stocks/market/overview`);
      const data = await response.json();
      setMarketOverview(data);
    } catch (error) {
      console.error('Failed to fetch market overview:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      clearError();
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleStockSelect = async (stock: any) => {
    try {
      const stockData = await fetchStock(stock.symbol);
      setSelectedStock(stockData);
      
      const history = await getPriceHistory(stock.symbol);
      setPriceHistory(history);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    }
  };

  const handleWatchlistToggle = async (symbol: string) => {
    try {
      if (watchlist.includes(symbol)) {
        await removeFromWatchlist(symbol);
      } else {
        await addToWatchlist(symbol);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        {isPositive ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
        <Typography
          variant="body2"
          color={isPositive ? 'success.main' : 'error.main'}
          fontWeight="medium"
        >
          {formatPrice(change)} ({changePercent.toFixed(2)}%)
        </Typography>
      </Box>
    );
  };

  const sectorData = marketOverview?.topStocks?.reduce((acc: any, stock: any) => {
    const sector = stock.sector || 'Unknown';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(sectorData).map(([sector, count]) => ({
    name: sector,
    value: count,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's your market overview and latest insights
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Search Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Stocks
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  fullWidth
                  placeholder="Search by symbol or company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
              </Box>
              
              {searchResults.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Search Results:
                  </Typography>
                  <Grid container spacing={1}>
                    {searchResults.map((stock) => (
                      <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={() => handleStockSelect(stock)}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {stock.symbol}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {stock.name}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWatchlistToggle(stock.symbol);
                              }}
                            >
                              {watchlist.includes(stock.symbol) ? (
                                <StarIcon color="primary" />
                              ) : (
                                <StarBorderIcon />
                              )}
                            </IconButton>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Market Overview */}
        {marketOverview && (
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Stocks
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {marketOverview.totalStocks}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Avg Change
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={marketOverview.averageChange >= 0 ? 'success.main' : 'error.main'}
                    >
                      {marketOverview.averageChange.toFixed(2)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Sector Distribution */}
        {pieData.length > 0 && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sector Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Selected Stock Details */}
        {selectedStock && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedStock.symbol}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedStock.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h4" fontWeight="bold">
                      {formatPrice(selectedStock.currentPrice)}
                    </Typography>
                    {formatChange(selectedStock.change, selectedStock.changePercent)}
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="h6">
                      {formatPrice(selectedStock.open)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      High
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatPrice(selectedStock.high)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Low
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {formatPrice(selectedStock.low)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Volume
                    </Typography>
                    <Typography variant="h6">
                      {selectedStock.volume?.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                {priceHistory.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      Price History (30 Days)
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any) => [formatPrice(value), 'Price']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke="#1976d2"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Watchlist
                </Typography>
                <Grid container spacing={2}>
                  {watchlist.map((symbol) => {
                    const stock = stocks.find(s => s.symbol === symbol);
                    if (!stock) return null;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={symbol}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={() => handleStockSelect(stock)}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {stock.symbol}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {stock.name}
                              </Typography>
                              <Typography variant="h6">
                                {formatPrice(stock.currentPrice)}
                              </Typography>
                              {formatChange(stock.change, stock.changePercent)}
                            </Box>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWatchlistToggle(symbol);
                              }}
                            >
                              <StarIcon color="primary" />
                            </IconButton>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Loading State */}
        {loading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <LinearProgress sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Loading data...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;