const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // Reporting
    isReported: {
      type: Boolean,
      default: false,
      index: true
    },
    reportReason: {
      type: String,
      enum: ['spam', 'inappropriate', 'offensive', 'irrelevant', 'other', null],
      default: null
    },
    reportDescription: {
      type: String,
      default: ''
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    versionKey: false
  }
);

// Prevent multiple reviews by the same user on the same Google Book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ bookId: 1, isDeleted: 1 });

module.exports = mongoose.model('Review', reviewSchema);


