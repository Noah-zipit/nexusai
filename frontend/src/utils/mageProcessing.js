 /**
 * Resize an image file to specified dimensions
 * @param {File|Blob} file - Image file to resize
 * @param {Object} options - Resize options
 * @returns {Promise<string>} - Base64 data URL of resized image
 */
export async function resizeImage(file, options = {}) {
  // Default options
  const defaults = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
    format: 'image/jpeg'
  };
  
  const settings = { ...defaults, ...options };
  
  return new Promise((resolve, reject) => {
    // Create file reader to read the file
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > settings.maxWidth) {
          height = (settings.maxWidth / width) * height;
          width = settings.maxWidth;
        }
        
        if (height > settings.maxHeight) {
          width = (settings.maxHeight / height) * width;
          height = settings.maxHeight;
        }
        
        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL(settings.format, settings.quality);
        
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 data URL to a Blob
 * @param {string} base64Data - Base64 data URL
 * @returns {Blob} - Blob object
 */
export function dataURLtoBlob(base64Data) {
  // Split the base64 string into data and content parts
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Check if an image file exceeds size limits
 * @param {File} file - Image file to check
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} - True if file is too large
 */
export function isImageTooLarge(file, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size > maxSizeBytes;
}

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid image
 */
export function isValidImageType(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}