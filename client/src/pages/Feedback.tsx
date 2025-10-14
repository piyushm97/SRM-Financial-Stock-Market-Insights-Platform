import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Feedback as FeedbackIcon } from '@mui/icons-material';

const Feedback: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Share your feedback and help us improve the platform
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <FeedbackIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Feedback System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User feedback and surveys coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Feedback;