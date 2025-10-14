import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

const Predictions: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Predictions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-powered stock price predictions and forecasting
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUpIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Predictive Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered predictions coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Predictions;