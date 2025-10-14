# SRM Financial - Stock Market Analysis Platform

A comprehensive full-stack web application for real-time stock market analysis, predictions, and user engagement. Built with modern technologies and designed for both individual investors and financial professionals.

## 🚀 Key Features

### 📊 Live Stock Data Integration
- **Alpha Vantage API** - Real-time stock quotes and historical data
- **Yahoo Finance API** - Additional market data and company information
- **Dynamic Updates** - Live price feeds and market movements
- **Multi-source Data** - Redundant data sources for reliability

### 💡 Interactive Dashboard
- **Real-time Visualization** - Live charts and price movements
- **Market Overview** - Sector performance and market trends
- **Customizable Watchlist** - Track favorite stocks
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🧠 Predictive Analytics (Beta)
- **AI-Powered Predictions** - Machine learning models for price forecasting
- **Multiple Algorithms** - LSTM, ARIMA, Linear Regression, Random Forest, Ensemble
- **Confidence Scoring** - Prediction accuracy and reliability metrics
- **Time Horizons** - Short-term (7 days), medium-term (30 days), long-term (90 days)

### ⚙️ Full-Stack Architecture
- **Frontend** - React 18 with TypeScript and Material-UI
- **Backend** - Node.js with Express.js and comprehensive API
- **Database** - MongoDB with optimized schemas and indexing
- **Authentication** - JWT-based secure user management

### 👥 User Research & Feedback Loop
- **Survey System** - User experience and feature feedback
- **A/B Testing** - Feature experimentation and optimization
- **Analytics Dashboard** - User behavior and engagement metrics
- **Feedback Management** - Categorized feedback and response system

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional component library
- **Recharts** - Interactive data visualization
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### APIs & Integrations
- **Alpha Vantage** - Stock market data
- **Yahoo Finance** - Additional market data
- **Custom ML Models** - Predictive analytics

## 📁 Project Structure

```
srm-financial-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
├── database/               # Database scripts and configs
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd srm-financial-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/srm-financial
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Stock Data
- `GET /api/stocks/:symbol` - Get stock data by symbol
- `POST /api/stocks/batch` - Get multiple stocks
- `GET /api/stocks/search/:query` - Search stocks
- `GET /api/stocks/:symbol/history` - Get price history
- `GET /api/stocks/market/overview` - Market overview

### Analytics
- `GET /api/analytics/technical/:symbol` - Technical analysis
- `GET /api/analytics/sentiment/:symbol` - Sentiment analysis
- `GET /api/analytics/trends` - Market trends
- `GET /api/analytics/portfolio` - Portfolio analytics

### Predictions
- `GET /api/predictions/:symbol` - Get predictions for stock
- `POST /api/predictions/generate` - Generate new prediction
- `GET /api/predictions/watchlist/all` - Watchlist predictions
- `GET /api/predictions/stats/:symbol` - Prediction statistics

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/my` - Get user feedback
- `GET /api/feedback/all` - Get all feedback (admin)
- `PUT /api/feedback/:id/status` - Update feedback status

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/srm-financial
DB_NAME=srm-financial

# API Keys
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### Integration Testing
```bash
npm run test:integration
```

## 📈 Performance Optimization

- **Database Indexing** - Optimized MongoDB queries
- **Caching** - Redis for frequently accessed data
- **CDN** - Static asset delivery
- **Code Splitting** - Lazy loading for React components
- **Image Optimization** - Compressed and responsive images

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **Helmet.js** - Security headers

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Setup
1. Set production environment variables
2. Configure MongoDB Atlas or production database
3. Set up API keys for external services
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Alpha Vantage for stock market data API
- Yahoo Finance for additional market data
- Material-UI team for the component library
- React team for the amazing framework
- MongoDB team for the database solution

## 📞 Support

For support, email support@srmfinancial.com or create an issue in the repository.

---

**SRM Financial** - Empowering investors with data-driven insights and AI-powered predictions.