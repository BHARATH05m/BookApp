const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    category: "fiction",
    imageUrl: "https://example.com/gatsby.jpg",
    buyingLink: "https://www.amazon.com/Great-Gatsby-F-Scott-Fitzgerald/dp/0743273567",
    rating: 4,
    publishedYear: 1925
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The story of young Scout Finch and her father Atticus in a racially divided Alabama town.",
    category: "fiction",
    imageUrl: "https://example.com/mockingbird.jpg",
    buyingLink: "https://www.amazon.com/Kill-Mockingbird-Harper-Lee/dp/0446310786",
    rating: 5,
    publishedYear: 1960
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel about totalitarianism and surveillance society.",
    category: "fiction",
    imageUrl: "https://example.com/1984.jpg",
    buyingLink: "https://www.amazon.com/1984-Signet-Classics-George-Orwell/dp/0451524934",
    rating: 4,
    publishedYear: 1949
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "The adventure of Bilbo Baggins, a hobbit who embarks on a quest to reclaim a dwarf kingdom.",
    category: "fantasy",
    imageUrl: "https://example.com/hobbit.jpg",
    buyingLink: "https://www.amazon.com/Hobbit-J-R-R-Tolkien/dp/054792824X",
    rating: 5,
    publishedYear: 1937
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "An exploration of cosmology and the universe's biggest mysteries.",
    category: "science",
    imageUrl: "https://example.com/time.jpg",
    buyingLink: "https://www.amazon.com/Brief-History-Time-Stephen-Hawking/dp/0553380168",
    rating: 4,
    publishedYear: 1988
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    description: "Ancient Chinese text on military strategy and tactics.",
    category: "philosophy",
    imageUrl: "https://example.com/artofwar.jpg",
    buyingLink: "https://www.amazon.com/Art-War-Sun-Tzu/dp/0140439193",
    rating: 3,
    publishedYear: -500
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "The story of Elizabeth Bennet and Mr. Darcy in Georgian-era England.",
    category: "romance",
    imageUrl: "https://example.com/pride.jpg",
    buyingLink: "https://www.amazon.com/Pride-Prejudice-Jane-Austen/dp/0141439513",
    rating: 4,
    publishedYear: 1813
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "The story of Holden Caulfield's experiences in New York City.",
    category: "fiction",
    imageUrl: "https://example.com/catcher.jpg",
    buyingLink: "https://www.amazon.com/Catcher-Rye-J-D-Salinger/dp/0316769487",
    rating: 3,
    publishedYear: 1951
  }
];

// Populate database with sample data
const populateDatabase = async () => {
  try {
    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('Please create an admin user first using createAdmin.js');
      process.exit(1);
    }

    // Check if books already exist
    const existingBooks = await Book.countDocuments();
    if (existingBooks > 0) {
      console.log('Books already exist in the database');
      process.exit(0);
    }

    // Add admin user reference to each book
    const booksWithAdmin = sampleBooks.map(book => ({
      ...book,
      addedBy: adminUser._id
    }));

    // Insert books
    await Book.insertMany(booksWithAdmin);
    
    console.log('Sample books added successfully!');
    console.log(`Added ${sampleBooks.length} books to the database`);
    
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.connection.close();
  }
};

populateDatabase();
