const request = require('supertest');
const app = require('../server');

describe('Frontend-Backend Integration Tests', () => {
  
  describe('Search Functionality Integration', () => {
    it('should handle search queries from frontend search bar', async () => {
      const searchQueries = [
        'Bangalore',
        '2BHK',
        'Mumbai',
        'beachfront',
        'amazing_views'
      ];

      for (const query of searchQueries) {
        const response = await request(app)
          .get(`/api/properties/search?q=${encodeURIComponent(query)}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('query', query);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });

    it('should handle combined search and filter requests', async () => {
      const response = await request(app)
        .get('/api/properties?search=Bangalore&category=amazing_views&minPrice=2000&maxPrice=3000')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.filters.search).toBe('Bangalore');
      expect(response.body.filters.category).toBe('amazing_views');
      expect(response.body.filters.minPrice).toBe('2000');
      expect(response.body.filters.maxPrice).toBe('3000');

      // All returned properties should match all filters
      response.body.data.forEach(property => {
        expect(property.category).toBe('amazing_views');
        expect(property.price).toBeGreaterThanOrEqual(2000);
        expect(property.price).toBeLessThanOrEqual(3000);
        
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

  describe('Map Integration Tests', () => {
    it('should return properties with valid coordinates for map display', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      response.body.data.forEach(property => {
        expect(property).toHaveProperty('coordinates');
        expect(property.coordinates).toHaveProperty('lat');
        expect(property.coordinates).toHaveProperty('lng');
        expect(typeof property.coordinates.lat).toBe('number');
        expect(typeof property.coordinates.lng).toBe('number');
        
        // Coordinates should be valid for India
        expect(property.coordinates.lat).toBeGreaterThan(6);
        expect(property.coordinates.lat).toBeLessThan(37);
        expect(property.coordinates.lng).toBeGreaterThan(68);
        expect(property.coordinates.lng).toBeLessThan(97);
      });
    });

    it('should return properties with price information for map markers', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      response.body.data.forEach(property => {
        expect(property).toHaveProperty('price');
        expect(typeof property.price).toBe('number');
        expect(property.price).toBeGreaterThan(0);
      });
    });
  });

  describe('Property Detail Page Integration', () => {
    it('should return complete property data for detail page', async () => {
      const response = await request(app)
        .get('/api/properties/1')
        .expect(200);

      const property = response.body.data;
      
      // Check all required fields for property detail page
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('title');
      expect(property).toHaveProperty('location');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('rating');
      expect(property).toHaveProperty('images');
      expect(property).toHaveProperty('description');
      expect(property).toHaveProperty('amenities');
      expect(property).toHaveProperty('host');
      expect(property).toHaveProperty('coordinates');
      
      // Check images array
      expect(Array.isArray(property.images)).toBe(true);
      expect(property.images.length).toBeGreaterThan(0);
      
      // Check amenities array
      expect(Array.isArray(property.amenities)).toBe(true);
      expect(property.amenities.length).toBeGreaterThan(0);
      
      // Check host object
      expect(property.host).toHaveProperty('name');
      expect(property.host).toHaveProperty('avatar');
      expect(property.host).toHaveProperty('rating');
    });
  });

  describe('Filter Integration Tests', () => {
    it('should handle price range filter from frontend', async () => {
      const priceRanges = [
        { min: 1000, max: 2000 },
        { min: 2000, max: 3000 },
        { min: 3000, max: 5000 },
        { min: 5000, max: 10000 }
      ];

      for (const range of priceRanges) {
        const response = await request(app)
          .get(`/api/properties?minPrice=${range.min}&maxPrice=${range.max}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        response.body.data.forEach(property => {
          expect(property.price).toBeGreaterThanOrEqual(range.min);
          expect(property.price).toBeLessThanOrEqual(range.max);
        });
      }
    });

    it('should handle category filter from frontend', async () => {
      const categories = [
        'amazing_views',
        'chefs_kitchens',
        'beachfront',
        'mansions',
        'tiny_homes',
        'treehouses',
        'countryside',
        'trending'
      ];

      for (const category of categories) {
        const response = await request(app)
          .get(`/api/properties?category=${category}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        response.body.data.forEach(property => {
          expect(property.category).toBe(category);
        });
      }
    });

    it('should handle location filter from frontend', async () => {
      const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai'];

      for (const location of locations) {
        const response = await request(app)
          .get(`/api/properties?location=${location}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        response.body.data.forEach(property => {
          expect(property.location.toLowerCase()).toContain(location.toLowerCase());
        });
      }
    });
  });

  describe('Pagination Integration', () => {
    it('should handle pagination requests from frontend', async () => {
      const response = await request(app)
        .get('/api/properties?page=1&limit=5')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should return correct pagination metadata', async () => {
      const response = await request(app)
        .get('/api/properties?page=2&limit=3')
        .expect(200);

      const pagination = response.body.pagination;
      expect(pagination).toHaveProperty('currentPage', 2);
      expect(pagination).toHaveProperty('itemsPerPage', 3);
      expect(pagination).toHaveProperty('totalItems');
      expect(pagination).toHaveProperty('totalPages');
      expect(pagination).toHaveProperty('hasNextPage');
      expect(pagination).toHaveProperty('hasPrevPage');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid property ID gracefully', async () => {
      const response = await request(app)
        .get('/api/properties/invalid-id')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Property not found');
    });

    it('should handle malformed filter parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/properties?minPrice=invalid&maxPrice=also-invalid')
        .expect(200);

      // Should still return results, ignoring invalid filters
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle empty search results gracefully', async () => {
      const response = await request(app)
        .get('/api/properties/search?q=nonexistentproperty12345')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data', []);
      expect(response.body).toHaveProperty('count', 0);
    });
  });

  describe('CORS Integration', () => {
    it('should include CORS headers for frontend requests', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      // CORS headers are set by the cors middleware
      expect(response.headers).toHaveProperty('vary');
      expect(response.headers.vary).toContain('Origin');
    });
  });

  describe('Performance Integration', () => {
    it('should respond to requests within reasonable time', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/properties')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Should respond within 1 second
      expect(responseTime).toBeLessThan(1000);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app).get('/api/properties')
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
      });
    });
  });
});
