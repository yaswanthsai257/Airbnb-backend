# Airbnb Clone Backend Tests

This directory contains comprehensive tests for the Airbnb Clone backend API.

## Test Structure

### 1. API Tests (`api.test.js`)
Tests all API endpoints and their functionality:
- Health check endpoint
- Properties listing with filtering and pagination
- Search functionality
- Property detail retrieval
- Category and location filtering
- Error handling

### 2. Data Tests (`data.test.js`)
Validates the properties JSON data structure:
- File existence and readability
- JSON validity
- Required field presence
- Data type validation
- Business logic validation (price ranges, ratings, coordinates)
- Data integrity (unique IDs, valid categories, Indian cities)

### 3. Integration Tests (`integration.test.js`)
Tests frontend-backend integration scenarios:
- Search functionality integration
- Map integration with coordinates
- Property detail page integration
- Filter integration
- Pagination integration
- Error handling integration
- CORS integration
- Performance testing

### 4. Frontend Integration Tests (`../__tests__/frontend-integration.test.js`)
Tests frontend-backend communication:
- Property service integration
- Search integration
- Filter integration
- Map integration
- Error handling with fallbacks

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# API tests only
npm run test:api

# Data validation tests only
npm run test:data

# Integration tests only
npm run test:integration
```

### Test Modes
```bash
# Watch mode (re-runs tests on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Verbose output
npm run test:verbose
```

## Test Coverage

The tests cover:
- ✅ All API endpoints
- ✅ Request/response validation
- ✅ Error handling
- ✅ Data validation
- ✅ Filtering and search
- ✅ Pagination
- ✅ CORS headers
- ✅ Performance
- ✅ Frontend integration
- ✅ Map integration
- ✅ Property detail integration

## Test Data

Tests use the actual `data/properties.json` file to ensure:
- Real data validation
- Accurate integration testing
- Production-like scenarios

## Mocking

Frontend integration tests use Jest's `fetch` mock to simulate:
- Successful API responses
- Network errors
- Malformed responses
- 404 errors

## Performance Testing

Integration tests include performance checks:
- Response time validation (< 1 second)
- Concurrent request handling
- Memory usage validation

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies
- Deterministic results
- Fast execution
- Clear error reporting

## Adding New Tests

When adding new features:

1. **API Tests**: Add endpoint tests to `api.test.js`
2. **Data Tests**: Add validation to `data.test.js` if data structure changes
3. **Integration Tests**: Add integration scenarios to `integration.test.js`
4. **Frontend Tests**: Add frontend integration tests to `frontend-integration.test.js`

## Test Best Practices

- Use descriptive test names
- Test both success and failure scenarios
- Validate response structure and data types
- Test edge cases and error conditions
- Keep tests independent and isolated
- Use meaningful assertions
- Mock external dependencies appropriately
