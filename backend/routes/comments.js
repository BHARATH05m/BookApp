const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Book = require('../models/Book');
const { authenticateToken: auth } = require('../middleware/auth');

// Get all comments for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ 
      bookId, 
      isDeleted: false 
    })
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      bookId, 
      isDeleted: false 
    });

    res.json({
      success: true,
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Error fetching comments' });
  }
});

// Add a new comment
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if user already commented on this book
    const existingComment = await Comment.findOne({ 
      bookId, 
      userId, 
      isDeleted: false 
    });

    if (existingComment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this book' 
      });
    }

    const newComment = new Comment({
      bookId,
      userId,
      userName: req.user.username,
      rating,
      comment
    });

    await newComment.save();

    // Update book's average rating
    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

// Update a comment (only by the author)
router.put('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const existingComment = await Comment.findOne({ 
      _id: commentId, 
      userId, 
      isDeleted: false 
    });

    if (!existingComment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found or you are not authorized to edit it' 
      });
    }

    existingComment.rating = rating;
    existingComment.comment = comment;
    await existingComment.save();

    // Update book's average rating
    await updateBookRating(existingComment.bookId);

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: existingComment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, message: 'Error updating comment' });
  }
});

// Delete a comment (by author or admin)
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found' 
      });
    }

    // Check if user is authorized to delete
    if (!isAdmin && comment.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to delete this comment' 
      });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedBy = userId;
    comment.deletedAt = new Date();
    await comment.save();

    // Update book's average rating
    await updateBookRating(comment.bookId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Error deleting comment' });
  }
});

// Report a comment
router.post('/:commentId/report', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reportReason, reportDescription } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findOne({ 
      _id: commentId, 
      isDeleted: false 
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found' 
      });
    }

    // Check if user already reported this comment
    if (comment.reportedBy && comment.reportedBy.toString() === userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reported this comment' 
      });
    }

    comment.isReported = true;
    comment.reportReason = reportReason;
    comment.reportDescription = reportDescription;
    comment.reportedBy = userId;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment reported successfully'
    });
  } catch (error) {
    console.error('Error reporting comment:', error);
    res.status(500).json({ success: false, message: 'Error reporting comment' });
  }
});

// Get reported comments (admin only)
router.get('/admin/reported', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const reportedComments = await Comment.find({ 
      isReported: true, 
      isDeleted: false 
    })
    .populate('userId', 'username email')
    .populate('reportedBy', 'username email')
    .populate('bookId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      isReported: true, 
      isDeleted: false 
    });

    res.json({
      success: true,
      comments: reportedComments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching reported comments:', error);
    res.status(500).json({ success: false, message: 'Error fetching reported comments' });
  }
});

// Dismiss report (admin only)
router.post('/:commentId/dismiss-report', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found' 
      });
    }

    comment.isReported = false;
    comment.reportReason = null;
    comment.reportDescription = null;
    comment.reportedBy = null;
    await comment.save();

    res.json({
      success: true,
      message: 'Report dismissed successfully'
    });
  } catch (error) {
    console.error('Error dismissing report:', error);
    res.status(500).json({ success: false, message: 'Error dismissing report' });
  }
});

// Helper function to update book's average rating
async function updateBookRating(bookId) {
  try {
    const comments = await Comment.find({ 
      bookId, 
      isDeleted: false 
    });
    
    if (comments.length > 0) {
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
      const averageRating = totalRating / comments.length;
      
      await Book.findByIdAndUpdate(bookId, { 
        rating: Math.round(averageRating * 10) / 10 
      });
    }
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
}

module.exports = router;
