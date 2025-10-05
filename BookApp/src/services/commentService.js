const API_BASE_URL = 'http://localhost:5001/api';

export const commentService = {
  // Get comments for a book
  async getCommentsByBook(bookId, page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/book/${bookId}?page=${page}&limit=${limit}`);
      const data = await response.json();
      return data.success ? data : { success: false, comments: [], total: 0 };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { success: false, comments: [], total: 0 };
    }
  },

  // Add a new comment
  async addComment(bookId, rating, comment) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, rating, comment })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Update a comment
  async updateComment(commentId, rating, comment) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Report a comment
  async reportComment(commentId, reportReason, reportDescription) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportReason, reportDescription })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reporting comment:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get reported comments (admin only)
  async getReportedComments(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/admin/reported?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reported comments:', error);
      return { success: false, comments: [], total: 0 };
    }
  },

  // Dismiss report (admin only)
  async dismissReport(commentId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/dismiss-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error dismissing report:', error);
      return { success: false, message: 'Network error' };
    }
  }
};
