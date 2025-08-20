import App from './App.svelte';
import './styles/global.css';
import './styles/fix.css'; // Add our mobile fixes
import { inject } from '@vercel/analytics'; // Vercel Analytics

// Initialize Vercel Analytics
inject({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  debug: false
});

// Initialize app
const app = new App({
  target: document.getElementById('app'),
});

// Register service worker if available (for PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.log('Service worker registration failed:', error);
      });
  });
}

export default app;
