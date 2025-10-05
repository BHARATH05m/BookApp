# Book Recommendation Website

A modern, responsive book recommendation website built with React JS featuring 8 different book categories and a beautiful user interface.

## Features

- **8 Book Categories**: Fiction, Non-Fiction, Mystery & Thriller, Young Adult, Business & Finance, Technology, Health & Wellness, and Travel & Adventure
- **Search Functionality**: Search books by title, author, description, or genre
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, modern design with smooth animations and hover effects
- **Book Details**: Detailed view for each book with related recommendations
- **Category Pages**: Dedicated pages for each book category
- **Navigation**: Easy navigation between categories and search results

## Categories Included

1. **Fiction** - Contemporary Fiction, Science Fiction, Fantasy, Historical Fiction
2. **Non-Fiction** - History, Self-Help, Psychology, Memoir
3. **Mystery & Thriller** - Psychological Thriller, Crime, Mystery
4. **Young Adult** - Dystopian, Contemporary YA, Fantasy YA
5. **Business & Finance** - Personal Finance, Entrepreneurship, Business Strategy
6. **Technology** - Programming, Software Development, AI, Cybersecurity
7. **Health & Wellness** - Psychology, Health, Nutrition, Spirituality
8. **Travel & Adventure** - Adventure, Travel Memoir, Adventure Fiction

## Technologies Used

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **CSS3** - Modern CSS with Grid, Flexbox, and animations
- **JavaScript ES6+** - Modern JavaScript features

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd BookApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
BookApp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── CategoryPage.js
│   │   ├── CategoryPage.css
│   │   ├── BookCard.js
│   │   ├── BookCard.css
│   │   ├── SearchResults.js
│   │   ├── SearchResults.css
│   │   ├── BookDetail.js
│   │   └── BookDetail.css
│   ├── data/
│   │   └── books.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Features in Detail

### Home Page
- Hero section with search functionality
- Category grid showing all 8 book categories
- Featured book recommendations from each category

### Category Pages
- Dedicated pages for each book category
- Grid layout of books with ratings and descriptions
- Category-specific styling and icons

### Search Results
- Real-time search across all books
- Search by title, author, description, or genre
- Helpful suggestions when no results are found

### Book Details
- Comprehensive book information
- Related book recommendations
- Navigation back to categories

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Customization

### Adding New Books
Edit `src/data/books.js` to add new books to existing categories or create new categories.

### Styling
The app uses CSS custom properties for easy theming. Main colors and styles can be modified in the CSS files.

### Categories
To add new categories, update the `bookCategories` array in `src/data/books.js` and add corresponding navigation links in the Header component.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Book data is fictional and for demonstration purposes
- Icons and emojis are used for book covers
- Design inspired by modern web applications
