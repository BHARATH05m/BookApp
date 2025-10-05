const express = require('express');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews/:bookId → add a review for a Google Book
router.post('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params; // Google Books volumeId
    const { rating, comment = '' } = req.body;

    if (!rating) {
      return res.status(400).json({ message: 'rating is required' });
    }

    const review = await Review.findOneAndUpdate(
      { bookId, userId: req.user._id },
      {
        $set: {
          rating,
          comment: comment || ''
        },
        $setOnInsert: {
          bookId,
          userId: req.user._id,
          createdAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Review saved', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate review' });
    }
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Error saving review' });
  }
});

// GET /api/reviews/:bookId → fetch all reviews for that book
router.get('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params; // Google Books volumeId
    const reviews = await Review.find({ bookId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// PUT /api/reviews/:bookId → update the current user's review
router.put('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment = '' } = req.body;
    const review = await Review.findOne({ bookId, userId: req.user._id, isDeleted: false });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();
    res.json({ message: 'Review updated', review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

// DELETE /api/reviews/:bookId → soft delete the current user's review
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const review = await Review.findOne({ bookId, userId: req.user._id, isDeleted: false });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.isDeleted = true;
    review.deletedAt = new Date();
    review.deletedBy = req.user._id;
    await review.save();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// POST /api/reviews/:reviewId/report → report someone else's review
router.post('/:reviewId/report', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reportReason, reportDescription } = req.body;
    const review = await Review.findOne({ _id: reviewId, isDeleted: false });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot report your own review' });
    }
    review.isReported = true;
    review.reportReason = reportReason || 'other';
    review.reportDescription = reportDescription || '';
    review.reportedBy = req.user._id;
    await review.save();
    res.json({ message: 'Review reported' });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({ message: 'Error reporting review' });
  }
});

// GET /api/reviews/admin/reported → list reported reviews (admin)
router.get('/admin/reported', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Review.find({ isReported: true, isDeleted: false })
        .populate('userId', 'username email')
        .populate('reportedBy', 'username email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ isReported: true, isDeleted: false })
    ]);
    res.json({ success: true, reviews: items, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Admin reported reviews error:', error);
    res.status(500).json({ message: 'Error fetching reported reviews' });
  }
});

// POST /api/reviews/:reviewId/dismiss-report (admin)
router.post('/:reviewId/dismiss-report', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.isReported = false;
    review.reportReason = null;
    review.reportDescription = '';
    review.reportedBy = null;
    await review.save();
    res.json({ success: true, message: 'Report dismissed', review });
  } catch (error) {
    console.error('Dismiss review report error:', error);
    res.status(500).json({ message: 'Error dismissing review report' });
  }
});

// DELETE /api/reviews/admin/:reviewId (admin) → hard delete a review
router.delete('/admin/:reviewId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { reviewId } = req.params;
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;


