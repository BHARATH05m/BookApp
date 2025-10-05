const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Get top-selling books for current month
router.get('/top-selling', async (req, res) => {
  try {
    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Aggregate purchases by bookId for current month
    const topSellingBooks = await Purchase.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: '$bookId',
          title: { $first: '$title' },
          author: { $first: '$author' },
          totalSold: { $sum: '$quantity' }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 5 // Get top 5 books
      },
      {
        $project: {
          bookId: '$_id',
          title: 1,
          author: 1,
          totalSold: 1,
          _id: 0
        }
      }
    ]);

    if (topSellingBooks.length === 0) {
      return res.json({
        message: 'No books sold this month',
        books: []
      });
    }

    res.json({
      message: 'Top-selling books retrieved successfully',
      books: topSellingBooks
    });
  } catch (error) {
    console.error('Error fetching top-selling books:', error);
    res.status(500).json({ message: 'Error fetching top-selling books' });
  }
});

module.exports = router;
