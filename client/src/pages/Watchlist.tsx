import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
  Alert,
  LinearProgress,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStock } from '../contexts/StockContext';

const Watchlist: React.FC = () => {
  const {
    stocks,
    watchlist,
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

  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Watchlist
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track your favorite stocks and monitor their performance
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
                Add Stocks to Watchlist
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
                                <StarIcon />
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

        {/* Watchlist Stocks */}
        {watchlistStocks.length > 0 ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Your Watchlist ({watchlistStocks.length} stocks)
              </Typography>
            </Grid>
            {watchlistStocks.map((stock) => (
              <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    transition: 'box-shadow 0.3s',
                  }}
                  onClick={() => handleStockSelect(stock)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {stock.symbol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {stock.name}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWatchlistToggle(stock.symbol);
                        }}
                        color="primary"
                      >
                        <StarIcon />
                      </IconButton>
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="h5" fontWeight="bold">
                        {formatPrice(stock.currentPrice)}
                      </Typography>
                      {formatChange(stock.change, stock.changePercent)}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          High
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" color="success.main">
                          {formatPrice(stock.high)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Low
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" color="error.main">
                          {formatPrice(stock.low)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Volume
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {stock.volume?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    {stock.sector && (
                      <Box mt={1}>
                        <Chip
                          label={stock.sector}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        ) : (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Your watchlist is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Search for stocks above and add them to your watchlist to track their performance
                </Typography>
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

                <Grid container spacing={2} mb={3}>
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
                  <Box>
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

export default Watchlist;