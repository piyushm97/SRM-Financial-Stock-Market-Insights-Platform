// MongoDB initialization script
db = db.getSiblingDB('stock-market-analysis');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'firstName', 'lastName'],
      properties: {
        username: { bsonType: 'string', minLength: 3, maxLength: 30 },
        email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        password: { bsonType: 'string', minLength: 6 },
        firstName: { bsonType: 'string', minLength: 1 },
        lastName: { bsonType: 'string', minLength: 1 },
        role: { enum: ['user', 'admin', 'premium'] },
        isActive: { bsonType: 'bool' }
      }
    }
  }
});

db.createCollection('stocks');
db.createCollection('stockhistories');
db.createCollection('predictions');
db.createCollection('feedbacks');
db.createCollection('surveys');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

db.stocks.createIndex({ symbol: 1 }, { unique: true });
db.stocks.createIndex({ sector: 1 });
db.stocks.createIndex({ marketCap: -1 });

db.stockhistories.createIndex({ symbol: 1, date: -1 });
db.stockhistories.createIndex({ date: -1 });

db.predictions.createIndex({ symbol: 1, predictionDate: -1 });
db.predictions.createIndex({ targetDate: 1, status: 1 });

db.feedbacks.createIndex({ userId: 1, createdAt: -1 });
db.feedbacks.createIndex({ type: 1, status: 1 });

print('Database initialized successfully!');