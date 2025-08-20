<script>
  import { createEventDispatcher } from 'svelte';
  
  export let message = '';
  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  // Generate suggestions based on the AI's last message
  function generateSuggestions(messageContent) {
    // Ensure message is a string before processing
    if (!messageContent || typeof messageContent !== 'string') {
      return ["Tell me more", "How does this work?", "Can you explain further?"];
    }
    
    const messageText = messageContent.toLowerCase();
    const suggestions = [];
    
    if (messageText.includes('help')) {
      suggestions.push('Can you explain that further?');
    }
    
    if (messageText.includes('example')) {
      suggestions.push('Can you show another example?');
    }
    
    if (messageText.match(/\d+/g)) {
      suggestions.push('Why is that number significant?');
    }
    
    if (messageText.includes('recommend') || messageText.includes('suggest')) {
      suggestions.push('Why do you recommend that?');
    }
    
    // Add some general follow-ups
    const generalSuggestions = [
      'Tell me more about this topic',
      'What are the practical applications?',
      'What are common misconceptions?',
      'Can you summarize the key points?'
    ];
    
    // Combine specific and general suggestions, up to 3 total
    while (suggestions.length < 3 && generalSuggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * generalSuggestions.length);
      const suggestion = generalSuggestions.splice(randomIndex, 1)[0];
      suggestions.push(suggestion);
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }
  
  // Safely compute suggestions based on message content
  $: computedSuggestions = generateSuggestions(typeof message === 'string' ? message : '');
  
  function selectSuggestion(suggestion) {
    dispatch('select', suggestion);
  }
</script>

{#if !loading && computedSuggestions.length > 0}
  <div class="suggestions-container">
    {#each computedSuggestions as suggestion}
      <button 
        class="suggestion" 
        on:click={() => selectSuggestion(suggestion)}
      >
        {suggestion}
      </button>
    {/each}
  </div>
{/if}

<style>
  .suggestions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .suggestion {
    background-color: var(--bg-tertiary, #1a1a1a);
    color: var(--text-secondary, #a0a0a0);
    border: 1px solid var(--border, #333);
    border-radius: 1rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .suggestion:hover {
    background-color: var(--accent, #ffffff);
    color: var(--bg-primary, #0f0f0f);
    border-color: var(--accent, #ffffff);
  }
  
  /* Compact mode styling */
  :global(.compact-mode) .suggestions-container {
    margin-top: 0.25rem;
    gap: 0.25rem;
  }
  
  :global(.compact-mode) .suggestion {
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
  }
</style>