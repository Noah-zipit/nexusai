import axios from 'axios';

// Get the API URL from environment variables, with fallback
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Base API configuration with timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Track API usage statistics
let apiUsageStats = {
  remaining: 100,
  limit: 100,
  resetTime: 3600,
  history: []
};

/**
 * Get current API usage statistics
 */
export function getApiUsage() {
  return apiUsageStats;
}

/**
 * Send a chat message to the AI
 * @param {string} modelId - Model identifier
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - AI response
 */
export async function sendMessage(modelId, messages, options = {}) {
  try {
    console.log(`Sending message to ${modelId}:`, messages);
    
    // Check if we need to append /api to the endpoint
    const endpoint = API_URL.endsWith('/api') ? 
      '/chat/completions' : 
      '/api/chat/completions';
    
    console.log(`Using API endpoint: ${API_URL}${endpoint}`);
    
    const response = await api.post(endpoint, {
      model: modelId,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000
    });
    
    console.log('API response:', response.data);
    
    if (response.data?.choices?.[0]?.message?.content) {
      return {
        message: response.data.choices[0].message.content,
        usage: response.data.usage || { total_tokens: 0 },
        model: modelId
      };
    } else {
      // Handle non-standard response format
      const content = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data);
      
      return {
        message: content,
        usage: { total_tokens: content.length / 4 },
        model: modelId
      };
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    
    let errorMessage = 'Failed to communicate with AI model';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The server is taking too long to respond.';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Send a message with an image to the AI
 * @param {string} modelId - Model identifier
 * @param {Array} messages - Chat history
 * @param {string} imageBase64 - Base64-encoded image data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - AI response
 */
export async function sendMessageWithImage(modelId, messages, imageBase64, options = {}) {
  try {
    console.log(`Sending image message to ${modelId}:`, messages);
    
    // Check if we need to append /api to the endpoint
    const visionEndpoint = API_URL.endsWith('/api') ? 
      '/vision' : 
      '/api/vision';
    
    // First, analyze the image with vision API
    const visionResponse = await api.post(visionEndpoint, {
      image: imageBase64
    });
    
    // Get the image description
    const imageDescription = visionResponse.data?.choices?.[0]?.message?.content || 
                            'Image analysis not available';
    
    // Get the text message (last user message)
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content || '';
    
    // Combine them for a better prompt
    const combinedPrompt = `[Image analysis: ${imageDescription}] ${userQuery}`;
    
    // Now send this as a regular message
    const textMessages = [{ role: 'user', content: combinedPrompt }];
    
    return await sendMessage(modelId, textMessages, options);
  } catch (error) {
    console.error('Error in sendMessageWithImage:', error);
    
    // Fallback: If vision API fails, try to send just the text
    try {
      console.log('Vision API failed, trying text-only message');
      const lastMessage = messages[messages.length - 1];
      const userQuery = lastMessage.content || '';
      
      if (userQuery.trim()) {
        const textMessages = [{ role: 'user', content: userQuery }];
        return await sendMessage(modelId, textMessages, options);
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    throw new Error('Failed to process image: ' + (error.message || 'Unknown error'));
  }
}

// Response interceptor to capture rate limit information
api.interceptors.response.use(
  response => {
    // Update API usage stats if headers are present
    if (response.headers['x-ratelimit-remaining']) {
      apiUsageStats.remaining = parseInt(response.headers['x-ratelimit-remaining']);
    }
    if (response.headers['x-ratelimit-limit']) {
      apiUsageStats.limit = parseInt(response.headers['x-ratelimit-limit']);
    }
    if (response.headers['x-ratelimit-reset']) {
      apiUsageStats.resetTime = parseInt(response.headers['x-ratelimit-reset']);
    }
    
    // Add to history
    apiUsageStats.history.unshift({
      timestamp: new Date().toISOString(),
      endpoint: response.config.url,
      status: response.status,
      success: true
    });
    
    // Limit history size
    if (apiUsageStats.history.length > 20) {
      apiUsageStats.history.pop();
    }
    
    return response;
  },
  error => {
    // Add failed request to history
    if (error.config) {
      apiUsageStats.history.unshift({
        timestamp: new Date().toISOString(),
        endpoint: error.config.url,
        status: error.response?.status || 'network-error',
        success: false,
        error: error.message
      });
      
      // Limit history size
      if (apiUsageStats.history.length > 20) {
        apiUsageStats.history.pop();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
