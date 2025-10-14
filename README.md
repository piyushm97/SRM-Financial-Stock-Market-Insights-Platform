# 📊 SRM Financial - Stock Market Analysis Platform

SRM Financial is a comprehensive full-stack web platform designed to provide real-time stock market analytics, insights, and AI-powered predictions. Built with modern technologies and designed for both individual investors and financial professionals.

## 🚀 Key Features

### 📊 Live Stock Data Integration
- **Real-time market data** from Alpha Vantage and Yahoo Finance APIs
- **Dynamic price updates** with WebSocket connections
- **Historical data analysis** with multiple timeframes
- **Market overview** with indices, gainers, and losers

### 💡 Interactive Dashboard
- **Modern Material-UI design** with responsive layout
- **Personalized watchlists** for tracking favorite stocks
- **Real-time price charts** with technical indicators
- **Market sentiment visualization**

### 🧠 Predictive Analytics (Beta)
- **AI-powered stock predictions** using historical data
- **Technical analysis** with RSI, MACD, moving averages
- **Support and resistance level detection**
- **Volatility analysis** and risk assessment
- **Correlation analysis** between stocks

### ⚙️ Full-Stack Architecture
- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: WebSocket connections for live updates
- **Authentication**: JWT-based secure authentication
- **APIs**: RESTful API design with comprehensive endpoints

### 👥 User Research & Feedback Loop
- **Survey system** with A/B testing capabilities
- **User feedback collection** and analytics
- **Engagement tracking** and user behavior analysis
- **Admin dashboard** for managing user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for client-side routing
- **Recharts** for data visualization
- **Axios** for API communication
- **Socket.io Client** for real-time updates

### Backend
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **WebSocket** for real-time communication
- **Node-cron** for scheduled tasks
- **Helmet** for security headers
- **Rate limiting** for API protection

### APIs & Services
- **Alpha Vantage API** for stock data
- **Yahoo Finance API** for market information
- **Sentiment analysis** for market insights
- **Technical indicators** calculation

### DevOps & Deployment
- **Docker** containerization
- **Docker Compose** for multi-service deployment
- **Nginx** for frontend serving
- **Health checks** and monitoring
- **Environment configuration**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7+
- Docker and Docker Compose (optional)
- Alpha Vantage API key (free at https://www.alphavantage.co/support/#api-key)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-market-analysis-platform
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Alpha Vantage API key
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Manual Installation

1. **Clone and setup backend**
   ```bash
   git clone <repository-url>
   cd stock-market-analysis-platform/backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Setup frontend** (in a new terminal)
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env if needed
   npm start
   ```

3. **Setup MongoDB**
   - Install and start MongoDB
   - The application will create necessary collections automatically

## 📱 Usage Guide

### For Individual Investors
1. **Sign up** for a free account
2. **Browse stocks** in the Market Explorer
3. **Add stocks** to your watchlist
4. **View detailed analysis** with charts and predictions
5. **Track performance** on your personalized dashboard

### For Premium Users
- **Advanced analytics** with technical indicators
- **AI predictions** with confidence scores
- **Real-time data refresh**
- **Correlation analysis** between stocks
- **Priority support**

### For Developers
- **RESTful API** with comprehensive endpoints
- **WebSocket** for real-time data
- **Authentication** with JWT tokens
- **Rate limiting** and security features
- **Comprehensive documentation**

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Stock Data Endpoints
```
GET  /api/stocks/trending           # Get trending stocks
GET  /api/stocks/search?q={query}   # Search stocks
GET  /api/stocks/{symbol}           # Get stock details
GET  /api/stocks/{symbol}/history   # Get historical data
GET  /api/stocks/market/overview    # Get market overview
```

### Analytics Endpoints
```
GET  /api/analytics/predictions/{symbol}     # Get predictions
GET  /api/analytics/technical/{symbol}       # Get technical indicators
GET  /api/analytics/sentiment/{symbol}       # Get sentiment analysis
GET  /api/analytics/volatility/{symbol}      # Get volatility data
```

### Watchlist Endpoints
```
POST   /api/stocks/{symbol}/watchlist    # Add to watchlist
DELETE /api/stocks/{symbol}/watchlist    # Remove from watchlist
GET    /api/stocks/user/watchlist        # Get user watchlist
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** with bcrypt
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **Helmet.js** for security headers
- **Input validation** and sanitization
- **MongoDB injection** protection

## 📊 Performance Features

- **Real-time updates** via WebSocket
- **Efficient caching** strategies
- **Database indexing** for fast queries
- **Lazy loading** for large datasets
- **Responsive design** for all devices
- **Optimized bundle** sizes

## 🧪 Testing & Quality

- **Environment separation** (development, production)
- **Error handling** and logging
- **Health checks** for monitoring
- **Code organization** with clear structure
- **TypeScript** for type safety
- **ESLint** configuration ready

## 🚀 Deployment Options

### Production Deployment
1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-secure-jwt-secret
   ALPHA_VANTAGE_API_KEY=your-api-key
   ```

2. **Build and Deploy**
   ```bash
   # Build frontend
   cd frontend && npm run build
   
   # Start backend in production
   cd ../backend && npm start
   ```

### Cloud Deployment
- **AWS**: Deploy using ECS, RDS, and CloudFront
- **Google Cloud**: Use Cloud Run, Cloud SQL, and Cloud CDN
- **Azure**: Deploy with Container Instances and Cosmos DB
- **Heroku**: Simple deployment with MongoDB Atlas

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check our API documentation
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our Discord community
- **Email**: support@srmfinancial.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Charting** with TradingView integration
- [ ] **Portfolio Management** with performance tracking
- [ ] **News Integration** with sentiment analysis
- [ ] **Social Features** with community insights
- [ ] **Options Trading** analysis
- [ ] **Cryptocurrency** support
- [ ] **Machine Learning** model improvements

### Recent Updates
- [x] **Real-time WebSocket** connections
- [x] **Technical Indicators** implementation
- [x] **User Feedback System** with surveys
- [x] **Responsive Design** improvements
- [x] **Docker Deployment** setup

---

**Built with ❤️ by the SRM Financial Team**

*Empowering investors with data-driven insights and AI-powered predictions.*
