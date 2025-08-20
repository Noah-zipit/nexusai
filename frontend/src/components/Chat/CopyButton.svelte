 <script>
  export let text = '';
  
  let copied = false;
  let copyTimeout;
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      
      // Reset after 2 seconds
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
</script>

<button class="copy-button" on:click={copyToClipboard} aria-label={copied ? 'Copied' : 'Copy to clipboard'}>
  {#if copied}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
    <span class="tooltip">Copied!</span>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span class="tooltip">Copy</span>
  {/if}
</button>

<style>
  .copy-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-secondary);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }
  
  .copy-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
  
  .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
  }
  
  .copy-button:hover .tooltip {
    opacity: 1;
  }
  
  /* Animation for copy success */
  .copy-button svg {
    transition: transform 0.2s ease;
  }
  
  .copy-button:active svg {
    transform: scale(0.9);
  }
</style>