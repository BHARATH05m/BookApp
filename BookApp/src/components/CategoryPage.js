import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooksByCategory } from '../data/books';
import { googleBooksService } from '../services/googleBooksService';
import { allowedGenres } from '../constants/genres';
import BookCard from './BookCard';
import './CategoryPage.css';

const CategoryPage = () => {
  // Map UI category names to Google Books subjects
  const categoryMap = {
    'Non-Fiction': 'Nonfiction',
    'Mystery & Thriller': 'Mystery',
    'Young Adult': 'Young Adult',
    'Business & Finance': 'Business',
    'Science': 'Science',
    'Fantasy': 'Fantasy',
    'Biography': 'Biography',
    'History': 'History',
    'Self Help': 'Self-Help',
    'Technology': 'Technology',
    'Romance': 'Romance',
    'Art': 'Art',
    'Poetry': 'Poetry',
    'Drama': 'Drama',
    // Add more mappings as needed
  };
  const getGoogleCategory = (cat) => categoryMap[cat] || cat;
  const { categoryId } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const googleCat = getGoogleCategory(categoryId);
        const gb = await googleBooksService.byCategory(googleCat, 20);
        if (gb.length > 0) {
          setBooks(gb);
        } else {
          setBooks(getBooksByCategory(categoryId));
        }
        setError(null);
      } catch (err) {
  setBooks(getBooksByCategory(categoryId));
        setError('Error loading books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading books...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Error</h1>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-header" style={{ '--category-color': '#667eea' }}>
        <div className="category-info">
          <h1>{categoryId}</h1>
          <p>Explore {categoryId} books</p>
          <span className="book-count">{books.length} books in this category</span>
        </div>
        <div className="category-icon">{getCategoryIcon(categoryId)}</div>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <BookCard key={book.id || book._id} book={book} />
        ))}
      </div>

      <div className="category-navigation">
        <Link to="/" className="btn btn-secondary">
          ← Back to All Categories
        </Link>
      </div>
    </div>
  );
};

const getCategoryIcon = (categoryId) => {
  const icons = {
    'fiction': '📚',
    'non-fiction': '📖',
    'mystery-thriller': '🔍',
    'young-adult': '🌟',
    'business-finance': '💼',
    'technology': '💻',
    'health-wellness': '🧘',
    'travel-adventure': '✈️'
  };
  return icons[categoryId] || '📚';
};

export default CategoryPage;
