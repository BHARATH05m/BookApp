import React, { useState } from 'react';
import { bookService } from '../services/bookService';
import './AddBook.css';

const initial = {
  title: '',
  author: '',
  description: '',
  category: '',
  imageUrl: '',
  buyingLink: '',
  publishedYear: '',
  rating: ''
};

const AddBook = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const result = await bookService.addBook({
        title: form.title,
        author: form.author,
        description: form.description,
        category: form.category,
        imageUrl: form.imageUrl,
        buyingLink: form.buyingLink,
        publishedYear: Number(form.publishedYear),
        rating: Number(form.rating)
      });

      if (result.success) {
        setMessage('Book added successfully');
        setForm(initial);
      } else {
        setError(result.data?.message || result.error || 'Failed to add book');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="addbook-container">
      <div className="addbook-card">
        <h2>Add New Book</h2>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={onSubmit} className="addbook-form">
          <div className="grid">
            <label>
              <span>Title</span>
              <input name="title" value={form.title} onChange={onChange} required />
            </label>
            <label>
              <span>Author</span>
              <input name="author" value={form.author} onChange={onChange} required />
            </label>
            <label className="full">
              <span>Description</span>
              <textarea name="description" value={form.description} onChange={onChange} rows={4} required />
            </label>
            <label>
              <span>Category</span>
              <select name="category" value={form.category} onChange={onChange} required>
                <option value="">Select a category</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="mystery-thriller">Mystery & Thriller</option>
                <option value="young-adult">Young Adult</option>
                <option value="business-finance">Business & Finance</option>
                <option value="technology">Technology</option>
                <option value="health-wellness">Health & Wellness</option>
                <option value="travel-adventure">Travel & Adventure</option>
                <option value="science">Science</option>
                <option value="philosophy">Philosophy</option>
                <option value="romance">Romance</option>
                <option value="fantasy">Fantasy</option>
                <option value="biography">Biography</option>
                <option value="history">History</option>
                <option value="self-help">Self Help</option>
                <option value="cooking">Cooking</option>
                <option value="art">Art</option>
                <option value="poetry">Poetry</option>
                <option value="drama">Drama</option>
                <option value="horror">Horror</option>
                <option value="comics">Comics & Graphic Novels</option>
                <option value="children">Children's Books</option>
                <option value="academic">Academic</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="full">
              <span>Image URL</span>
              <input name="imageUrl" value={form.imageUrl} onChange={onChange} />
              {form.imageUrl && (
                <div className="image-preview">
                  <img 
                    src={form.imageUrl} 
                    alt="Book cover preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>
                    Unable to load image preview
                  </div>
                </div>
              )}
            </label>
            <label>
              <span>Buying Link</span>
              <input 
                name="buyingLink" 
                type="url" 
                value={form.buyingLink} 
                onChange={onChange} 
                placeholder="https://amazon.com/book-link or other store URL"
                required 
              />
            </label>
            <label>
              <span>Published Year</span>
              <input name="publishedYear" type="number" value={form.publishedYear} onChange={onChange} required />
            </label>
            <label>
              <span>Rating (out of 5)</span>
              <select name="rating" value={form.rating} onChange={onChange} required>
                <option value="">Select rating</option>
                <option value="1">1 ⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
              </select>
            </label>
          </div>

          <button type="submit" className="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
