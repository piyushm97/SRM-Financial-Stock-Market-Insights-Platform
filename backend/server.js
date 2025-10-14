const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Import routes
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const feedbackRoutes = require('./routes/feedback');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// WebSocket connection for real-time updates
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Handle different message types
      switch (data.type) {
        case 'subscribe':
          ws.symbol = data.symbol;
          ws.send(JSON.stringify({ 
            type: 'subscribed', 
            symbol: data.symbol,
            message: `Subscribed to ${data.symbol} updates`
          }));
          break;
        case 'unsubscribe':
          ws.symbol = null;
          ws.send(JSON.stringify({ 
            type: 'unsubscribed',
            message: 'Unsubscribed from updates'
          }));
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Broadcast stock updates to connected clients
const broadcastStockUpdate = (symbol, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.symbol === symbol) {
      client.send(JSON.stringify({
        type: 'stock_update',
        symbol,
        data
      }));
    }
  });
};

// Make broadcast function available globally
global.broadcastStockUpdate = broadcastStockUpdate;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Initialize platform
  const startupService = require('./utils/startup');
  await startupService.initialize();
  
  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;