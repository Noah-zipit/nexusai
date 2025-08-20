 const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config/config');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// API proxy middleware
const apiProxy = createProxyMiddleware({
  target: 'https://api.closerouter.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v1' // Rewrite path from /api to /v1
  },
  onProxyReq: (proxyReq) => {
    // Add the API key to outgoing requests
    proxyReq.setHeader('Authorization', `Bearer ${config.apiKey}`);
    logger.debug(`Proxying request to ${proxyReq.path}`);
  },
  logProvider: () => logger
});

// Apply proxy to all API routes
router.use('/', apiProxy);

// Add some custom API endpoints

// API status endpoint
router.get('/status', asyncHandler(async (req, res) => {
  res.json({
    status: 'operational',
    version: require('../package.json').version,
    timestamp: new Date().toISOString()
  });
}));

// Usage metrics (mock for now)
router.get('/usage', asyncHandler(async (req, res) => {
  res.json({
    dailyRequests: 0,
    monthlyRequests: 0,
    limit: 100,
    resetTime: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
  });
}));

module.exports = router;