import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
} from '@mui/material';
import { Construction, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Analytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 Advanced Analytics
      </Typography>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Advanced Analytics Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We're building powerful analytics tools including:
          </Typography>
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto', mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • 📈 Advanced charting with technical indicators
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • 🔮 AI-powered stock predictions
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • 📊 Portfolio performance analysis
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • 🎯 Risk assessment tools
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • 📉 Correlation analysis
            </Typography>
            <Typography variant="body2">
              • 🧠 Sentiment analysis dashboard
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<TrendingUp />}
            onClick={() => navigate('/market')}
          >
            Explore Market Data
          </Button>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          💡 <strong>Pro Tip:</strong> You can view basic analytics for individual stocks by clicking on any stock in the market explorer or your watchlist.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Analytics;