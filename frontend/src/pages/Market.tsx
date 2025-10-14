import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Add,
  Remove,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStockData } from '../contexts/StockDataContext';
import { Stock } from '../types';
import apiService from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`market-tabpanel-${index}`}
      aria-labelledby={`market-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Market: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    trendingStocks, 
    marketOverview, 
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    refreshTrendingStocks,
    refreshMarketOverview 
  } = useStockData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [sectorStocks, setSectorStocks] = useState<{ [key: string]: Stock[] }>({});
  const [loadingSectors, setLoadingSectors] = useState<string[]>([]);

  const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical', 'Energy'];

  useEffect(() => {
    // Load sector data
    sectors.forEach(sector => {
      loadSectorData(sector);
    });
  }, []);

  const loadSectorData = async (sector: string) => {
    if (sectorStocks[sector]) return;
    
    setLoadingSectors(prev => [...prev, sector]);
    try {
      const { stocks } = await apiService.getStocksBySector(sector, 10);
      setSectorStocks(prev => ({ ...prev, [sector]: stocks }));
    } catch (error) {
      console.error(`Error loading ${sector} stocks:`, error);
    } finally {
      setLoadingSectors(prev => prev.filter(s => s !== sector));
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { results } = await apiService.searchStocks(query, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

  const isInWatchlist = (symbol: string) => {
    return watchlist.some((item: any) => item.symbol === symbol);
  };

  const handleWatchlistToggle = async (symbol: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist(symbol)) {
        await removeFromWatchlist(symbol);
      } else {
        await addToWatchlist(symbol);
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderStockList = (stocks: Stock[], title?: string) => (
    <Card>
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        <List>
          {stocks.map((stock: Stock) => (
            <ListItem
              key={stock.symbol}
              button
              onClick={() => handleStockClick(stock.symbol)}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
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
                secondary={
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(stock.currentPrice)}
                    </Typography>
                    {stock.change !== undefined && stock.changePercent !== undefined && (
                      <Box mt={0.5}>
                        {formatChange(stock.change, stock.changePercent)}
                      </Box>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {isAuthenticated && (
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchlistToggle(stock.symbol);
                    }}
                    color={isInWatchlist(stock.symbol) ? 'primary' : 'default'}
                  >
                    {isInWatchlist(stock.symbol) ? <Remove /> : <Add />}
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          📈 Market Explorer
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            refreshTrendingStocks();
            refreshMarketOverview();
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search stocks by symbol or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          {searchResults.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Search Results ({searchResults.length})
              </Typography>
              <List dense>
                {searchResults.map((stock: Stock) => (
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
                          {stock.exchange && (
                            <Chip 
                              label={stock.exchange} 
                              size="small" 
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={stock.currentPrice ? formatPrice(stock.currentPrice) : 'N/A'}
                    />
                    <ListItemSecondaryAction>
                      {isAuthenticated && (
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWatchlistToggle(stock.symbol);
                          }}
                          color={isInWatchlist(stock.symbol) ? 'primary' : 'default'}
                        >
                          {isInWatchlist(stock.symbol) ? <Remove /> : <Add />}
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Market Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Trending" />
          <Tab label="Top Gainers" />
          <Tab label="Top Losers" />
          <Tab label="By Sector" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderStockList(trendingStocks, '🔥 Trending Stocks')}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {marketOverview?.topGainers ? 
              renderStockList(marketOverview.topGainers, '🚀 Top Gainers') :
              <Alert severity="info">Loading top gainers...</Alert>
            }
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {marketOverview?.topLosers ? 
              renderStockList(marketOverview.topLosers, '📉 Top Losers') :
              <Alert severity="info">Loading top losers...</Alert>
            }
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Grid container spacing={3}>
          {sectors.map((sector) => (
            <Grid item xs={12} md={6} key={sector}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {sector}
                  </Typography>
                  {loadingSectors.includes(sector) ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress />
                    </Box>
                  ) : sectorStocks[sector] ? (
                    <List dense>
                      {sectorStocks[sector].slice(0, 5).map((stock: Stock) => (
                        <ListItem
                          key={stock.symbol}
                          button
                          onClick={() => handleStockClick(stock.symbol)}
                        >
                          <ListItemText
                            primary={stock.symbol}
                            secondary={stock.currentPrice ? formatPrice(stock.currentPrice) : 'N/A'}
                          />
                          <ListItemSecondaryAction>
                            {isAuthenticated && (
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWatchlistToggle(stock.symbol);
                                }}
                                color={isInWatchlist(stock.symbol) ? 'primary' : 'default'}
                              >
                                {isInWatchlist(stock.symbol) ? <Remove /> : <Add />}
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Market;