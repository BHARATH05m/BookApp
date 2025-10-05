# BookApp Backend API

A Node.js/Express backend API for the BookApp with authentication and book management functionality.

## Features

- **User Authentication**: Register, login, and profile management
- **Role-based Access**: Admin and User roles with different permissions
- **Book Management**: CRUD operations for books (Admin only for add/edit/delete)
- **MongoDB Integration**: Data persistence with MongoDB
- **JWT Authentication**: Secure token-based authentication
- **Search & Filter**: Search books by title, author, description
- **Category Management**: Filter books by categories

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` and update the values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookApp
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

#### Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Book Routes (`/api/books`)

#### Get All Books (Public)
```
GET /api/books
GET /api/books?category=fiction
GET /api/books?search=harry
GET /api/books?sort=price&order=desc
```

#### Get Book by ID (Public)
```
GET /api/books/:id
```

#### Add Book (Admin Only)
```
POST /api/books
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "category": "fiction",
  "imageUrl": "https://example.com/image.jpg",
  "price": 29.99,
  "publishedYear": 2023,
  "isbn": "978-1234567890"
}
```

#### Update Book (Admin Only)
```
PUT /api/books/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 24.99
}
```

#### Delete Book (Admin Only)
```
DELETE /api/books/:id
Authorization: Bearer <admin_token>
```

#### Get Books by Category (Public)
```
GET /api/books/category/:category
```

#### Get All Categories (Public)
```
GET /api/books/categories/all
```

## Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Book Schema
```javascript
{
  title: String (required),
  author: String (required),
  description: String (required),
  category: String (required),
  imageUrl: String,
  price: Number (required),
  rating: Number (0-5),
  publishedYear: Number (required),
  isbn: String (unique),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-based Access

- **User Role**: Can view books, search, filter, and manage their profile
- **Admin Role**: Can perform all user actions plus add, edit, and delete books

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

### File Structure
```
backend/
├── models/
│   ├── User.js
│   └── Book.js
├── routes/
│   ├── auth.js
│   └── books.js
├── middleware/
│   └── auth.js
├── server.js
├── config.env
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- CORS enabled for frontend integration

## Production Deployment

1. Change the JWT_SECRET to a strong, unique key
2. Use environment variables for sensitive data
3. Enable HTTPS in production
4. Set up proper MongoDB authentication
5. Use a process manager like PM2
6. Set up proper logging and monitoring
