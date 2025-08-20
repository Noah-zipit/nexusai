const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to add a unique request ID to each request
 */
const requestId = (req, res, next) => {
  // Generate a unique ID for this request
  const id = uuidv4();
  req.id = id;
  
  // Add the ID as a response header
  res.setHeader('X-Request-ID', id);
  
  next();
};

module.exports = requestId;