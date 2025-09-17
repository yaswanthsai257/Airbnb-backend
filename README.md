# Airbnb Clone Backend API

A Node.js/Express backend API for the Airbnb clone application that serves property listings from a static JSON file.

## Features

- 🏠 Property listings API
- 🔍 Search and filter properties
- 📍 Location-based filtering
- 💰 Price range filtering
- ⭐ Rating-based filtering
- 📄 Pagination support
- 🛡️ CORS enabled for frontend integration
- 📊 Health check endpoint

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Get All Properties
```
GET /api/properties
```

**Query Parameters:**
- `category` - Filter by property category
- `location` - Filter by location (partial match)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum rating filter
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /api/properties?category=amazing_views&minPrice=2000&maxPrice=5000&page=1&limit=5
```

#### 2. Get Property by ID
```
GET /api/properties/:id
```

**Example:**
```
GET /api/properties/1
```

#### 3. Get Properties by Category
```
GET /api/properties/category/:category
```

**Example:**
```
GET /api/properties/category/amazing_views
```

#### 4. Get Properties by Location
```
GET /api/properties/location/:location
```

**Example:**
```
GET /api/properties/location/bangalore
```

#### 5. Search Properties
```
GET /api/properties/search?q=search_term
```

**Example:**
```
GET /api/properties/search?q=2BHK
```

#### 6. Get All Categories
```
GET /api/categories
```

#### 7. Health Check
```
GET /api/health
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Property Data Structure

```json
{
  "id": "1",
  "title": "2BHK in Bangalore",
  "location": "Koramangala, Bangalore",
  "distance": 5,
  "availableDates": "Dec 15-20",
  "price": 2500,
  "rating": 4.9,
  "images": ["url1", "url2", "url3"],
  "category": "amazing_views",
  "coordinates": {
    "lat": 12.9352,
    "lng": 77.6245
  },
  "description": "Property description",
  "amenities": ["WiFi", "Air Conditioning", "Parking"],
  "host": {
    "name": "Host Name",
    "avatar": "avatar_url",
    "rating": 4.8
  }
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Vite dev server alternative port)
- `http://localhost:3000` (React dev server)

## Data Source

Properties data is loaded from `data/properties.json`. To add new properties, simply edit this file and restart the server.

## Development

The server uses `nodemon` for development, which automatically restarts the server when files change.

## Production

For production deployment, use:
```bash
npm start
```

Make sure to set the `NODE_ENV` environment variable to `production`.
