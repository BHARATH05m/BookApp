import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';
import { bookCategories } from '../data/books';
import { googleBooksService } from '../services/googleBooksService';
import './Home.css';

const Home = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(bookCategories.map(cat => cat.name));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const favorites = Array.isArray(user?.favoriteGenres) ? user.favoriteGenres : [];
      
      try {
        if (favorites.length > 0) {
          // Fetch books for each favorite genre from Google Books API
          console.log('Fetching books for favorite genres:', favorites);
          const allResults = await Promise.all(
            favorites.map(async (fav) => {
              try {
                const books = await googleBooksService.byCategory(fav, 40);
                console.log(`Fetched ${books.length} books for genre: ${fav}`);
                return books;
              } catch (err) {
                console.error(`Error fetching ${fav}:`, err);
                return [];
              }
            })
          );
          // Don't filter by rating - show all books
          const flat = allResults.flat();
          console.log(`Total books fetched: ${flat.length}`);
          setBooks(flat);
        } else {
          // Fetch books from multiple popular genres
          const genres = ['fiction', 'science', 'history', 'technology', 'business', 'psychology'];
          const allResults = await Promise.all(
            genres.map(genre => googleBooksService.byCategory(genre, 20))
          );
          // Don't filter by rating - show all books
          const flat = allResults.flat();
          setBooks(flat);
        }
      } catch (e) {
        console.error('Error fetching books from Google Books:', e);
        // Fallback to bestsellers if specific genres fail
        try {
          const popularBooks = await googleBooksService.byCategory('bestseller', 50);
          setBooks(popularBooks);
        } catch (err) {
          console.error('Error fetching bestsellers:', err);
          setBooks([]);
        }
      }
      
      setLoading(false);
    };
    fetchBooks();
  }, [user]);

  const getCategoryIcon = (categoryId) => {
    const icons = {
      'fiction': '📚',
      'non-fiction': '📖',
      'mystery-thriller': '🔍',
      'young-adult': '🌟',
      'business-finance': '💼',
      'technology': '💻',
      'health-wellness': '🧘',
      'travel-adventure': '✈️'
    };
    return icons[categoryId] || '📚';
  };

  const getBooksByCategory = (category) => {
    const norm = (s) => (s || '').toString().trim().toLowerCase();
    const target = norm(category);
    return books.filter(book => norm(book.category) === target);
  };

  const getFeaturedBooks = () => {
    const favorites = Array.isArray(user?.favoriteGenres) ? user.favoriteGenres : [];
    const categoriesToUse = favorites.length > 0 ? favorites : [...new Set(books.map(b => b.category))].slice(0, 4);
    const featured = [];
    categoriesToUse.forEach((category) => {
      const categoryBooks = getBooksByCategory(category);
      if (categoryBooks.length > 0) {
        featured.push({ category, book: categoryBooks[0] });
      }
    });
    return featured;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  const normalize = (s) => (s || '').toString().trim().toLowerCase();
  const favorite = Array.isArray(user?.favoriteGenres) ? user.favoriteGenres : [];
  const favoriteSet = new Set(favorite.map(normalize));
  const moreGenres = categories.filter((c) => !favoriteSet.has(normalize(c)));

  const EXTRA_GENRES = [
    'Art','Biography','Business','Chick Lit','Children\'s','Classics','Comics','Contemporary',
    'Cookbooks','Crime','Ebooks','Fantasy','Fiction','Graphic Novels',
    'Historical Fiction','History','Horror','Humor and Comedy','Memoir','Music','Mystery',
    'Nonfiction','Paranormal','Philosophy','Poetry','Psychology','Religion','Romance','Science',
    'Science Fiction','Self Help','Spirituality','Sports','Thriller','Travel','Young Adult',
    'Technology','Health','Education','Drama'
  ];
  const existingSet = new Set([...categories.map(normalize), ...favorite.map(normalize)]);
  const extraToShow = EXTRA_GENRES.filter(g => !existingSet.has(normalize(g))).slice(0, 20);
  const displayMoreGenres = [...moreGenres, ...extraToShow];

  return (
    <div className="container home-layout">
      <aside className="left-rail">
        <div className="search-box">
          <input type="text" placeholder="Books, authors" readOnly />
        </div>
        <div className="favorites-section">
          <div className="section-title">Favorite Genres: <Link to="/choose-genre" className="edit-link">(edit)</Link></div>
          {favorite.length === 0 && <div className="empty-note">No favorites yet</div>}
          {favorite.map((g) => (
            <Link key={g} to={`/category/${g}`} className="rail-item active">{g}</Link>
          ))}
        </div>
        <div className="more-section">
          <div className="section-title">More Genres:</div>
          {displayMoreGenres.map((g) => (
            <Link key={g} to={`/category/${g}`} className="rail-item">{g}</Link>
          ))}
        </div>
      </aside>

      <div className="main-content">
        

        {favorite.length > 0 ? (
          <section className="recommended-section">
            {favorite.map((fav) => {
              const favBooks = getBooksByCategory(fav).sort((a, b) => {
                const aHas = !!a.imageUrl;
                const bHas = !!b.imageUrl;
                if (aHas === bHas) return (b.rating || 0) - (a.rating || 0);
                return aHas ? -1 : 1;
              }).slice(0, 20); // Limit to 20 books per genre
              if (favBooks.length === 0) return null;
              return (
                <div key={fav} className="genre-block">
                  <h2>{fav} ({favBooks.length} books)</h2>
                  <div className="books-grid">
                    {favBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>
                </div>
              );
            })}
            {favorite.every((f) => getBooksByCategory(f).length === 0) && (
              <div className="empty-note" style={{margin: '16px 0'}}>
                No books found in your favorite genres yet. Browse all categories below.
              </div>
            )}
          </section>
        ) : (
          <section className="categories-section">
            <h2>Browse by Category</h2>
            <div className="categories-grid">
              {categories.map((category) => {
                const categoryBooks = getBooksByCategory(category);
                return (
                  <Link
                    key={category}
                    to={`/category/${category}`}
                    className="category-card"
                    style={{ '--category-color': '#667eea' }}
                  >
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <h3>{category}</h3>
                    <p>Explore {category} books</p>
                    <span className="book-count">
                      {categoryBooks.length} books
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {favorite.length === 0 && (
          <section className="featured-section">
            <h2>Featured Recommendations</h2>
            <div className="featured-grid">
              {getFeaturedBooks().map(({ category, book }) => (
                <div key={book._id} className="featured-card">
                  <div className="featured-cover">📚</div>
                  <div className="featured-content">
                    <h3>{book.title}</h3>
                    <p className="featured-author">by {book.author}</p>
                    <div className="featured-rating">
                      {'⭐'.repeat(Math.floor(book.rating || 0))}
                      <span className="rating-text">{book.rating || 0}</span>
                    </div>
                    <p className="featured-description">{book.description}</p>
                    <Link to={`/book/${book._id}`} className="btn btn-primary">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
