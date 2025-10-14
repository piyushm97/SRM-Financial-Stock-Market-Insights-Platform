const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  watchlist: [{
    symbol: String,
    addedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    theme: { type: String, default: 'light', enum: ['light', 'dark'] },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    notifications: {
      priceAlerts: { type: Boolean, default: true },
      newsUpdates: { type: Boolean, default: true },
      predictionUpdates: { type: Boolean, default: true }
    }
  },
  subscription: {
    plan: { type: String, default: 'free', enum: ['free', 'premium', 'enterprise'] },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);