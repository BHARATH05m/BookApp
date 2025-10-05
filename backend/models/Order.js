const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi', 'card', 'wallet'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  transactionId: {
    type: String,
    default: ''
  },
  upiTransactionId: {
    type: String,
    default: ''
  },
  paymentDetails: {
    upiId: String,
    paymentGateway: String,
    gatewayTransactionId: String,
    paymentTime: Date
  },
  address: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
