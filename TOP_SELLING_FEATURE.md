# Top Selling Books Feature

## Overview
This feature tracks and reports the top-selling books using Google Books API data. It includes both backend and frontend components.

## Backend Components

### 1. Purchase Model (`backend/models/Purchase.js`)
- **Fields**: `bookId`, `title`, `author`, `price`, `quantity`, `userId`, `date`
- **Purpose**: Stores individual purchase records for tracking sales
- **Indexes**: Optimized for queries by `bookId` and `date`

### 2. Updated Order Creation (`backend/routes/orders.js`)
- When a user completes an order, purchase records are automatically created
- Each cart item becomes a purchase record in the database
- Maintains data integrity between orders and purchases

### 3. Reports API (`backend/routes/reports.js`)
- **Endpoint**: `GET /api/reports/top-selling`
- **Access**: Public (no authentication required)
- **Functionality**: 
  - Aggregates purchases by `bookId` for the current month
  - Calculates total quantity sold for each book
  - Returns top 5 books sorted by sales volume
  - Returns "No books sold this month" if no data found

## Frontend Components

### 1. TopSellingBooks Component (`BookApp/src/components/TopSellingBooks.js`)
- **Features**:
  - Fetches data from `/api/reports/top-selling`
  - Displays book covers using Google Books API
  - Shows ranking, title, author, and total sold count
  - Handles loading states and error cases
  - Shows "No books sold this month" when no data

### 2. Styling (`BookApp/src/components/TopSellingBooks.css`)
- **Design**: Modern card-based layout with rankings
- **Features**:
  - Special styling for top 3 books (gold, silver, bronze)
  - Responsive grid layout
  - Hover effects and animations
  - Mobile-friendly design

### 3. Navigation Integration
- Added "Top Selling" link to main navigation
- Accessible to both admin and regular users
- Route: `/top-selling`

## Usage

### For Users
1. Navigate to "Top Selling" from the main menu
2. View the current month's best-selling books
3. See book covers, titles, authors, and sales counts

### For Admins
1. Same access as users
2. Can view sales analytics
3. Useful for inventory and marketing decisions

## API Response Format

```json
{
  "message": "Top-selling books retrieved successfully",
  "books": [
    {
      "bookId": "google_books_id",
      "title": "Book Title",
      "author": "Author Name",
      "totalSold": 15
    }
  ]
}
```

## Database Schema

### Purchase Collection
```javascript
{
  bookId: String,        // Google Books ID
  title: String,         // Book title
  author: String,        // Author name
  price: Number,         // Price at time of purchase
  quantity: Number,      // Quantity purchased (default: 1)
  userId: ObjectId,      // Reference to User
  date: Date,           // Purchase date
  createdAt: Date,      // Record creation time
  updatedAt: Date       // Record update time
}
```

## Technical Notes

1. **Data Aggregation**: Uses MongoDB aggregation pipeline for efficient querying
2. **Google Books Integration**: Fetches book covers using existing `getGoogleVolumeById` function
3. **Error Handling**: Graceful fallbacks for missing book covers
4. **Performance**: Indexed queries for fast response times
5. **Public Access**: No authentication required for viewing top-selling books

## Future Enhancements

- Historical data (previous months/years)
- Time-based filtering (last 7 days, last 30 days, etc.)
- Revenue-based rankings
- Export functionality for reports
- Charts and visualizations
