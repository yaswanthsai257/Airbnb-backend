const http = require('http');

// Test the API endpoints
const testAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      
      // Test properties endpoint
      testProperties();
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

const testProperties = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/properties',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\nProperties API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log(`Found ${response.data.length} properties`);
      console.log('First property:', response.data[0]?.title);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

// Wait a moment for server to start, then test
setTimeout(testAPI, 2000);
