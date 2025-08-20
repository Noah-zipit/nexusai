<script>
  export let message = '';
  export let image = null;
  export let onSubmit;
  export let onImageSelect;
  export let onImageRemove;
  export let isLoading = false;
  export let showImageUpload = true;
  
  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }
</script>

<div class="input-area-wrapper">
  <div class="input-area">
    {#if image}
      <div class="image-preview">
        <img src={image} alt="Image to send" />
        <button class="remove-button" on:click={onImageRemove} aria-label="Remove image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    {/if}
    
    <div class="input-container">
      <textarea
        bind:value={message}
        on:keydown={handleKeydown}
        placeholder="Type a message..."
        disabled={isLoading}
        rows="1"
        class="message-input"
      ></textarea>
      
      <div class="input-actions">
        {#if showImageUpload}
          <label class="action-button" class:disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <input 
              type="file" 
              accept="image/*" 
              on:change={onImageSelect} 
              disabled={isLoading}
              style="display: none;"
            />
          </label>
        {/if}
        
        <button 
          class="send-button" 
          on:click={onSubmit} 
          disabled={isLoading || (!message.trim() && !image)}
          aria-label="Send message"
        >
          {#if isLoading}
            <div class="loading-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          {:else}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"></path>
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .input-area-wrapper {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    z-index: 1000;
    background-color: var(--bg-color, #1a1a2e);
  }
  
  .input-area {
    background-color: var(--bg-secondary, #252547);
    border: 1px solid var(--border-color, #333366);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 20px var(--shadow-color, rgba(0,0,0,0.3));
    position: relative;
    z-index: 10;
  }
  
  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .remove-button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bg-tertiary, #2a2a5a);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color, #333366);
    padding: 0;
    color: var(--text-primary, #ffffff);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  
  .input-container {
    display: flex;
    background-color: var(--bg-tertiary, #2a2a5a);
    border: 1px solid var(--border-color, #333366);
    border-radius: 4px;
    overflow: hidden;
    align-items: center;
  }
  
  .message-input {
    flex: 1;
    border: none;
    padding: 0.75rem 1rem;
    min-height: 50px;
    max-height: 150px;
    resize: none;
    background-color: transparent;
    color: var(--text-primary, #ffffff);
    font-size: 16px;
  }
  
  .message-input:focus {
    outline: none;
  }
  
  .input-actions {
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
    gap: 0.5rem;
  }
  
  .action-button, .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    border-radius: 4px;
    background: transparent;
    border: none;
    color: var(--text-secondary, #aaaadd);
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .action-button:hover, .send-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary, #ffffff);
  }
  
  .send-button {
    color: var(--accent-color, #5c6cff);
  }
  
  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .dot {
    width: 4px;
    height: 4px;
    background-color: var(--accent-color, #5c6cff);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  /* Added fallback values for CSS variables in case they don't load properly */
  
  @media (max-width: 768px) {
    .input-area-wrapper {
      padding: 5px;
    }
    
    .input-area {
      padding: 0.75rem;
      border-radius: 6px;
    }
  }
</style>
