import React, { useState, useEffect } from 'react';
import { getGoogleVolumeById } from '../services/googleBooksService';
import api from '../services/api';
import './TopSellingBooks.css';

const TopSellingBooks = () => {
  const [topSellingBooks, setTopSellingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopSellingBooks();
  }, []);

  const fetchTopSellingBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/top-selling');
      
      if (response.data.books && response.data.books.length > 0) {
        // Fetch book covers from Google Books API
        const booksWithCovers = await Promise.all(
          response.data.books.map(async (book) => {
            try {
              const googleBook = await getGoogleVolumeById(book.bookId);
              return {
                ...book,
                imageUrl: googleBook?.imageUrl || ''
              };
            } catch (error) {
              console.warn(`Could not fetch cover for book ${book.bookId}:`, error);
              return {
                ...book,
                imageUrl: ''
              };
            }
          })
        );
        setTopSellingBooks(booksWithCovers);
      } else {
        setTopSellingBooks([]);
      }
    } catch (error) {
      console.error('Error fetching top-selling books:', error);
      setError('Failed to load top-selling books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-selling-container">
        <h2>Top Selling Books This Month</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-selling-container">
        <h2>Top Selling Books This Month</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (topSellingBooks.length === 0) {
    return (
      <div className="top-selling-container">
        <h2>Top Selling Books This Month</h2>
        <div className="no-books">No books sold this month</div>
      </div>
    );
  }

  return (
    <div className="top-selling-container">
      <h2>Top Selling Books This Month</h2>
      <div className="books-grid">
        {topSellingBooks.map((book, index) => (
          <div key={book.bookId} className="book-card">
            <div className="book-rank">#{index + 1}</div>
            <div className="book-cover">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="sales-info">
                <span className="total-sold">{book.totalSold} sold</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingBooks;
