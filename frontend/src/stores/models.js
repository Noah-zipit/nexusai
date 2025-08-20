import { writable } from 'svelte/store';

// Define available models with your custom API model IDs
const availableModels = [
  {
    id: 'chatgpt/gpt4o',
    name: 'GPT-4o',
    provider: 'ChatGPT',
    accentColor: '#10a37f',
    features: {
      imageInput: false
    },
    description: 'Advanced AI model for text generation'
  },
  {
    id: 'deepseek/deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    accentColor: '#6d28d9',
    features: {
      imageInput: false
    },
    description: 'Specialized AI with technical knowledge'
  },
  {
    id: 'bit-master/ai',
    name: 'BIT Master',
    provider: 'BIT',
    accentColor: '#3b82f6',
    features: {
      imageInput: false
    },
    description: 'Versatile AI assistant'
  },
  {
    id: 'blackbox-search/ai',
    name: 'Blackbox',
    provider: 'SearchAI',
    accentColor: '#ff4c4c',
    features: {
      imageInput: false
    },
    description: 'AI with web search capabilities'
  }
];

// Create the store
function createModelStore() {
  const { subscribe, update, set } = writable({
    models: availableModels,
    active: availableModels[0].id
  });
  
  return {
    subscribe,
    setActiveModel: (modelId) => update(state => {
      if (state.models.some(m => m.id === modelId)) {
        return { ...state, active: modelId };
      }
      return state;
    }),
    set
  };
}

export const modelStore = createModelStore();

// Helper to get active model
export function setActiveModel(modelId) {
  modelStore.setActiveModel(modelId);
}