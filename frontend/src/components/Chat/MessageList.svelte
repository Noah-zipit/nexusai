 <script>
  import { onMount, afterUpdate } from 'svelte';
  import MessageItem from './MessageItem.svelte';
  
  export let messages = [];
  export let loading = false;
  
  let messagesElement;
  
  // Auto-scroll to bottom when new messages arrive
  afterUpdate(() => {
    if (messagesElement) {
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  });
  
  // Welcome message when empty
  $: isEmpty = messages.length === 0;
</script>

<div class="message-list" bind:this={messagesElement}>
  {#if isEmpty}
    <div class="welcome-message">
      <h2>Welcome to NexusAI</h2>
      <p>Choose from five powerful AI models to chat with</p>
      <p>Start by typing a message below</p>
    </div>
  {:else}
    {#each messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  {/if}
  
  {#if loading}
    <div class="loading-indicator">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {/if}
</div>

<style>
  .message-list {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .welcome-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    opacity: 0.8;
    padding: 2rem;
  }
  
  .welcome-message h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, var(--accent-color), var(--accent-color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .welcome-message p {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  
  .loading-indicator {
    padding: 1rem;
    align-self: flex-start;
  }
  
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--accent-color);
    animation: typing 1.4s infinite ease-in-out;
    animation-fill-mode: both;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 80%, 100% { 
      transform: scale(0.6); 
      opacity: 0.6;
    }
    40% { 
      transform: scale(1.0);
      opacity: 1;
    }
  }
</style>