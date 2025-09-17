const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load properties data
const loadProperties = () => {
  try {
    const dataPath = path.join(__dirname, 'data', 'properties.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading properties data:', error);
    return { properties: [] };
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Airbnb Clone Backend API',
    version: '1.0.0',
    endpoints: {
      properties: '/api/properties',
      propertyById: '/api/properties/:id',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all properties with optional filtering
app.get('/api/properties', (req, res) => {
  try {
    const data = loadProperties();
    let properties = [...data.properties];

    // Apply filters
    const { category, location, minPrice, maxPrice, minRating, search } = req.query;

    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      properties = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.category.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      properties = properties.filter(property => 
        property.category === category
      );
    }

    if (location) {
      properties = properties.filter(property =>
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      properties = properties.filter(property =>
        property.price >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      properties = properties.filter(property =>
        property.price <= parseInt(maxPrice)
      );
    }

    if (minRating) {
      properties = properties.filter(property =>
        property.rating >= parseFloat(minRating)
      );
    }

    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProperties = properties.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(properties.length / limit),
        totalItems: properties.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < properties.length,
        hasPrevPage: page > 1
      },
      filters: {
        category: category || null,
        location: location || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        minRating: minRating || null,
        search: search || null
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Search properties (must come before /:id route)
app.get('/api/properties/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const data = loadProperties();
    const searchTerm = q.toLowerCase();
    const properties = data.properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.location.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm) ||
      property.category.toLowerCase().includes(searchTerm)
    );

    res.json({
      success: true,
      data: properties,
      query: q,
      count: properties.length
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get properties by category
app.get('/api/properties/category/:category', (req, res) => {
  try {
    const data = loadProperties();
    const properties = data.properties.filter(p => p.category === req.params.category);

    res.json({
      success: true,
      data: properties,
      category: req.params.category,
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get properties by location
app.get('/api/properties/location/:location', (req, res) => {
  try {
    const data = loadProperties();
    const location = req.params.location.toLowerCase();
    const properties = data.properties.filter(p => 
      p.location.toLowerCase().includes(location)
    );

    res.json({
      success: true,
      data: properties,
      location: req.params.location,
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get property by ID (must come after specific routes)
app.get('/api/properties/:id', (req, res) => {
  try {
    const data = loadProperties();
    const property = data.properties.find(p => p.id === req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const data = loadProperties();
    const categories = [...new Set(data.properties.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}`);
    console.log(`🏠 Properties API: http://localhost:${PORT}/api/properties`);
    console.log(`🔍 Search API: http://localhost:${PORT}/api/properties/search?q=search_term`);
  });
}

module.exports = app;
