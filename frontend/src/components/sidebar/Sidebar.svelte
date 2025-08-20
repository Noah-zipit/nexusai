<script>
  import { modelStore, setActiveModel } from '../../stores/models';
  import { sidebarVisible } from '../../stores/ui';
  import ThemeSwitcher from '../UI/ThemeSwitcher.svelte';
  
  function selectModel(modelId) {
    setActiveModel(modelId);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      sidebarVisible.set(false);
    }
  }
  
  let showAbout = false;
  
  function toggleAbout() {
    showAbout = !showAbout;
  }
</script>

<div class="sidebar">
  <div class="sidebar-section">
    <h2 class="section-title">AI Models</h2>
    <div class="models-list">
      {#each $modelStore.models as model}
        <button 
          class="model-button" 
          class:active={model.id === $modelStore.active}
          on:click={() => selectModel(model.id)}
        >
          <span class="model-icon" style="background-color: {model.accentColor || '#333'}">
            {model.name[0]}
          </span>
          <span class="model-name">{model.name}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="sidebar-section">
    <ThemeSwitcher />
  </div>
  
  <div class="sidebar-section">
    <h2 class="section-title">Options</h2>
    <div class="options-list">
      <button class="option-button" on:click={toggleAbout}>
        About Developer
      </button>
    </div>
  </div>
  
  <div class="sidebar-footer">
    <p>© 2025 NexusAI</p>
  </div>
</div>

{#if showAbout}
  <div class="about-modal">
    <div class="modal-content">
      <button class="close-button" on:click={toggleAbout}>×</button>
      <h2>About Developer</h2>
      
      <div class="dev-profile">
        <div class="dev-image">
          <img src="/images/noah-profile.jpg" alt="Noah" />
        </div>
        <div class="dev-info">
          <h3>Noah</h3>
          <p class="dev-title">Full-Stack Developer</p>
        </div>
      </div>
      
      <div class="dev-about">
        <p>Hi there! I'm a passionate developer with expertise in modern web technologies. I created NexusAI to provide an intuitive interface for working with various AI models.</p>
      </div>
      
      <div class="dev-links">
        <a href="https://github.com/noah-zipit" target="_blank" class="social-link github">
          <span class="icon">GitHub</span>
        </a>
        <a href="https://instagram.com/was.ash.enough" target="_blank" class="social-link instagram">
          <span class="icon">Instagram</span>
        </a>
      </div>
      
      <p class="version-info">Version 1.0.0</p>
    </div>
  </div>
{/if}

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
  }
  
  .sidebar-section {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
  
  .models-list, .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .model-button, .option-button {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background-color: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    text-align: left;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  
  .model-button:hover, .option-button:hover {
    background-color: var(--bg-tertiary);
  }
  
  .model-button.active {
    background-color: var(--bg-tertiary);
    border-color: var(--accent);
  }
  
  .model-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin-right: 0.75rem;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .model-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .sidebar-footer {
    margin-top: auto;
    padding-top: 1rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-align: center;
  }
  
  /* About modal */
  .about-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .modal-content {
    background-color: var(--bg-secondary);
    border-radius: 6px;
    padding: 1.5rem;
    position: relative;
    width: 90%;
    max-width: 400px;
  }
  
  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  /* Developer profile styles */
  .dev-profile {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }
  
  .dev-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1rem;
    border: 2px solid var(--accent);
  }
  
  .dev-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .dev-info h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .dev-title {
    margin: 0.2rem 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .dev-about {
    margin-bottom: 1.2rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-primary);
  }
  
  .dev-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }
  
  .social-link {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .github {
    background-color: #24292e;
    color: white;
  }
  
  .instagram {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    color: white;
  }
  
  .version-info {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 1rem;
    margin-bottom: 0;
  }
  
  /* Compact mode styles */
  :global(.compact-mode) .model-button, 
  :global(.compact-mode) .option-button {
    padding: 0.35rem 0.5rem;
    font-size: 0.85rem;
  }
  
  :global(.compact-mode) .model-icon {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
    font-size: 0.7rem;
  }
  
  :global(.compact-mode) .sidebar-section {
    margin-bottom: 1rem;
  }
</style>