const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const mapVolumeToBook = (v) => {
  const info = v.volumeInfo || {};
  const sale = v.saleInfo || {};
  const listPrice = sale.listPrice || sale.retailPrice || {};
  const amount = typeof listPrice.amount === 'number' ? listPrice.amount : 50;
  const currencyCode = listPrice.currencyCode || 'INR';
  return {
    _id: v.id,
    title: info.title || 'Untitled',
    author: (info.authors && info.authors[0]) || 'Unknown',
    description: info.description || '',
    rating: info.averageRating || 0,
    reviewsCount: info.ratingsCount || 0,
    category: (info.categories && info.categories[0]) || 'general',
    imageUrl: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '',
    price: amount,
    currencyCode
  };
};

export const googleBooksService = {
  async search(query, maxResults = 20) {
    const paidUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&orderBy=relevance&filter=paid-ebooks`;
    let res = await fetch(paidUrl);
    let data = await res.json();
    let items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      const fallbackUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
      res = await fetch(fallbackUrl);
      data = await res.json();
      items = Array.isArray(data.items) ? data.items : [];
    }
    return items.map(mapVolumeToBook);
  },

  async byCategory(category, maxResults = 20) {
    const query = `subject:${category}`;
    const paidUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&orderBy=relevance&printType=books&filter=paid-ebooks&maxResults=${maxResults}`;
    let res = await fetch(paidUrl);
    let data = await res.json();
    let items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      const fallbackUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&orderBy=relevance&printType=books&maxResults=${maxResults}`;
      res = await fetch(fallbackUrl);
      data = await res.json();
      items = Array.isArray(data.items) ? data.items : [];
    }
    return items.map(mapVolumeToBook).map(b => ({ ...b, category }));
  }
};

// Fetch a single volume by its Google Books volumeId
export const getGoogleVolumeById = async (volumeId) => {
  const res = await fetch(`${GOOGLE_BOOKS_API}/${encodeURIComponent(volumeId)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data.id) return null;
  return mapVolumeToBook(data);
};


