import App from './App.svelte';
import './styles/global.css';
import './styles/mobile-fixes.css'; // Add this line
import { setupKeyboardHandling } from './utils/keyboard-handler'; // Add this line

const app = new App({
  target: document.getElementById('app'),
});

// Set up keyboard handling when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  setupKeyboardHandling();
});

export default app;
