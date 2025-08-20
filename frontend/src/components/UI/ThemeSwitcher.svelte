<script>
  import { themeStore, THEMES } from '../../stores/ui';
  
  const themes = Object.values(THEMES);
</script>

<div class="theme-switcher">
  <h3 class="switcher-title">Appearance</h3>
  
  <div class="theme-options">
    {#each themes as theme}
      <button 
        class="theme-option" 
        class:active={$themeStore.current.id === theme.id}
        on:click={() => themeStore.setTheme(theme.id)}
        style="--theme-bg: {theme.colors.bgSecondary}; --theme-accent: {theme.colors.accent}"
      >
        <div class="theme-preview">
          <div class="preview-header"></div>
          <div class="preview-content">
            <div class="preview-item"></div>
            <div class="preview-item"></div>
          </div>
        </div>
        <span class="theme-name">{theme.name}</span>
      </button>
    {/each}
  </div>
  
  <div class="display-options">
    <button 
      class="display-option" 
      class:active={$themeStore.compactMode}
      on:click={() => themeStore.toggleCompactMode()}
    >
      <span class="option-icon">
        {#if $themeStore.compactMode}
          <!-- Checked icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else}
          <!-- Unchecked icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        {/if}
      </span>
      <span>Compact Mode</span>
    </button>
  </div>
</div>

<style>
  .theme-switcher {
    margin-bottom: 1rem;
  }
  
  .switcher-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
  
  .theme-options {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .theme-option {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    min-width: 65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .theme-option:hover {
    border-color: var(--accent);
  }
  
  .theme-option.active {
    border-color: var(--accent);
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .theme-preview {
    width: 100%;
    height: 40px;
    border-radius: 3px;
    overflow: hidden;
    background-color: var(--theme-bg);
    display: flex;
    flex-direction: column;
  }
  
  .preview-header {
    height: 8px;
    background-color: var(--theme-accent);
    opacity: 0.8;
  }
  
  .preview-content {
    flex: 1;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .preview-item {
    height: 4px;
    border-radius: 2px;
    background-color: var(--theme-accent);
    opacity: 0.5;
  }
  
  .theme-name {
    font-size: 0.75rem;
    color: var(--text-primary);
  }
  
  .display-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .display-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .display-option:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .display-option.active {
    border-color: var(--accent);
  }
  
  .option-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
  }
</style>