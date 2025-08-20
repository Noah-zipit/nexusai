import App from './App.svelte';
import './styles/global.css';
import './styles/mobile-fix.css'; // Add this line

const app = new App({
  target: document.getElementById('app'),
});

export default app;
