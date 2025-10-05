import React, { useState } from 'react';
import { commentService } from '../services/commentService';
import './AddComment.css';

const AddComment = ({ bookId, onCommentAdded, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (comment.trim().length === 0) {
      alert('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await commentService.addComment(bookId, rating, comment.trim());
      if (result.success) {
        setRating(0);
        setComment('');
        setHoveredRating(0);
        onCommentAdded(result.comment);
        alert('Review added successfully!');
      } else {
        alert(result.message || 'Failed to add review');
      }
    } catch (error) {
      alert('Error adding review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${displayRating >= i ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          disabled={isSubmitting}
        >
          ⭐
        </button>
      );
    }
    return stars;
  };

  if (!currentUser) {
    return (
      <div className="add-comment-login-required">
        <p>Please <a href="/login">login</a> to write a review</p>
      </div>
    );
  }

  return (
    <div className="add-comment">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <label htmlFor="rating">Your Rating:</label>
          <div className="rating-input">
            {renderStars()}
            <span className="rating-text">
              {rating === 0 ? 'Select a rating' : `${rating} star${rating > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className="comment-section">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows="10"
            maxLength="1000"
            required
            disabled={isSubmitting}
          />
          <div className="character-count">
            {comment.length}/1000 characters
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setRating(0);
              setComment('');
              setHoveredRating(0);
            }}
            disabled={isSubmitting}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
