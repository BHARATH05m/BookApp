const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['spam', 'inappropriate', 'offensive', 'irrelevant', 'other'],
    default: null
  },
  reportDescription: {
    type: String,
    maxlength: 500
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
commentSchema.index({ bookId: 1, isDeleted: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ isReported: 1 });

module.exports = mongoose.model('Comment', commentSchema);
