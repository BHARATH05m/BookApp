const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const commentRoutes = require('./routes/comments');
const reviewRoutes = require('./routes/reviews');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const purchaseRoutes = require('./routes/purchases');

const app = express();

// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/purchases', purchaseRoutes);

// Health + root
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.json({ message: 'Welcome to BookApp API' }));

// Debug: log available routes
console.log('Registered routes: /api/auth /api/books /api/comments /api/reviews /api/cart /api/orders /api/payments /api/reports /api/purchases');

let PORT = parseInt(process.env.PORT, 10) || 5000;

// Function to find an available port
const findAvailablePort = (startPort, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryPort = () => {
      if (attempts >= maxAttempts) {
        return reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
      }

      const testServer = require('net').createServer();
      
      testServer.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
          currentPort++;
          attempts++;
          tryPort();
        } else {
          reject(err);
        }
      });

      testServer.once('listening', () => {
        testServer.close();
        resolve(currentPort);
      });

      testServer.listen(currentPort);
    };

    tryPort();
  });
};

// Global error handlers (moved before server start)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Ensure MONGODB_URI is present
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in config.env');
  process.exit(1);
}
const maskedUri = process.env.MONGODB_URI.replace(/:\/\/.*@/, '://****@');
console.log('MongoDB URI (masked):', maskedUri);

// Connect to Mongo and start server only on success
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Find available port
  try {
    const availablePort = await findAvailablePort(PORT);
    if (availablePort !== PORT) {
      console.log(`⚠️  Port ${PORT} was busy. Using port ${availablePort} instead.`);
      PORT = availablePort;
    }
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🔗 API available at: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
    
  } catch (err) {
    console.error('Error finding available port:', err);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
