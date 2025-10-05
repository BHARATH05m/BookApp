import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { reviewService } from '../services/reviewService';
import UserManagement from './UserManagement';
import './AdminPanel.css';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reportedComments, setReportedComments] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    if (activeTab === 'comments') fetchReportedComments();
    if (activeTab === 'reviews') fetchReportedReviews();
  }, [user, currentPage, activeTab]);

  const fetchReportedComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.getReportedComments(currentPage, 10);
      if (result.success) {
        if (currentPage === 1) {
          setReportedComments(result.comments);
        } else {
          setReportedComments(prev => [...prev, ...result.comments]);
        }
        setTotalPages(result.totalPages);
        setHasMore(result.comments.length === 10);
      }
    } catch (error) {
      console.error('Error fetching reported comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportedReviews = async () => {
    try {
      setLoading(true);
      const result = await reviewService.getReportedReviews(currentPage, 10);
      if (result.success) {
        const list = Array.isArray(result.reviews) ? result.reviews : [];
        if (currentPage === 1) setReportedReviews(list);
        else setReportedReviews(prev => [...prev, ...list]);
        setTotalPages(result.totalPages || 1);
        setHasMore(list.length === 10);
      }
    } catch (error) {
      console.error('Error fetching reported reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissReport = async (commentId) => {
    try {
      const result = await commentService.dismissReport(commentId);
      if (result.success) {
        setReportedComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, isReported: false, reportReason: null, reportDescription: null, reportedBy: null }
              : comment
          )
        );
        alert('Report dismissed successfully');
      } else {
        alert(result.message || 'Failed to dismiss report');
      }
    } catch (error) {
      alert('Error dismissing report');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        const result = await commentService.deleteComment(commentId);
        if (result.success) {
          setReportedComments(prev => prev.filter(comment => comment._id !== commentId));
          alert('Comment deleted successfully');
        } else {
          alert(result.message || 'Failed to delete comment');
        }
      } catch (error) {
        alert('Error deleting comment');
      }
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const refreshComments = () => {
    setCurrentPage(1);
    setReportedComments([]);
    fetchReportedComments();
  };

  const refreshReviews = () => {
    setCurrentPage(1);
    setReportedReviews([]);
    fetchReportedReviews();
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

  const getReportReasonText = (reason) => {
    const reasons = {
      spam: 'Spam',
      inappropriate: 'Inappropriate content',
      offensive: 'Offensive language',
      irrelevant: 'Irrelevant to the book',
      other: 'Other'
    };
    return reasons[reason] || reason;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          {/* You can remove the old comments tab if not needed */}
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reported Reviews
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>
      </div>

      {/* Old reported comments section removed per request */}

      {activeTab === 'reviews' && (
        <>
          <div className="tab-header">
            <h2>Reported Reviews</h2>
            <button 
              className="btn btn-primary"
              onClick={refreshReviews}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Reported Reviews</h3>
              <p className="stat-number">{reportedReviews.length}</p>
            </div>
          </div>

          <div className="reported-comments">
            {loading && reportedReviews.length === 0 ? (
              <div className="loading">
                <p>Loading reported reviews...</p>
              </div>
            ) : reportedReviews.length === 0 ? (
              <div className="no-comments">
                <p>No reported reviews found.</p>
              </div>
            ) : (
              <>
                {reportedReviews.map((rev) => (
                  <div key={rev._id} className="reported-comment-card">
                    <div className="comment-header">
                      <div className="comment-info">
                        <h4>Review by {rev.userId?.username || 'Unknown User'}</h4>
                        <p className="comment-date">{formatDate(rev.createdAt)}</p>
                        <p className="book-info">Book ID: {rev.bookId}</p>
                      </div>
                      <div className="comment-rating">
                        {'⭐'.repeat(rev.rating || 0)}
                      </div>
                    </div>

                    <div className="comment-content">
                      <p>{rev.comment}</p>
                    </div>

                    <div className="report-info">
                      <div className="report-details">
                        <h5>Report Details:</h5>
                        <p><strong>Reason:</strong> {getReportReasonText(rev.reportReason)}</p>
                        {rev.reportDescription && (
                          <p><strong>Description:</strong> {rev.reportDescription}</p>
                        )}
                        <p><strong>Reported by:</strong> {rev.reportedBy?.username || 'Unknown User'}</p>
                        <p><strong>Reported on:</strong> {formatDate(rev.updatedAt || rev.createdAt)}</p>
                      </div>
                    </div>

                    <div className="comment-actions">
                      <button 
                        className="btn btn-success"
                        onClick={async () => {
                          const result = await reviewService.dismissReviewReport(rev._id);
                          if (result?.success) {
                            setReportedReviews(prev => prev.map(r => r._id === rev._id ? { ...r, isReported: false } : r));
                            alert('Report dismissed');
                          } else {
                            alert(result?.message || 'Failed to dismiss');
                          }
                        }}
                      >
                        Dismiss Report
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={async () => {
                          if (!window.confirm('Delete this review?')) return;
                          const res = await reviewService.adminDeleteReview(rev._id);
                          if (res.success) {
                            setReportedReviews(prev => prev.filter(r => r._id !== rev._id));
                            alert('Review deleted');
                          } else {
                            alert(res.message || 'Failed to delete');
                          }
                        }}
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="load-more">
                    <button 
                      className="btn btn-outline"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <UserManagement user={user} />
      )}
    </div>
  );
};

export default AdminPanel;
