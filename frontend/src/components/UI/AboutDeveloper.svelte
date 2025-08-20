<script>
  export let isOpen = false;
  export let onClose = () => {};
  
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
  
  function handleBackdropClick() {
    onClose();
  }
</script>

{#if isOpen}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="modal-header">
        <h2>About NexusAI</h2>
      </div>
      
      <div class="modal-body">
        <div class="dev-section">
          <h3>Developer</h3>
          <p>Noah</p>
          <p class="dev-contact">
            <a href="mailto:your-email@example.com">noahext994@gmail.com</a>
          </p>
          <p class="dev-website">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              github.com/noah-zipit
            </a>
          </p>
        </div>
        
        <div class="app-section">
          <h3>About the App</h3>
          <p>
            NexusAI is a multi-model AI chat application that provides access to
            leading AI models through a single, elegant interface.
          </p>
          <p>
            The application is built with Svelte and uses the CloseRouter API to
            connect with multiple AI providers.
          </p>
          <p>Version: 1.0.0</p>
        </div>
        
        <div class="tech-section">
          <h3>Technologies</h3>
          <ul>
            <li>Svelte & Vite</li>
            <li>Node.js & Express</li>
            <li>CloseRouter API</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  
  .modal-content {
    background-color: var(--bg-secondary);
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
  }
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 0.25rem;
    cursor: pointer;
    z-index: 10;
  }
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  h3 {
    font-size: 1.1rem;
    margin: 0 0 0.75rem 0;
    font-weight: 600;
  }
  
  p {
    margin: 0.5rem 0;
    line-height: 1.5;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
  
  .dev-contact, .dev-website {
    font-size: 0.9rem;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>