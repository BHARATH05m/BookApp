const API_BASE_URL = 'http://localhost:5001/api';

export const bookService = {
  // Get all books
  async getAllBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      const data = await response.json();
      return data.success ? data.books : [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  // Get book by ID
  async getBookById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      const data = await response.json();
      return data.success ? data.book : null;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  },

  // Get books by category
  async getBooksByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/category/${category}`);
      const data = await response.json();
      return data.success ? data.books : [];
    } catch (error) {
      console.error('Error fetching books by category:', error);
      return [];
    }
  },

  // Search books
  async searchBooks(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/books?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.success ? data.books : [];
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  },

  // Get all categories
  async getAllCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/books/categories/all`);
      const data = await response.json();
      return data.success ? data.categories : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Add new book (requires authentication)
  async addBook(bookData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error adding book:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Update book (requires authentication)
  async updateBook(bookId, bookData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error updating book:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Delete book (requires authentication)
  async deleteBook(bookId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error deleting book:', error);
      return { success: false, error: 'Network error' };
    }
  }
};
