import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

const Analytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Advanced market analysis and technical indicators
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced analytics features coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;