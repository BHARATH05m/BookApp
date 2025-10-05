import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../services/cartService';
import './BookCard.css';

const renderStars = (rating) => {
  const r = Number(rating) || 0;
  const filled = Math.floor(r);
  const hasHalf = r - filled >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < filled) {
      stars.push(<span key={`s${i}`} className="star filled" />);
    } else if (i === filled && hasHalf) {
      stars.push(<span key={`s${i}`} className="star half" />);
    } else {
      stars.push(<span key={`s${i}`} className="star" />);
    }
  }
  return <span className="stars">{stars}</span>;
};

const BookCard = ({ book }) => {
  // Use book.id for static data, fallback to _id for backend
  const bookId = book.id || book._id;
  const [adding, setAdding] = useState(false);

  const handleBuy = async () => {
    setAdding(true);
    try {
      const price = typeof book.price === 'number' && book.price > 0 ? book.price : 50;
      console.log('Adding to cart:', { bookId, title: book.title, imageUrl: book.imageUrl });
      await addToCart({
        bookId: bookId,
        title: book.title,
        author: book.author,
        price,
        imageUrl: book.imageUrl || ''
      });
      alert('Added to cart!');
    } catch (e) {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };
  return (
    <div className="book-card">
      <div className="book-cover">
        {book.imageUrl ? (
          <img 
            src={book.imageUrl} 
            alt={`Cover of ${book.title}`}
            className="book-cover-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span className="cover-emoji" style={{display: book.imageUrl ? 'none' : 'flex'}}>4da</span>
      </div>
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        {typeof book.rating === 'number' && book.rating > 0 ? (
          <div className="book-rating">
            {renderStars(book.rating)}
            <span className="rating-number">{book.rating}</span>
          </div>
        ) : null}
        <p className="book-genre">{book.category}</p>
        <p className="book-description">{book.description}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(typeof book.price === 'number' && book.price > 0) || book.price === undefined ? (
            <span style={{ fontWeight: 600 }}>
              {(book.currencyCode || 'INR') + ' ' + ((typeof book.price === 'number' && book.price > 0 ? book.price : 50).toFixed(2))}
            </span>
          ) : null}
          <Link to={`/book/${bookId}`} className="btn btn-primary">
            View Details
          </Link>
          <button className="btn btn-secondary" onClick={handleBuy} disabled={adding}>
            {adding ? 'Adding...' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
