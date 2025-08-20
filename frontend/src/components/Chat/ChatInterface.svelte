<script>
  import { onMount } from 'svelte';
  import { chatStore, activeMessages, sendChatMessage, initializeChat } from '../../stores/chat';
  import { modelStore } from '../../stores/models';
  import { themeStore } from '../../stores/ui';
  import SmartSuggestions from './SmartSuggestions.svelte';
  
  let messageInput = '';
  let imageFile = null;
  let scrollContainer;
  
  // Get active model info
  $: activeModel = $modelStore.models.find(m => m.id === $modelStore.active);
  
  // Auto-scroll to bottom when messages change
  $: if (activeMessages && scrollContainer) {
    setTimeout(() => {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, 50);
  }
  
  onMount(() => {
    initializeChat();
    themeStore.initialize();
  });
  
  async function handleSubmit() {
    if (!messageInput.trim() && !imageFile) return;
    
    const messageToSend = messageInput; // Store in a variable to ensure it doesn't get cleared too early
    console.log("Submitting message:", messageToSend);
    
    try {
      // Clear input field only after capturing the message
      messageInput = '';
      
      // Send the message
      await sendChatMessage(messageToSend, imageFile);
      
      // Clear image after sending
      imageFile = null;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  function handleSuggestionSelect(event) {
    messageInput = event.detail;
    // Auto-focus the input
    setTimeout(() => {
      document.querySelector('.message-input').focus();
    }, 10);
  }
  
  function handleImageSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageFile = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  function removeImage() {
    imageFile = null;
  }
</script>

<div class="chat-container" class:compact-mode={$themeStore.compactMode}>
  <div class="active-model">
    <span class="model-icon" style="background-color: {activeModel?.accentColor || '#333'}">
      {activeModel?.name?.[0] || 'A'}
    </span>
    <span class="model-name">{activeModel?.name || 'AI Model'}</span>
  </div>
  
  <div class="messages-container">
    <div class="messages" bind:this={scrollContainer}>
      {#each $activeMessages as message, i}
        <div class="message {message.role}">
          <div class="message-content">
            {#if typeof message.content === 'string'}
              {message.content}
            {:else if message.content === null || message.content === undefined}
              <em>No content</em>
            {:else}
              <pre>
                {JSON.stringify(message.content, null, 2)}
              </pre>
            {/if}
          </div>
          
          {#if message.role === 'assistant' && i === $activeMessages.length - 1 && !$chatStore.loading}
            <SmartSuggestions 
              message={message.content || ''} 
              loading={$chatStore.loading}
              on:select={handleSuggestionSelect}
            />
          {/if}
        </div>
      {/each}
      
      {#if $chatStore.loading}
        <div class="loading-message">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
          <p class="loading-text">Getting response from {activeModel?.name || 'AI'}...</p>
        </div>
      {/if}
      
      {#if $activeMessages.length === 0 && !$chatStore.loading}
        <div class="empty-state">
          <p>Start a conversation with the AI</p>
        </div>
      {/if}
    </div>
  </div>
  
  <div class="input-area">
    {#if imageFile}
      <div class="image-preview">
        <img src={imageFile} alt="Image to send" />
        <button class="remove-image" on:click={removeImage}>×</button>
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit}>
      <input
        class="message-input"
        type="text"
        bind:value={messageInput}
        placeholder="Type a message..."
        disabled={$chatStore.loading}
      />
      
      {#if activeModel?.features?.imageInput}
        <label class="image-button" class:disabled={$chatStore.loading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <input 
            type="file" 
            accept="image/*" 
            on:change={handleImageSelected} 
            disabled={$chatStore.loading}
            style="display: none;"
          />
        </label>
      {/if}
      
      <button 
        type="submit" 
        disabled={$chatStore.loading || (!messageInput.trim() && !imageFile)}
        class="send-button"
      >
        {#if $chatStore.loading}
          <span class="spinner"></span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"></path>
          </svg>
        {/if}
      </button>
    </form>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100px);
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }
  
  .active-model {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border, #333);
    margin-bottom: 0;
    flex-shrink: 0;
  }
  
  .model-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    margin-right: 0.75rem;
    font-weight: bold;
    font-size: 0.9rem;
    color: white;
  }
  
  .model-name {
    font-weight: 500;
  }
  
  .messages-container {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  .messages {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0.5rem 1rem;
    scroll-behavior: smooth;
  }
  
  .message {
    max-width: 85%;
    padding: 0.75rem;
    border-radius: 6px;
    animation: fadeIn 0.3s ease;
  }
  
  .message.user {
    background-color: var(--bg-tertiary, #1a1a1a);
    align-self: flex-end;
  }
  
  .message.assistant {
    background-color: var(--bg-secondary, #121212);
    align-self: flex-start;
    border: 1px solid var(--border, #333);
  }
  
  .message.system {
    background-color: var(--bg-tertiary, #1a1a1a);
    align-self: center;
    font-style: italic;
    color: var(--text-secondary, #999);
  }
  
  .loading-message {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    align-self: flex-start;
    background-color: var(--bg-secondary, #121212);
    border-radius: 6px;
    border: 1px solid var(--border, #333);
    max-width: 85%;
  }
  
  .typing-indicator {
    display: flex;
    gap: 4px;
  }
  
  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--accent, #ffffff);
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
  
  .loading-text {
    font-size: 0.9rem;
    color: var(--text-secondary, #999);
    margin: 0;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary, #999);
    text-align: center;
  }
  
  .input-area {
    margin-top: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid var(--border, #333);
    flex-shrink: 0;
    background-color: var(--bg-primary, #0f0f0f);
    position: relative;
    z-index: 10;
  }
  
  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 0.75rem;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-image {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
  }
  
  form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  input {
    flex: 1;
    background-color: var(--bg-tertiary, #1a1a1a);
    border: 1px solid var(--border, #333);
    color: var(--text-primary, #fff);
    padding: 0.75rem;
    border-radius: 4px;
    min-height: 44px;
    font-size: 16px; /* Prevents zoom on mobile */
  }
  
  .image-button, .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    width: 44px;
    height: 44px;
    background-color: var(--bg-tertiary, #1a1a1a);
    color: var(--text-secondary, #999);
    border: 1px solid var(--border, #333);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .image-button:hover:not(.disabled), .send-button:hover:not(:disabled) {
    color: var(--text-primary, #fff);
    border-color: var(--accent, #fff);
  }
  
  .send-button {
    background-color: var(--accent, #fff);
    color: var(--bg-primary, #0f0f0f);
    border: none;
  }
  
  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .send-button .spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  /* Compact mode styles */
  .chat-container.compact-mode .message {
    padding: 0.5rem;
    font-size: 0.9rem;
    max-width: 90%;
  }
  
  .chat-container.compact-mode .messages {
    gap: 0.5rem;
  }
  
  .chat-container.compact-mode .active-model {
    padding: 0.5rem 0.75rem;
  }
  
  .chat-container.compact-mode input {
    padding: 0.5rem 0.75rem;
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .chat-container {
      height: calc(100vh - 60px);
    }
    
    .input-area {
      padding: 0.5rem;
    }
    
    /* Ensure buttons have minimum touch target size */
    .image-button, .send-button {
      min-width: 44px;
      min-height: 44px;
    }
  }
  
  /* Fix for iOS/Android keyboard issues */
  @media (max-width: 768px) and (max-height: 600px) {
    .chat-container {
      height: calc(100vh - 30px);
    }
    
    .messages {
      padding-bottom: 5px;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
