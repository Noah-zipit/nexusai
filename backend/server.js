const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const NodeCache = require('node-cache');
require('dotenv').config();

// Create agents with keep-alive for connection pooling
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

// Create axios instance with connection pooling and timeouts
const axios = require('axios').create({
  httpAgent,
  httpsAgent,
  timeout: 15000 // 15 second timeout
});

// Create cache with 5-minute TTL
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Model endpoint mapping
const API_ENDPOINTS = {
  'chatgpt': 'https://ab-chatgpt4o.abrahamdw882.workers.dev',
  'blackbox-search': 'https://ab-blackboxai-search.abrahamdw882.workers.dev',
  'deepseek': 'https://ab-deepseekai.abrahamdw882.workers.dev',
  'bit-master': 'https://ab-tech-ai.abrahamdw882.workers.dev',
  'text-to-speech': 'https://ab-text-voice.abrahamdw882.workers.dev'
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper functions for each API format - Updated based on test results
function extractChatGPTResponse(data) {
  if (typeof data === 'string') return data;
  
  // From test results: ChatGPT API has keys ['status', 'data', 'log']
  if (data && data.data) {
    return String(data.data);
  }
  
  return "No readable response from ChatGPT API";
}

function extractDeepSeekResponse(data) {
  if (typeof data === 'string') return data;
  
  // From test results: DeepSeek API has keys ['response', 'founder']
  if (data && data.response) {
    const fullResponse = String(data.response);
    
    // Check if the response contains the thinking pattern
    // Pattern: Thinking followed by actual response
    const thinkingPattern = /\.\s+([^.!?]+[.!?])$/;
    const match = fullResponse.match(thinkingPattern);
    
    if (match && match[1]) {
      // Return only the actual response part
      return match[1].trim();
    }
    
    // Alternative approach: split by sentences and take the last one
    const sentences = fullResponse.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      // Return only the last sentence, which is typically the actual response
      return sentences[sentences.length - 1];
    }
    
    return fullResponse;
  }
  
  return "No readable response from DeepSeek API";
}

function extractBITMasterResponse(data) {
  if (typeof data === 'string') return data;
  
  // From test results: BIT Master API has keys ['success', 'response', 'usage', 'id']
  if (data && data.response) {
    return String(data.response);
  }
  
  return "No readable response from BIT Master API";
}

function extractBlackboxResponse(data) {
  if (typeof data === 'string') return data;
  
  // From test results: Blackbox API has keys ['search', 'text']
  if (data && data.text) {
    return String(data.text);
  }
  
  return "No readable response from Blackbox API";
}

