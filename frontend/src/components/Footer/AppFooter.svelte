<script>
  import { onMount } from 'svelte';
  import AboutDeveloper from '../UI/AboutDeveloper.svelte';
  
  let showAbout = false;
  let year;
  
  onMount(() => {
    year = new Date().getFullYear();
  });
  
  function toggleAbout() {
    showAbout = !showAbout;
  }
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="copyright">
      © {year || '2025'} NexusAI
    </div>
    
    <div class="footer-links">
      <button class="footer-link" on:click={toggleAbout}>About Developer</button>
    </div>
  </div>
  
  <AboutDeveloper isOpen={showAbout} onClose={() => showAbout = false} />
</footer>

<style>
  .footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-primary);
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .copyright {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
  
  .footer-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .footer-link {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    cursor: pointer;
  }
  
  .footer-link:hover {
    color: var(--text-primary);
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .footer {
      padding: 1rem;
    }
  }
</style>