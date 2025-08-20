/**
 * Sets up handlers for keyboard showing/hiding
 * to ensure the input stays visible and content scrolls properly
 */
export function setupKeyboardHandling() {
  // Add a spacer element to the messages container
  addMessageSpacer();
  
  // Set up visual viewport handlers if available
  setupVisualViewport();
  
  // Set up input focus handlers
  setupInputHandlers();
}

/**
 * Adds a spacer div to the bottom of messages to prevent content
 * from being hidden behind the input area
 */
function addMessageSpacer() {
  setTimeout(() => {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
      // Check if spacer already exists
      let spacer = messagesContainer.querySelector('.message-spacer');
      
      if (!spacer) {
        spacer = document.createElement('div');
        spacer.className = 'message-spacer';
        messagesContainer.appendChild(spacer);
      }
    }
  }, 100);
}

/**
 * Sets up Visual Viewport API listeners to handle keyboard
 */
function setupVisualViewport() {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      // Scroll to bottom when keyboard opens
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
      }
    });
  }
}

/**
 * Sets up input focus handlers to improve keyboard interaction
 */
function setupInputHandlers() {
  // When input is focused, scroll to bottom
  document.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('message-input')) {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 300);
      }
    }
  });
}
