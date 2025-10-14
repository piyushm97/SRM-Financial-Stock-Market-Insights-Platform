import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Add,
  ShowChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStockData } from '../contexts/StockDataContext';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist, refreshWatchlist } = useStockData();

  useEffect(() => {
    refreshWatchlist();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'success.main' : 'error.main';
    
    return (
      <Box display="flex" alignItems="center" color={color}>
        {isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {formatPrice(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)
        </Typography>
      </Box>
    );
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      await removeFromWatchlist(symbol);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          📋 My Watchlist
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/market')}
        >
          Add Stocks
        </Button>
      </Box>

      {watchlist.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ShowChart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your Watchlist is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start building your watchlist by adding stocks you want to track.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/market')}
            >
              Browse Stocks
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tracking {watchlist.length} stocks
            </Typography>
            <List>
              {watchlist.map((stock: any) => (
                <ListItem
                  key={stock.symbol}
                  button
                  onClick={() => handleStockClick(stock.symbol)}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {stock.symbol}
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1 }}>
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
                    secondary={
                      <Box mt={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {stock.currentPrice ? formatPrice(stock.currentPrice) : 'N/A'}
                        </Typography>
                        {stock.change !== undefined && stock.changePercent !== undefined && (
                          <Box mt={0.5}>
                            {formatChange(stock.change, stock.changePercent)}
                          </Box>
                        )}
                        {stock.addedAt && (
                          <Typography variant="caption" color="text.secondary">
                            Added {new Date(stock.addedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWatchlist(stock.symbol);
                      }}
                      color="error"
                    >
                      <Remove />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          💡 <strong>Tip:</strong> Click on any stock to view detailed analysis, charts, and predictions.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Watchlist;