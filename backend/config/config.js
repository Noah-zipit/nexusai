 require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  apiKey: process.env.CLOSEROUTER_API_KEY,
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes by default
    max: process.env.RATE_LIMIT_MAX || 50, // 50 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests, please try again later.' }
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
  }
};

// Ensure API key is set
if (!config.apiKey) {
  console.error('CLOSEROUTER_API_KEY is required but not set');
  process.exit(1);
}

module.exports = config;