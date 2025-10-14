import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person,
  Email,
  Notifications,
  Security,
  TrendingUp,
  Schedule,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [notifications, setNotifications] = useState({
    email: user?.preferences?.notifications?.email ?? true,
    push: user?.preferences?.notifications?.push ?? true,
    priceAlerts: user?.preferences?.notifications?.priceAlerts ?? true,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      setError('');
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferences: {
          ...user?.preferences,
          notifications
        }
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setError('');
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'primary';
      case 'basic': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        👤 Profile Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email}
                    disabled
                    helperText="Email cannot be changed"
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={user?.username || ''}
                    disabled
                    helperText="Username cannot be changed"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Preferences
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Receive market updates and account notifications via email
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    />
                  }
                  label="Push Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Get real-time alerts on your device
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.priceAlerts}
                      onChange={(e) => setNotifications({ ...notifications, priceAlerts: e.target.checked })}
                    />
                  }
                  label="Price Alerts"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Receive alerts when your watchlist stocks hit price targets
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Overview
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Type"
                    secondary={
                      <Chip 
                        label={user?.role?.toUpperCase() || 'USER'}
                        color={getSubscriptionColor(user?.role || 'user')}
                        size="small"
                      />
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  <ListItemText
                    primary="Subscription"
                    secondary={
                      <Chip 
                        label={user?.subscription?.plan?.toUpperCase() || 'FREE'}
                        color={getSubscriptionColor(user?.subscription?.plan || 'free')}
                        size="small"
                      />
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Member Since"
                    secondary={formatDate(user?.createdAt)}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <TrendingUp />
                  </ListItemIcon>
                  <ListItemText
                    primary="Watchlist Size"
                    secondary={`${user?.preferences?.watchlist?.length || 0} stocks`}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Statistics
              </Typography>
              <Typography variant="body2">
                Login Count: {user?.analytics?.loginCount || 0}
              </Typography>
              <Typography variant="body2">
                Last Login: {formatDate(user?.analytics?.lastLogin)}
              </Typography>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          {user?.subscription?.plan !== 'free' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Subscription Details
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  Plan: <strong>{user.subscription.plan.toUpperCase()}</strong>
                </Typography>
                
                {user.subscription.startDate && (
                  <Typography variant="body2" gutterBottom>
                    Started: {formatDate(user.subscription.startDate)}
                  </Typography>
                )}
                
                {user.subscription.endDate && (
                  <Typography variant="body2" gutterBottom>
                    Expires: {formatDate(user.subscription.endDate)}
                  </Typography>
                )}
                
                <Typography variant="body2">
                  Status: <strong>{user.subscription.isActive ? 'Active' : 'Inactive'}</strong>
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Upgrade CTA for free users */}
          {user?.subscription?.plan === 'free' && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Star sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Upgrade to Premium
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Get access to advanced analytics, real-time data, and AI predictions.
                </Typography>
                <Button variant="contained" fullWidth>
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;