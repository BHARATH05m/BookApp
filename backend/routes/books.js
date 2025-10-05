const express = require('express');
const Book = require('../models/Book');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all books (public access)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'title', order = 'asc' } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const books = await Book.find(query)
      .sort(sortOptions)
      .populate('addedBy', 'username');
    
    res.json({
      success: true,
      count: books.length,
      books
    });
    
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get book by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'username');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({
      success: true,
      book
    });
    
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

// Add new book (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      imageUrl,
      buyingLink,
      publishedYear,
      rating
    } = req.body;
    
    const book = new Book({
      title,
      author,
      description,
      category,
      imageUrl,
      buyingLink,
      publishedYear,
      rating,
      addedBy: req.user._id
    });
    
    await book.save();
    
    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'username');
    
    res.status(201).json({
      message: 'Book added successfully',
      book: populatedBook
    });
    
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      imageUrl,
      buyingLink,
      publishedYear,
      rating
    } = req.body;
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (category) book.category = category;
    if (imageUrl !== undefined) book.imageUrl = imageUrl;
    if (buyingLink !== undefined) book.buyingLink = buyingLink;
    if (publishedYear) book.publishedYear = publishedYear;
    if (rating !== undefined) book.rating = rating;
    
    await book.save();
    
    const updatedBook = await Book.findById(book._id)
      .populate('addedBy', 'username');
    
    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
    
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Book deleted successfully' });
    
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

// Get books by category (public access)
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category })
      .populate('addedBy', 'username');
    
    res.json({
      success: true,
      category: req.params.category,
      count: books.length,
      books
    });
    
  } catch (error) {
    console.error('Get books by category error:', error);
    res.status(500).json({ message: 'Error fetching books by category' });
  }
});

// Get all categories (public access)
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    
    res.json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
