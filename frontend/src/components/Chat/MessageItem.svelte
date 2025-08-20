<script>
  import { onMount } from 'svelte';
  import MarkdownRenderer from '../UI/MarkdownRenderer.svelte';
  import CopyButton from './CopyButton.svelte';
  
  export let message;
  
  let timeDisplay = '';
  
  onMount(() => {
    if (message.timestamp) {
      const date = new Date(message.timestamp);
      timeDisplay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  });
  
  function getRoleName(role) {
    switch(role) {
      case 'user': return 'You';
      case 'assistant': return 'AI';
      case 'system': return 'System';
      default: return 'Unknown';
    }
  }
  
  $: isUserMessage = message.role === 'user';
</script>

<div class="message-item {message.role}" class:error={message.isError}>
  <div class="message-header">
    <div class="sender-info">
      <span class="sender-name">{getRoleName(message.role)}</span>
      {#if timeDisplay}
        <span class="message-time">{timeDisplay}</span>
      {/if}
    </div>
    
    {#if !isUserMessage}
      <CopyButton text={message.content} />
    {/if}
  </div>
  
  <div class="message-content">
    {#if message.image}
      <div class="message-image">
        <img src={message.image} alt="Uploaded image" />
      </div>
    {/if}
    
    <div class="message-text">
      {#if message.role === 'assistant' || message.role === 'system'}
        <MarkdownRenderer markdown={message.content} />
      {:else}
        <p>{message.content}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .message-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
    animation: fadeIn 0.3s ease;
  }
  
  .message-item.user {
    background-color: var(--user-message-bg);
  }
  
  .message-item.assistant, .message-item.system {
    background-color: var(--ai-message-bg);
  }
  
  .message-item.error {
    background-color: rgba(255, 74, 74, 0.1);
  }
  
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .sender-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .sender-name {
    font-weight: 600;
    font-size: var(--font-size-sm);
  }
  
  .message-time {
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
  }
  
  .message-content {
    line-height: 1.6;
  }
  
  .message-image {
    margin-bottom: 1rem;
    max-width: 400px;
  }
  
  .message-image img {
    max-width: 100%;
    border-radius: 4px;
  }
  
  .message-text {
    color: var(--text-primary);
    overflow-wrap: break-word;
  }
  
  .message-text :global(code) {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  .message-text :global(pre code) {
    background-color: transparent;
    padding: 0;
  }
</style>