const fs = require('fs');
const path = require('path');

describe('Data Loading Tests', () => {
  const dataPath = path.join(__dirname, '../data/properties.json');
  
  describe('Properties JSON File', () => {
    it('should exist and be readable', () => {
      expect(fs.existsSync(dataPath)).toBe(true);
    });

    it('should contain valid JSON', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      expect(() => JSON.parse(rawData)).not.toThrow();
    });

    it('should have the correct structure', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      expect(data).toHaveProperty('properties');
      expect(Array.isArray(data.properties)).toBe(true);
      expect(data.properties.length).toBeGreaterThan(0);
    });

    it('should have properties with required fields', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property, index) => {
        expect(property).toHaveProperty('id');
        expect(property).toHaveProperty('title');
        expect(property).toHaveProperty('location');
        expect(property).toHaveProperty('price');
        expect(property).toHaveProperty('rating');
        expect(property).toHaveProperty('coordinates');
        expect(property).toHaveProperty('images');
        expect(property).toHaveProperty('category');
        expect(property).toHaveProperty('description');
        expect(property).toHaveProperty('amenities');
        expect(property).toHaveProperty('host');
      });
    });

    it('should have valid property data types', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property) => {
        // Check data types
        expect(typeof property.id).toBe('string');
        expect(typeof property.title).toBe('string');
        expect(typeof property.location).toBe('string');
        expect(typeof property.price).toBe('number');
        expect(typeof property.rating).toBe('number');
        expect(typeof property.distance).toBe('number');
        expect(typeof property.availableDates).toBe('string');
        expect(typeof property.description).toBe('string');
        expect(typeof property.category).toBe('string');
        
        // Check arrays
        expect(Array.isArray(property.images)).toBe(true);
        expect(Array.isArray(property.amenities)).toBe(true);
        
        // Check objects
        expect(typeof property.coordinates).toBe('object');
        expect(typeof property.host).toBe('object');
        
        // Check coordinates structure
        expect(property.coordinates).toHaveProperty('lat');
        expect(property.coordinates).toHaveProperty('lng');
        expect(typeof property.coordinates.lat).toBe('number');
        expect(typeof property.coordinates.lng).toBe('number');
        
        // Check host structure
        expect(property.host).toHaveProperty('name');
        expect(property.host).toHaveProperty('avatar');
        expect(property.host).toHaveProperty('rating');
        expect(typeof property.host.name).toBe('string');
        expect(typeof property.host.avatar).toBe('string');
        expect(typeof property.host.rating).toBe('number');
      });
    });

    it('should have valid price ranges', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property) => {
        expect(property.price).toBeGreaterThan(0);
        expect(property.price).toBeLessThan(50000); // Reasonable upper limit
      });
    });

    it('should have valid ratings', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property) => {
        expect(property.rating).toBeGreaterThanOrEqual(0);
        expect(property.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have valid coordinates', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property) => {
        // Check if coordinates are within reasonable bounds for India
        expect(property.coordinates.lat).toBeGreaterThan(6); // Southern tip of India
        expect(property.coordinates.lat).toBeLessThan(37); // Northern tip of India
        expect(property.coordinates.lng).toBeGreaterThan(68); // Western tip of India
        expect(property.coordinates.lng).toBeLessThan(97); // Eastern tip of India
      });
    });

    it('should have unique property IDs', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      const ids = data.properties.map(property => property.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds.length).toBe(ids.length);
    });

    it('should have valid image URLs', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      data.properties.forEach((property) => {
        expect(property.images.length).toBeGreaterThan(0);
        property.images.forEach(imageUrl => {
          expect(typeof imageUrl).toBe('string');
          expect(imageUrl).toMatch(/^https?:\/\/.+/); // Should be a valid URL
        });
      });
    });

    it('should have valid categories', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      const validCategories = [
        'amazing_views',
        'chefs_kitchens',
        'beachfront',
        'mansions',
        'tiny_homes',
        'treehouses',
        'countryside',
        'trending'
      ];
      
      data.properties.forEach((property) => {
        expect(validCategories).toContain(property.category);
      });
    });

    it('should have Indian cities in locations', () => {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      const indianCities = [
        'Bangalore', 'Chennai', 'Hyderabad', 'Delhi', 'Mumbai', 'Pune',
        'Goa', 'Kochi', 'Puducherry', 'Gurgaon', 'Noida', 'Chandigarh',
        'Mysore', 'Coimbatore', 'Madurai', 'Ooty', 'Munnar', 'Kodaikanal',
        'Coorg', 'Udaipur', 'Shimla', 'Jaipur', 'Kolkata', 'Ahmedabad'
      ];
      
      data.properties.forEach((property) => {
        const hasIndianCity = indianCities.some(city => 
          property.location.includes(city)
        );
        expect(hasIndianCity).toBe(true);
      });
    });
  });
});
