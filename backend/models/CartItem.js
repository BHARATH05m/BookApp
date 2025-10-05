const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    // Google Books volumeId
    bookId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      default: ''
    },
    purchased: {
      type: Boolean,
      default: false,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// One cart line per user per Google Book
cartItemSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);


