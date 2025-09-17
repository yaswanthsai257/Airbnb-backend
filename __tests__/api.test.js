const request = require('supertest');
const app = require('../server');

describe('Airbnb Clone API Tests', () => {
  
  // Test health endpoint
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  // Test root endpoint
  describe('GET /', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Airbnb Clone Backend API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  // Test properties endpoint
  describe('GET /api/properties', () => {
    it('should return all properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check property structure
      const property = response.body.data[0];
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('title');
      expect(property).toHaveProperty('location');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('rating');
      expect(property).toHaveProperty('coordinates');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/properties?page=1&limit=5')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('currentPage', 1);
      expect(response.body.pagination).toHaveProperty('itemsPerPage', 5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/properties?category=amazing_views')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(property => {
        expect(property.category).toBe('amazing_views');
      });
    });

    it('should filter by location', async () => {
      const response = await request(app)
        .get('/api/properties?location=Bangalore')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(property => {
        expect(property.location.toLowerCase()).toContain('bangalore');
      });
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/properties?minPrice=2000&maxPrice=3000')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(property => {
        expect(property.price).toBeGreaterThanOrEqual(2000);
        expect(property.price).toBeLessThanOrEqual(3000);
      });
    });

    it('should filter by minimum rating', async () => {
      const response = await request(app)
        .get('/api/properties?minRating=4.8')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(property => {
        expect(property.rating).toBeGreaterThanOrEqual(4.8);
      });
    });

    it('should search properties', async () => {
      const response = await request(app)
        .get('/api/properties?search=Bangalore')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.filters.search).toBe('Bangalore');
      response.body.data.forEach(property => {
        const searchTerm = 'bangalore';
        const matches = 
          property.title.toLowerCase().includes(searchTerm) ||
          property.location.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm) ||
          property.category.toLowerCase().includes(searchTerm);
        expect(matches).toBe(true);
      });
    });
  });

  // Test search endpoint
  describe('GET /api/properties/search', () => {
    it('should search properties by query', async () => {
      const response = await request(app)
        .get('/api/properties/search?q=Bangalore')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('query', 'Bangalore');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 400 if no query provided', async () => {
      const response = await request(app)
        .get('/api/properties/search')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Search query is required');
    });

    it('should search by title, location, description, and category', async () => {
      const response = await request(app)
        .get('/api/properties/search?q=2BHK')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(property => {
        const searchTerm = '2bhk';
        const matches = 
          property.title.toLowerCase().includes(searchTerm) ||
          property.location.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm) ||
          property.category.toLowerCase().includes(searchTerm);
        expect(matches).toBe(true);
      });
    });
  });

  // Test property by ID endpoint
  describe('GET /api/properties/:id', () => {
    it('should return a specific property', async () => {
      const response = await request(app)
        .get('/api/properties/1')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', '1');
    });

    it('should return 404 for non-existent property', async () => {
      const response = await request(app)
        .get('/api/properties/999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Property not found');
    });
  });

  // Test properties by category endpoint
  describe('GET /api/properties/category/:category', () => {
    it('should return properties by category', async () => {
      const response = await request(app)
        .get('/api/properties/category/amazing_views')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('category', 'amazing_views');
      expect(response.body).toHaveProperty('count');
      response.body.data.forEach(property => {
        expect(property.category).toBe('amazing_views');
      });
    });

    it('should return empty array for non-existent category', async () => {
      const response = await request(app)
        .get('/api/properties/category/non_existent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });

  // Test properties by location endpoint
  describe('GET /api/properties/location/:location', () => {
    it('should return properties by location', async () => {
      const response = await request(app)
        .get('/api/properties/location/Bangalore')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('location', 'Bangalore');
      response.body.data.forEach(property => {
        expect(property.location.toLowerCase()).toContain('bangalore');
      });
    });
  });

  // Test categories endpoint
  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check that categories are unique
      const uniqueCategories = [...new Set(response.body.data)];
      expect(uniqueCategories.length).toBe(response.body.data.length);
    });
  });

  // Test 404 handler
  describe('GET /api/non-existent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .get('/api/properties?minPrice=invalid')
        .expect(200);

      // Should still return results, ignoring invalid filter
      expect(response.body).toHaveProperty('success', true);
    });
  });
});
