 <script>
  import { themeStore, themePresets, setAccentColor } from '../../stores/theme';
  
  let isOpen = false;
  
  function toggleOpen() {
    isOpen = !isOpen;
  }
  
  function selectTheme(theme) {
    setAccentColor(theme);
    isOpen = false;
  }
</script>

<div class="theme-picker">
  <button 
    class="theme-button" 
    on:click={toggleOpen}
    style="--button-color: {$themeStore.accentColor}"
    aria-label="Change theme color"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="theme-dropdown" transition:slide={{ duration: 150, y: -5 }}>
      <div class="themes-grid">
        {#each themePresets as theme}
          <button 
            class="color-option" 
            style="--color-primary: {theme.primary}; --color-secondary: {theme.secondary}"
            on:click={() => selectTheme(theme)}
            aria-label="Select {theme.name} theme"
          >
            <div class="color-preview"></div>
            <span class="color-name">{theme.name}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .theme-picker {
    position: relative;
  }
  
  .theme-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--button-color);
    color: white;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
  }
  
  .theme-button:hover {
    transform: scale(1.1);
  }
  
  .theme-dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background-color: var(--bg-secondary);
    border-radius: 0.5rem;
    padding: 0.75rem;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color);
    z-index: 100;
  }
  
  .themes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    background: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .color-option:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--border-color);
  }
  
  .color-preview {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  }
  
  .color-name {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
</style>