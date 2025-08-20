import { writable } from 'svelte/store';

// Create sidebar visibility store
export const sidebarVisible = writable(window.innerWidth > 768);

// Available themes
export const THEMES = {
  MIDNIGHT: {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      bgPrimary: '#0f0f0f',
      bgSecondary: '#121212',
      bgTertiary: '#1a1a1a',
      textPrimary: '#ffffff',
      textSecondary: '#999999',
      accent: '#7c4dff',
      border: '#2a2a2a'
    }
  },
  SLATE: {
    id: 'slate',
    name: 'Slate',
    colors: {
      bgPrimary: '#1e293b',
      bgSecondary: '#263449',
      bgTertiary: '#334155',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      accent: '#38bdf8',
      border: '#475569'
    }
  },
  NEUTRAL: {
    id: 'neutral',
    name: 'Neutral',
    colors: {
      bgPrimary: '#171717',
      bgSecondary: '#262626',
      bgTertiary: '#404040',
      textPrimary: '#fafafa',
      textSecondary: '#a3a3a3',
      accent: '#d4d4d4',
      border: '#525252'
    }
  }
};

// Create theme store
function createThemeStore() {
  const { subscribe, update, set } = writable({
    current: THEMES.MIDNIGHT,
    compactMode: false
  });
  
  return {
    subscribe,
    setTheme: (themeId) => update(state => {
      const newTheme = Object.values(THEMES).find(theme => theme.id === themeId);
      if (newTheme) {
        // Apply theme CSS variables
        const root = document.documentElement;
        Object.entries(newTheme.colors).forEach(([key, value]) => {
          // Convert camelCase to kebab-case for CSS variables
          const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          root.style.setProperty(`--${cssVar}`, value);
        });
        
        return { ...state, current: newTheme };
      }
      return state;
    }),
    toggleCompactMode: () => update(state => {
      const newState = { ...state, compactMode: !state.compactMode };
      document.documentElement.classList.toggle('compact-mode', newState.compactMode);
      return newState;
    }),
    initialize: () => update(state => {
      // Apply current theme on initialization
      const root = document.documentElement;
      Object.entries(state.current.colors).forEach(([key, value]) => {
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssVar}`, value);
      });
      
      // Apply compact mode if enabled
      document.documentElement.classList.toggle('compact-mode', state.compactMode);
      
      return state;
    })
  };
}

export const themeStore = createThemeStore();