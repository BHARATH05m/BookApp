import React, { useState } from 'react';
import { commentService } from '../services/commentService';
import './Comment.css';

const Comment = ({ comment, currentUser, onUpdate, onDelete, onReport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(comment.rating);
  const [editComment, setEditComment] = useState(comment.comment);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUser && comment.userId._id === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';

  const handleEdit = () => {
    setIsEditing(true);
    setEditRating(comment.rating);
    setEditComment(comment.comment);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRating(comment.rating);
    setEditComment(comment.comment);
  };

  const handleSaveEdit = async () => {
    if (editComment.trim().length === 0) {
      alert('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await commentService.updateComment(comment._id, editRating, editComment.trim());
      if (result.success) {
        onUpdate(result.comment);
        setIsEditing(false);
      } else {
        alert(result.message || 'Failed to update comment');
      }
    } catch (error) {
      alert('Error updating comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsSubmitting(true);
      try {
        const result = await commentService.deleteComment(comment._id);
        if (result.success) {
          onDelete(comment._id);
        } else {
          alert(result.message || 'Failed to delete comment');
        }
      } catch (error) {
        alert('Error deleting comment');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await commentService.reportComment(comment._id, reportReason, reportDescription.trim());
      if (result.success) {
        alert('Comment reported successfully');
        setShowReportForm(false);
        setReportReason('');
        setReportDescription('');
        onReport && onReport(comment._id);
      } else {
        alert(result.message || 'Failed to report comment');
      }
    } catch (error) {
      alert('Error reporting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (isEditing) {
    return (
      <div className="comment comment-editing">
        <div className="comment-header">
          <div className="comment-author">
            <strong>{comment.userName}</strong>
          </div>
        </div>
        
        <div className="comment-rating">
          <label>Rating:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${editRating >= star ? 'active' : ''}`}
                onClick={() => setEditRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="comment-content">
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            placeholder="Write your review..."
              rows={4}
            maxLength="1000"
          />
          <div className="character-count">
            {editComment.length}/1000 characters
          </div>
        </div>

        <div className="comment-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleSaveEdit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <strong>{comment.userName}</strong>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="comment-rating">
          {renderStars(comment.rating)}
        </div>
      </div>

      <div className="comment-content">
        <p>{comment.comment}</p>
      </div>

      {comment.isReported && (
        <div className="comment-reported">
          <span className="report-badge">⚠️ Reported</span>
          {isAdmin && (
            <span className="report-reason">
              Reason: {comment.reportReason}
              {comment.reportDescription && ` - ${comment.reportDescription}`}
            </span>
          )}
        </div>
      )}

      <div className="comment-actions">
        {isOwner && (
          <>
            <button 
              className="btn btn-sm btn-outline" 
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              Edit
            </button>
            <button 
              className="btn btn-sm btn-danger" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </button>
          </>
        )}

        {!isOwner && currentUser && !comment.isReported && (
          <button 
            className="btn btn-sm btn-warning" 
            onClick={() => setShowReportForm(true)}
            disabled={isSubmitting}
          >
            Report
          </button>
        )}

        {isAdmin && comment.isReported && (
          <button 
            className="btn btn-sm btn-success" 
            onClick={async () => {
              const result = await commentService.dismissReport(comment._id);
              if (result.success) {
                onUpdate && onUpdate({ ...comment, isReported: false });
              } else {
                alert(result.message || 'Failed to dismiss report');
              }
            }}
            disabled={isSubmitting}
          >
            Dismiss Report
          </button>
        )}
      </div>

      {showReportForm && (
        <div className="report-form">
          <h4>Report Comment</h4>
          <div className="form-group">
            <label>Reason for reporting:</label>
            <select 
              value={reportReason} 
              onChange={(e) => setReportReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="offensive">Offensive language</option>
              <option value="irrelevant">Irrelevant to the book</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Additional details (optional):</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please provide more details..."
              rows="3"
              maxLength="500"
            />
            <div className="character-count">
              {reportDescription.length}/500 characters
            </div>
          </div>
          <div className="form-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleReport}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reporting...' : 'Submit Report'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setShowReportForm(false);
                setReportReason('');
                setReportDescription('');
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
