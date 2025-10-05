import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoriteGenre.css';
import { allowedGenres } from '../constants/genres';

const GENRES = allowedGenres;

const FavoriteGenre = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = (genre) => {
    setError('');
    setSelected((prev) => {
      const exists = prev.includes(genre);
      if (exists) return prev.filter(g => g !== genre);
      if (prev.length >= 5) {
        setError('You can select up to 5 genres');
        return prev;
      }
      return [...prev, genre];
    });
  };

  const handleSave = async () => {
    if (!selected.length) {
      setError('Select at least one genre to continue');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ favoriteGenres: selected })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save');
      }

      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...user, favoriteGenres: selected };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Force reload so App reads updated localStorage and stops gating
      window.location.replace('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="genre-container">
      <div className="genre-card">
        <h2>Next, select your favorite genres.</h2>
        <p>We use your favorite genres to make better book recommendations.</p>
        {error && <div className="error-message">{error}</div>}
        <div className="genre-grid">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`genre-item ${selected.includes(g) ? 'selected' : ''}`}
              onClick={() => toggle(g)}
              type="button"
            >
              {g}
            </button>
          ))}
        </div>
        <div className="genre-actions">
          <button className="submit-btn" onClick={handleSave} disabled={saving || selected.length === 0}>
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteGenre;


