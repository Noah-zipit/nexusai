/**
 * Middleware to set cache control headers
 * @param {Object} options - Cache control options
 */
module.exports = function cacheControl(options = {}) {
  const defaultOptions = {
    noStore: false,
    maxAge: 0,
    private: false
  };
  
  const config = { ...defaultOptions, ...options };
  
  return (req, res, next) => {
    // Set Cache-Control header
    if (config.noStore) {
      // No caching
      res.setHeader('Cache-Control', 'no-store');
    } else {
      // Configure caching
      const directives = [];
      
      if (config.private) {
        directives.push('private');
      } else {
        directives.push('public');
      }
      
      if (config.maxAge) {
        directives.push(`max-age=${config.maxAge}`);
      }
      
      res.setHeader('Cache-Control', directives.join(', '));
    }
    
    next();
  };
};