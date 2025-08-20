import { writable, derived } from 'svelte/store';
import { modelStore } from './models';
import { sendMessage, sendMessageWithImage } from '../services/api';

// Initialize chat store
const initialState = {
  messages: {},  // Messages keyed by model ID
  loading: false,
  error: null
};

// Create the store
export const chatStore = writable(initialState);

// Derive active messages based on current model
export const activeMessages = derived(
  [chatStore, modelStore],
  ([$chatStore, $modelStore]) => {
    const modelId = $modelStore.active;
    return $chatStore.messages[modelId] || [];
  }
);

/**
 * Send a message to the AI
 * @param {string} content - Message content
 * @param {string} imageData - Base64 image data (optional)
 */
export async function sendChatMessage(content, imageData = null) {
  if (!content.trim() && !imageData) return;
  
  console.log(`Sending message: "${content}"`); // Log the exact message
  
  // Get current model
  let currentModel;
  modelStore.subscribe(state => {
    currentModel = state.models.find(m => m.id === state.active);
  })();
  
  const modelId = currentModel.id;
  
  // Add user message to chat
  const userMessage = {
    role: 'user',
    content: content, // Make sure we're using the provided content
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  addMessage(modelId, userMessage);
  
  // Set loading state
  setLoading(true);
  
  try {
    // Create a simple message array with just this message for testing
    const messages = [{ role: 'user', content: content }];
    
    console.log('Sending to API:', messages); // Log what we're sending
    
    // Call API
    let response;
    if (imageData && currentModel.features?.imageInput) {
      response = await sendMessageWithImage(modelId, messages, imageData);
    } else {
      response = await sendMessage(modelId, messages);
    }
    
    // Add AI response to chat
    const aiMessage = {
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      model: modelId
    };
    
    addMessage(modelId, aiMessage);
    
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Add error message to chat
    const errorMessage = {
      role: 'system',
      content: `Error: ${error.message}`,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      isError: true
    };
    
    addMessage(modelId, errorMessage);
    setError(error.message);
    
    throw error;
  } finally {
    setLoading(false);
  }
}

/**
 * Add a message to the chat store
 */
function addMessage(modelId, message) {
  chatStore.update(state => {
    // Get existing messages for this model
    const modelMessages = state.messages[modelId] || [];
    
    // Add new message
    return {
      ...state,
      messages: {
        ...state.messages,
        [modelId]: [...modelMessages, message]
      }
    };
  });
}

/**
 * Set loading state
 */
function setLoading(isLoading) {
  chatStore.update(state => ({
    ...state,
    loading: isLoading
  }));
}

/**
 * Set error state
 */
function setError(errorMessage) {
  chatStore.update(state => ({
    ...state,
    error: errorMessage
  }));
}

/**
 * Initialize chat store
 */
export function initializeChat() {
  // Load from localStorage if available
  try {
    const savedChat = localStorage.getItem('nexusai-chat');
    if (savedChat) {
      const parsedChat = JSON.parse(savedChat);
      chatStore.update(state => ({
        ...state,
        messages: parsedChat
      }));
    }
  } catch (error) {
    console.error('Failed to load chat from localStorage:', error);
  }
  
  // Subscribe to store changes to save to localStorage
  chatStore.subscribe(state => {
    try {
      localStorage.setItem('nexusai-chat', JSON.stringify(state.messages));
    } catch (error) {
      console.error('Failed to save chat to localStorage:', error);
    }
  });
}

/**
 * Clear chat for the current model
 */
export function clearChat() {
  let currentModelId;
  modelStore.subscribe(state => {
    currentModelId = state.active;
  })();
  
  chatStore.update(state => ({
    ...state,
    messages: {
      ...state.messages,
      [currentModelId]: []
    }
  }));
}

/**
 * Clear all chat history
 */
export function clearAllChats() {
  chatStore.update(state => ({
    ...state,
    messages: {}
  }));
  localStorage.removeItem('nexusai-chat');
}