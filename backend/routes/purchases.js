const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { authenticateToken } = require('../middleware/auth');

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Purchases route is working' });
});

// Get user's purchase history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching purchase history for user:', userId);
    
    // Get all purchases for the user, sorted by date (newest first)
    const purchases = await Purchase.find({ userId })
      .sort({ date: -1 })
      .limit(50); // Limit to last 50 purchases for performance
    
    console.log('Found purchases:', purchases.length);
    
    // Group purchases by date for better organization
    const groupedPurchases = {};
    
    purchases.forEach(purchase => {
      const purchaseDate = purchase.date.toDateString();
      
      if (!groupedPurchases[purchaseDate]) {
        groupedPurchases[purchaseDate] = {
          date: purchaseDate,
          purchases: []
        };
      }
      
      groupedPurchases[purchaseDate].purchases.push({
        _id: purchase._id,
        bookId: purchase.bookId,
        title: purchase.title,
        author: purchase.author,
        price: purchase.price,
        quantity: purchase.quantity,
        date: purchase.date
      });
    });
    
    // Convert grouped object to array
    const history = Object.values(groupedPurchases);
    
    res.json({
      message: 'Purchase history retrieved successfully',
      history: history,
      totalPurchases: purchases.length
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ message: 'Error fetching purchase history' });
  }
});

// Get purchase statistics for user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching purchase stats for user:', userId);
    
    // Get total purchases count
    const totalPurchases = await Purchase.countDocuments({ userId });
    
    // Get total amount spent
    const totalSpent = await Purchase.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);
    
    // Get favorite author (most purchased)
    const favoriteAuthor = await Purchase.aggregate([
      { $match: { userId } },
      { $group: { _id: '$author', count: { $sum: '$quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    // Get purchases by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Purchase.aggregate([
      { 
        $match: { 
          userId,
          date: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: '$quantity' },
          totalSpent: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    
    res.json({
      message: 'Purchase statistics retrieved successfully',
      stats: {
        totalPurchases,
        totalSpent: totalSpent[0]?.total || 0,
        favoriteAuthor: favoriteAuthor[0]?.author || 'None',
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching purchase statistics:', error);
    res.status(500).json({ message: 'Error fetching purchase statistics' });
  }
});

module.exports = router;
