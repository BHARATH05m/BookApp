# BookApp - Online Book Store

A full-stack book store application with user authentication, cart functionality, purchase history, and UPI payment integration.

## Features

- 📚 Browse books by categories
- 🔍 Search functionality
- 🛒 Shopping cart
- 💳 UPI payment integration
- 📊 Purchase history
- 🏆 Top-selling books
- 👤 User authentication (Login/Register)
- 👨‍💼 Admin panel for book management
- ⭐ Book ratings and reviews
- 💬 Comments system

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
UID/
├── BookApp/          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── data/
│   │   └── App.js
│   └── package.json
├── backend/          # Backend Node.js/Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/bookApp
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
MERCHANT_ID=BOOKSTORE123
MERCHANT_KEY=your-secret-key
UPI_ID=bookstore@paytm
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5001
```

4. Create admin user:
```bash
npm run create-admin
```

5. Populate sample data (optional):
```bash
npm run sample-data
```

6. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
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

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Email:** admin@bookapp.com
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/checkout` - Checkout cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Purchases
- `GET /api/purchases/history` - Get purchase history
- `GET /api/purchases/stats` - Get purchase statistics

### Reports
- `GET /api/reports/top-selling` - Get top-selling books

## Features in Detail

### User Features
- Browse books by category
- Search for books
- Add books to cart
- Make purchases with UPI payment
- View purchase history
- Rate and review books
- Comment on books

### Admin Features
- Add/Edit/Delete books
- View all users
- Manage book categories
- View sales reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any queries or support, please contact the development team.
