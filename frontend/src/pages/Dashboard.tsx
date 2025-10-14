import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Refresh,
  Add,
  ShowChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStockData } from '../contexts/StockDataContext';
import { Stock } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    trendingStocks, 
    marketOverview, 
    watchlist, 
    isLoading, 
    error,
    refreshTrendingStocks,
    refreshMarketOverview,
    refreshWatchlist 
  } = useStockData();

  useEffect(() => {
    if (isAuthenticated) {
      refreshWatchlist();
    }
  }, [isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const icon = isPositive ? <TrendingUp /> : <TrendingDown />;
    const color = isPositive ? 'success.main' : 'error.main';
    
    return (
      <Box display="flex" alignItems="center" color={color}>
        {icon}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {formatPrice(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)
        </Typography>
      </Box>
    );
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const handleRefresh = () => {
    refreshTrendingStocks();
    refreshMarketOverview();
    if (isAuthenticated) {
      refreshWatchlist();
    }
  };

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleRefresh} startIcon={<Refresh />}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {isAuthenticated ? `Welcome back, ${user?.firstName}!` : 'Market Dashboard'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Market Overview */}
        {marketOverview && (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📈 Market Summary
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {marketOverview.statistics.totalStocks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stocks Tracked
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Gainers
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {marketOverview.statistics.gainers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stocks Up Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📉 Losers
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {marketOverview.statistics.losers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stocks Down Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ⚖️ Unchanged
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {marketOverview.statistics.unchanged}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Flat Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Watchlist */}
        {isAuthenticated && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    📋 My Watchlist
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => navigate('/market')}
                  >
                    Add Stocks
                  </Button>
                </Box>
                
                {watchlist.length === 0 ? (
                  <Box textAlign="center" py={3}>
                    <Typography variant="body2" color="text.secondary">
                      No stocks in your watchlist yet.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/market')}
                      sx={{ mt: 1 }}
                    >
                      Browse Stocks
                    </Button>
                  </Box>
                ) : (
                  <List dense>
                    {watchlist.slice(0, 5).map((stock: any) => (
                      <ListItem
                        key={stock.symbol}
                        button
                        onClick={() => handleStockClick(stock.symbol)}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Typography variant="subtitle2" fontWeight="bold">
                                {stock.symbol}
                              </Typography>
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {stock.name}
                              </Typography>
                            </Box>
                          }
                          secondary={formatPrice(stock.currentPrice)}
                        />
                        <ListItemSecondaryAction>
                          {stock.change !== undefined && stock.changePercent !== undefined && 
                            formatChange(stock.change, stock.changePercent)
                          }
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {watchlist.length > 5 && (
                  <Box textAlign="center" mt={2}>
                    <Button
                      size="small"
                      onClick={() => navigate('/watchlist')}
                    >
                      View All ({watchlist.length})
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Trending Stocks */}
        <Grid item xs={12} md={isAuthenticated ? 6 : 12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  🔥 Trending Stocks
                </Typography>
                <Button
                  size="small"
                  startIcon={<ShowChart />}
                  onClick={() => navigate('/market')}
                >
                  View All
                </Button>
              </Box>
              
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <List dense>
                  {trendingStocks.slice(0, 8).map((stock: Stock) => (
                    <ListItem
                      key={stock.symbol}
                      button
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle2" fontWeight="bold">
                              {stock.symbol}
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {stock.name}
                            </Typography>
                            {stock.sector && (
                              <Chip 
                                label={stock.sector} 
                                size="small" 
                                sx={{ ml: 1, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={formatPrice(stock.currentPrice)}
                      />
                      <ListItemSecondaryAction>
                        {stock.change !== undefined && stock.changePercent !== undefined && 
                          formatChange(stock.change, stock.changePercent)
                        }
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Gainers */}
        {marketOverview?.topGainers && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🚀 Top Gainers
                </Typography>
                <List dense>
                  {marketOverview.topGainers.map((stock: Stock) => (
                    <ListItem
                      key={stock.symbol}
                      button
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold">
                            {stock.symbol}
                          </Typography>
                        }
                        secondary={formatPrice(stock.currentPrice)}
                      />
                      <ListItemSecondaryAction>
                        <Box color="success.main">
                          <Typography variant="body2">
                            +{stock.changePercent?.toFixed(2)}%
                          </Typography>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Top Losers */}
        {marketOverview?.topLosers && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📉 Top Losers
                </Typography>
                <List dense>
                  {marketOverview.topLosers.map((stock: Stock) => (
                    <ListItem
                      key={stock.symbol}
                      button
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold">
                            {stock.symbol}
                          </Typography>
                        }
                        secondary={formatPrice(stock.currentPrice)}
                      />
                      <ListItemSecondaryAction>
                        <Box color="error.main">
                          <Typography variant="body2">
                            {stock.changePercent?.toFixed(2)}%
                          </Typography>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShowChart />}
                    onClick={() => navigate('/market')}
                  >
                    Explore Market
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    onClick={() => navigate('/analytics')}
                  >
                    View Analytics
                  </Button>
                </Grid>
                {isAuthenticated && (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate('/watchlist')}
                      >
                        Manage Watchlist
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate('/profile')}
                      >
                        View Profile
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;