// Unified chat completions endpoint with caching
app.post('/api/chat/completions', async (req, res) => {
  try {
    const { model, messages, temperature } = req.body;
    
    console.log(`Processing request for model: ${model}`);
    console.log('Received messages:', JSON.stringify(messages));
    
    // Get last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'No valid user message found' });
    }
    
    const userQuery = lastMessage.content;
    console.log(`User query: "${userQuery}"`); // Log the exact query
    
    // Determine which API to use based on model ID
    const modelType = model.split('/')[0];
    const apiEndpoint = API_ENDPOINTS[modelType];
    
    if (!apiEndpoint) {
      return res.status(404).json({ error: `API endpoint for model ${modelType} not found` });
    }
    
    // Create a cache key that includes the specific query
    const cacheKey = `${modelType}_${userQuery}`;
    
    // Check if we have a cached response
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Returning cached response for:', cacheKey);
      return res.json(cachedResponse);
    }
    
    // Make request to appropriate API with the user's actual message
    console.log(`Calling API: ${apiEndpoint}/?q=${encodeURIComponent(userQuery)}`);
    const startTime = Date.now();
    const response = await axios.get(`${apiEndpoint}/?q=${encodeURIComponent(userQuery)}`);
    const apiTime = Date.now() - startTime;
    console.log(`API responded in ${apiTime}ms`);
    
    // Extract content based on API type
    let responseContent;
    
    switch(modelType) {
      case 'chatgpt':
        responseContent = extractChatGPTResponse(response.data);
        break;
      case 'deepseek':
        responseContent = extractDeepSeekResponse(response.data);
        break;
      case 'bit-master':
        responseContent = extractBITMasterResponse(response.data);
        break;
      case 'blackbox-search':
        responseContent = extractBlackboxResponse(response.data);
        break;
      default:
        responseContent = "Unsupported model type";
    }
    
    console.log('Extracted content:', responseContent.substring(0, 100));
    
    // Format response to match OpenAI format expected by frontend
    const formattedResponse = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseContent
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: userQuery.length / 4,
        completion_tokens: responseContent.length / 4,
        total_tokens: (userQuery.length + responseContent.length) / 4
      }
    };
    
    // Cache the response
    apiCache.set(cacheKey, formattedResponse);
    
    res.json(formattedResponse);
  } catch (error) {
    console.error('API error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.status(500).json({ 
      error: 'Error processing request',
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Concurrent requests to multiple models
app.post('/api/concurrent-chat', async (req, res) => {
  try {
    const { query, models } = req.body;
    
    if (!query || !models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    
    // Make parallel requests to all specified models
    const requests = models.map(modelId => {
      const modelType = modelId.split('/')[0];
      const apiEndpoint = API_ENDPOINTS[modelType];
      
      if (!apiEndpoint) return Promise.resolve({ modelId, error: 'Invalid model' });
      
      // Check cache first
      const cacheKey = `${modelType}_${query.substring(0, 100)}`;
      const cachedContent = apiCache.get(cacheKey);
      if (cachedContent) {
        return Promise.resolve({
          modelId,
          content: cachedContent.choices[0].message.content,
          cached: true
        });
      }
      
      return axios.get(`${apiEndpoint}/?q=${encodeURIComponent(query)}`)
        .then(response => {
          // Extract content based on model type
          let content;
          switch(modelType) {
            case 'chatgpt': content = extractChatGPTResponse(response.data); break;
            case 'deepseek': content = extractDeepSeekResponse(response.data); break;
            case 'bit-master': content = extractBITMasterResponse(response.data); break;
            case 'blackbox-search': content = extractBlackboxResponse(response.data); break;
            default: content = "Unsupported model";
          }
          
          // Cache the result
          apiCache.set(cacheKey, {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: modelId,
            choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }]
          });
          
          return { modelId, content };
        })
        .catch(error => ({ modelId, error: error.message }));
    });
    
    // Wait for all requests to complete
    const results = await Promise.all(requests);
    
    res.json({ results });
  } catch (error) {
    console.error('Concurrent API error:', error);
    res.status(500).json({ error: 'Error processing concurrent requests' });
  }
});

// Text to speech endpoint
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const response = await axios.get(`${API_ENDPOINTS['text-to-speech']}/?q=${encodeURIComponent(text)}&voicename=${voice || 'jane'}`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Text-to-speech API error:', error);
    res.status(500).json({ error: 'Error generating speech' });
  }
});

// Vision API endpoint (placeholder)
app.post('/api/vision', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image data in request' });
    }
    
    // Placeholder response
    res.json({
      choices: [
        {
          message: {
            content: "This is a placeholder image description. Please update with actual Meta Vision API."
          }
        }
      ]
    });
  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'NexusAI Backend',
    apis: Object.keys(API_ENDPOINTS),
    timestamp: new Date().toISOString(),
    cache: {
      keys: apiCache.keys().length,
      stats: apiCache.getStats()
    }
  });
});

// Clear cache endpoint (admin use)
app.post('/api/admin/clear-cache', (req, res) => {
  const keyCount = apiCache.keys().length;
  apiCache.flushAll();
  res.json({ success: true, message: `Cleared ${keyCount} cache entries` });
});

// List available models endpoint
app.get('/api/models', (req, res) => {
  const models = [
    {
      id: 'chatgpt/gpt4o',
      name: 'GPT-4o',
      provider: 'ChatGPT'
    },
    {
      id: 'deepseek/deepseek',
      name: 'DeepSeek',
      provider: 'DeepSeek'
    },
    {
      id: 'bit-master/ai',
      name: 'BIT Master',
      provider: 'BIT'
    },
    {
      id: 'blackbox-search/ai',
      name: 'Blackbox',
      provider: 'SearchAI'
    }
  ];
  
  res.json({ models });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`
  🚀 NexusAI backend running on port ${PORT}
  🌐 Mode: ${process.env.NODE_ENV || 'development'}
  🔗 Connected APIs: ${Object.keys(API_ENDPOINTS).join(', ')}
  💾 Caching enabled: ${apiCache.options.stdTTL}s TTL
  `);
});