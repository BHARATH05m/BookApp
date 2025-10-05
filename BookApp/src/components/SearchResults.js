import React, { useState, useEffect } from 'react';
import { googleBooksService } from '../services/googleBooksService';
import BookCard from './BookCard';
import './SearchResults.css';

const SearchResults = ({ searchQuery }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Always fetch from Google Books API with more results
        const gb = await googleBooksService.search(searchQuery, 40);
        setSearchResults(gb);
      } catch (error) {
        console.error('Error searching Google Books:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Searching...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="search-results-header">
        <h1>Search Results</h1>
        <p>
          {searchResults.length === 0 
            ? `No books found for "${searchQuery}"`
            : `Found ${searchResults.length} book${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
          }
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="search-results-grid">
          {searchResults.map((book) => (
            <BookCard key={book.id || book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h2>No books found</h2>
          <p>Try searching with different keywords or browse our categories instead.</p>
          <div className="suggestions">
            <h3>Popular searches:</h3>
            <ul>
              <li>Science Fiction</li>
              <li>Mystery</li>
              <li>Self Help</li>
              <li>Technology</li>
              <li>Romance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
