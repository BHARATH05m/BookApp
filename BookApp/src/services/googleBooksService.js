const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const mapVolumeToBook = (v) => {
  const info = v.volumeInfo || {};
  const sale = v.saleInfo || {};
  const listPrice = sale.listPrice || sale.retailPrice || {};
  const amount = typeof listPrice.amount === 'number' ? listPrice.amount : 50;
  const currencyCode = listPrice.currencyCode || 'INR';
  
  // Assign a default rating of 3.5 if no rating exists, so books still display
  const rating = info.averageRating || 3.5;
  
  return {
    _id: v.id,
    title: info.title || 'Untitled',
    author: (info.authors && info.authors[0]) || 'Unknown',
    description: info.description || '',
    rating: rating,
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

  async byCategory(category, maxResults = 40) {
    // Normalize category name for better Google Books API results
    const normalizedCategory = category.toLowerCase()
      .replace(/\s+/g, '+')
      .replace('self-help', 'self+help')
      .replace('self help', 'self+help');
    
    const query = `subject:${normalizedCategory}`;
    
    // Try with paid ebooks first
    const paidUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&orderBy=relevance&printType=books&filter=paid-ebooks&maxResults=${maxResults}`;
    let res = await fetch(paidUrl);
    let data = await res.json();
    let items = Array.isArray(data.items) ? data.items : [];
    
    // If no results, try without filter
    if (items.length === 0) {
      const fallbackUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&orderBy=relevance&printType=books&maxResults=${maxResults}`;
      res = await fetch(fallbackUrl);
      data = await res.json();
      items = Array.isArray(data.items) ? data.items : [];
    }
    
    // If still no results, try with a broader search
    if (items.length === 0) {
      const broadQuery = normalizedCategory.split('+')[0]; // Use first word only
      const broadUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(broadQuery)}&orderBy=relevance&printType=books&maxResults=${maxResults}`;
      res = await fetch(broadUrl);
      data = await res.json();
      items = Array.isArray(data.items) ? data.items : [];
    }
    
    console.log(`Google Books API returned ${items.length} items for category: ${category}`);
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


