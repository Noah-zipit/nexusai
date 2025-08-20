 import { writable } from 'svelte/store';

const defaultTheme = {
  darkMode: true,
  accentColor: '#4d61fc',
  accentColorSecondary: '#6979ff'
};

// Load theme from localStorage if available
const storedTheme = localStorage.getItem('nexusai-theme');
const initialTheme = storedTheme ? JSON.parse(storedTheme) : defaultTheme;

export const themeStore = writable(initialTheme);

// Subscribe to changes and save to localStorage
themeStore.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('nexusai-theme', JSON.stringify(value));
    
    // Update CSS variables
    document.documentElement.style.setProperty('--accent-color', value.accentColor);
    document.documentElement.style.setProperty('--accent-color-secondary', value.accentColorSecondary);
  }
});

// Theme presets
export const themePresets = [
  { name: 'Blue', primary: '#4d61fc', secondary: '#6979ff' },
  { name: 'Purple', primary: '#8854d0', secondary: '#a55eea' },
  { name: 'Green', primary: '#26de81', secondary: '#2bcbba' },
  { name: 'Orange', primary: '#fd9644', secondary: '#fa8231' },
  { name: 'Pink', primary: '#fc5c9c', secondary: '#fd79a8' }
];

export function setAccentColor(color) {
  themeStore.update(theme => {
    return { ...theme, accentColor: color.primary, accentColorSecondary: color.secondary };
  });
}