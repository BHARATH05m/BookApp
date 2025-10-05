import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllBooks } from '../data/books';
import { googleBooksService, getGoogleVolumeById } from '../services/googleBooksService';
import { commentService } from '../services/commentService';
import AddComment from './AddComment';
import Comment from './Comment';
import { addToCart } from '../services/cartService';
import { fetchReviews, submitReview, reviewService } from '../services/reviewService';
import RatingChart from './RatingChart';
import './BookDetail.css';

const BookDetail = ({ user }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isExternal, setIsExternal] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [reportingId, setReportingId] = useState(null);
  const [reportMenuForId, setReportMenuForId] = useState(null);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      // Try Google Books API by ID first
      try {
        const found = await getGoogleVolumeById(bookId);
        if (found) {
          setBook(found);
          setIsExternal(true);
          setError(null);
        } else {
          // Fallback to static data
          const allBooks = getAllBooks();
          const local = allBooks.find(b => String(b.id) === String(bookId) || String(b._id) === String(bookId));
          if (local) {
            setBook(local);
            setIsExternal(false);
            setError(null);
          } else {
            setBook(null);
            setError('Book not found');
          }
        }
      } catch (err) {
        setBook(null);
        setError('Book not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!bookId) return;
      try {
        setCommentsLoading(true);
        // For Google Books (external), use our backend reviews by volumeId
        const list = await fetchReviews(bookId);
        if (commentsPage === 1) setComments(list);
        else setComments(prev => [...prev, ...list]);
        setHasMoreComments(false);
        const nums = list.map(r => Number(r.rating) || 0);
        const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
        setAvgRating(Number(avg.toFixed(1)));
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [bookId, commentsPage]);

  const handleCommentAdded = (newComment) => {
    setComments(prev => {
      const next = [newComment, ...prev];
      const nums = next.map(r => Number(r.rating) || 0);
      const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
      setAvgRating(Number(avg.toFixed(1)));
      return next;
    });
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  const beginEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditRating(Number(review.rating) || 5);
    setEditComment(review.comment || '');
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment('');
  };

  const saveEditReview = async (bookIdToUpdate) => {
    const res = await reviewService.updateReview(bookIdToUpdate, editRating, editComment);
    if (res.success && res.comment) {
      setComments(prev => {
        const next = prev.map(r => (r._id === res.comment._id ? res.comment : r));
        const nums = next.map(r => Number(r.rating) || 0);
        const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
        setAvgRating(Number(avg.toFixed(1)));
        return next;
      });
      cancelEditReview();
    } else {
      alert(res.message || 'Failed to update review');
    }
  };

  const deleteOwnReview = async (bookIdToDelete) => {
    if (!window.confirm('Delete your review?')) return;
    const res = await reviewService.deleteReview(bookIdToDelete);
    if (res.success) {
      setComments(prev => {
        const next = prev.filter(r => r.userId?._id !== (user?.id || user?._id));
        const nums = next.map(r => Number(r.rating) || 0);
        const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
        setAvgRating(Number(avg.toFixed(1)));
        return next;
      });
    } else {
      alert(res.message || 'Failed to delete review');
    }
  };

  const submitReport = async (reviewId, reason) => {
    if (!reason) return;
    try {
      setReportingId(reviewId);
      const res = await reviewService.reportReview(reviewId, reason, '');
      if (res.success) {
        alert('Review reported');
      } else {
        alert(res.message || 'Failed to report review');
      }
    } finally {
      setReportingId(null);
      setReportMenuForId(null);
    }
  };

  const loadMoreComments = () => {
    setCommentsPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading book...</h2>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Book Not Found</h1>
          <p>The book you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  // For now, we'll show related books from the same category
  // In a full implementation, you might want to fetch related books from the backend
  const relatedBooks = [];

  const handleBuy = async () => {
    const price = typeof book.price === 'number' && book.price > 0 ? book.price : 50;
    try {
      console.log('Adding to cart from BookDetail:', { bookId, title: book.title, imageUrl: book.imageUrl });
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
    }
  };

  return (
    <div className="container">
      <div className="book-detail">
        <div className="book-detail-header">
          <div className="book-cover-large">
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
            <span className="cover-emoji-large" tabIndex={0} style={{display: book.imageUrl ? 'none' : 'flex'}}>
              📚
            </span>
            <div className="detail-flip">
              <div className="detail-face detail-front"></div>
              <div className="detail-face detail-back">
                <div className="cover-overlay-content">
                  <h3 className="overlay-title">About this book</h3>
                  <p className="overlay-description">{book.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="book-info">
            <h1>{book.title}</h1>
            <p className="book-author-large">by {book.author}</p>
            {typeof avgRating === 'number' && avgRating > 0 ? (
              <div className="book-rating-large">
                <span className="stars-large">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const r = Number(avgRating) || 0;
                    const filled = i < Math.floor(r);
                    const half = !filled && i === Math.floor(r) && r - Math.floor(r) >= 0.5;
                    const cls = filled ? 'star filled' : half ? 'star half' : 'star';
                    return <span key={i} className={cls}></span>;
                  })}
                </span>
                <span className="rating-number-large">{avgRating}/5</span>
              </div>
            ) : null}
            <p className="book-genre-large">{book.category}</p>
            <p className="book-description-large">{book.description}</p>
            
            <div className="purchase-options">
              <h3>Buy</h3>
              <div className="purchase-buttons">
                <span style={{ fontWeight: 700, marginRight: 12 }}>
                  {(book.currencyCode || 'INR') + ' ' + ((typeof book.price === 'number' && book.price > 0 ? book.price : 50).toFixed(2))}
                </span>
                <button className="btn btn-primary" onClick={handleBuy}>Buy</button>
              </div>
            </div>

            {isAdmin && (
              <div className="book-actions">
                <Link to={`/edit-book/${book._id}`} className="btn btn-primary">
                  Edit Book
                </Link>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
                      alert('Delete functionality is disabled in static mode.');
                    }
                  }}
                >
                  Delete Book
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h2>More from {book.category}</h2>
            <div className="related-books-grid">
              {relatedBooks.map((relatedBook) => (
                <div key={relatedBook._id} className="related-book-card">
                  <div className="related-book-cover">
                    {relatedBook.imageUrl ? (
                      <img 
                        src={relatedBook.imageUrl} 
                        alt={`Cover of ${relatedBook.title}`}
                        className="related-book-cover-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className="related-cover-emoji" style={{display: relatedBook.imageUrl ? 'none' : 'flex'}}>📚</span>
                  </div>
                  <div className="related-book-info">
                    <h3>{relatedBook.title}</h3>
                    <p>by {relatedBook.author}</p>
                    <div className="related-book-rating">
                      {'⭐'.repeat(Math.floor(relatedBook.rating || 0))} {relatedBook.rating || 0}
                    </div>
                    <Link to={`/book/${relatedBook._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings & Comments Section */}
        <div className="comments-section">
          <h2>Reviews & Ratings</h2>
          <RatingChart reviews={comments} />
          
          {/* Add Review Form (Google volumeId) */}
          <ReviewForm 
            bookId={bookId}
            onReviewAdded={handleCommentAdded}
            currentUser={user}
          />

          {/* Comments List */}
          <div className="comments-list">
            {commentsLoading && comments.length === 0 ? (
              <div className="loading-comments">
                <p>Loading reviews...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <p>No reviews yet. Be the first to review this book!</p>
              </div>
            ) : (
              <>
                {comments.map((r) => {
                  const isOwner = user && (r.userId?._id === (user.id || user._id));
                  const isEditing = editingReviewId === r._id;
                  return (
                    <div key={r._id} className="comment-item">
                      <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{r.userId?.username || 'User'}</strong>
                          <span className="comment-rating" style={{ marginLeft: 8 }}>{'⭐'.repeat(r.rating || 0)}</span>
                        </div>
                        {isOwner && !isEditing && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-outline" onClick={() => beginEditReview(r)}>Edit</button>
                            <button className="btn btn-outline" onClick={() => deleteOwnReview(bookId)}>Delete</button>
                          </div>
                        )}
                        {!isOwner && (
                          <div>
                            <button 
                              className="btn btn-outline" 
                              onClick={() => setReportMenuForId(prev => prev === r._id ? null : r._id)}
                              disabled={reportingId === r._id}
                            >
                              {reportingId === r._id ? 'Reporting...' : (reportMenuForId === r._id ? 'Choose reason' : 'Report')}
                            </button>
                          </div>
                        )}
                      </div>
                      {!isEditing && <p>{r.comment}</p>}
                      {!isOwner && reportMenuForId === r._id && (
                        <div style={{ marginTop: 8 }}>
                          <select 
                            onChange={(e) => e.target.value && submitReport(r._id, e.target.value)} 
                            defaultValue=""
                          >
                            <option value="" disabled>Select a reason</option>
                            <option value="spam">Spam</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="offensive">Offensive language</option>
                            <option value="irrelevant">Irrelevant to the book</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}
                      {isOwner && isEditing && (
                        <div style={{ marginTop: 8 }}>
                          <div className="rating-input">
                            {[1,2,3,4,5].map(n => (
                              <button type="button" key={n} className={`star-button ${editRating >= n ? 'active' : ''}`} onClick={() => setEditRating(n)}>⭐</button>
                            ))}
                          </div>
                          <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary" onClick={() => saveEditReview(bookId)}>Save</button>
                            <button className="btn btn-secondary" onClick={cancelEditReview}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {hasMoreComments && (
                  <div className="load-more-comments">
                    <button 
                      className="btn btn-outline"
                      onClick={loadMoreComments}
                      disabled={commentsLoading}
                    >
                      {commentsLoading ? 'Loading...' : 'Load More Reviews'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="book-navigation">
          <Link to={`/category/${book.category}`} className="btn btn-secondary">
            ← Back to {book.category}
          </Link>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

const ReviewForm = ({ bookId, onReviewAdded, currentUser }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    try {
      const saved = await submitReview(bookId, { rating: Number(rating), comment });
      onReviewAdded(saved);
      setComment('');
      setRating(5);
    } catch (e) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-comment" onSubmit={handleSubmit}>
      <div className="rating-input">
        {[1,2,3,4,5].map(n => (
          <button type="button" key={n} className={`star-button ${rating >= n ? 'active' : ''}`} onClick={() => setRating(n)}>⭐</button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
      />
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default BookDetail;
