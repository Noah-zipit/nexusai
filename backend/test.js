// test.js
const axios = require('axios');

// Test each API endpoint directly
async function testAPI(name, endpoint, query = 'hello world') {
  console.log(`\n----- Testing ${name} API -----`);
  try {
    const url = `${endpoint}/?q=${encodeURIComponent(query)}`;
    console.log(`Request URL: ${url}`);
    
    const response = await axios.get(url);
    
    console.log('Response type:', typeof response.data);
    console.log('Is array?', Array.isArray(response.data));
    
    if (typeof response.data === 'object' && !Array.isArray(response.data)) {
      console.log('Object keys:', Object.keys(response.data));
      
      // Try to extract string content based on common patterns
      const possibleContentFields = ['content', 'message', 'text', 'response', 'answer', 'result'];
      for (const field of possibleContentFields) {
        if (response.data[field]) {
          console.log(`Found content in field '${field}':`, response.data[field].substring(0, 100) + '...');
        }
      }
    } else if (typeof response.data === 'string') {
      console.log('String content:', response.data.substring(0, 100) + '...');
    } else {
      console.log('Raw data:', response.data);
    }
  } catch (error) {
    console.error(`Error testing ${name}:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Test all endpoints
async function runTests() {
  const endpoints = {
    'ChatGPT': 'https://ab-chatgpt4o.abrahamdw882.workers.dev',
    'Blackbox': 'https://ab-blackboxai-search.abrahamdw882.workers.dev',
    'DeepSeek': 'https://ab-deepseekai.abrahamdw882.workers.dev',
    'BIT Master': 'https://ab-tech-ai.abrahamdw882.workers.dev'
  };
  
  for (const [name, endpoint] of Object.entries(endpoints)) {
    await testAPI(name, endpoint);
  }
}

runTests();