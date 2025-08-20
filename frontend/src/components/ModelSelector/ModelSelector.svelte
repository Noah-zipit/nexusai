<script>
  import { modelStore, setActiveModel } from '../../stores/models';
  
  function selectModel(modelId) {
    setActiveModel(modelId);
  }
  
  $: activeModel = $modelStore.models.find(m => m.id === $modelStore.active);
</script>

<div class="model-selector">
  <h2 class="selector-title">AI Models</h2>
  
  <div class="models-list">
    {#each $modelStore.models as model}
      <button 
        class="model-item" 
        class:active={model.id === $modelStore.active}
        on:click={() => selectModel(model.id)}
      >
        <div class="model-icon" style="background-color: {model.accentColor || '#333'}">
          {model.name[0]}
        </div>
        <div class="model-info">
          <div class="model-name">{model.name}</div>
          <div class="model-provider">{model.provider}</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .model-selector {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px var(--shadow-color);
  }
  
  .selector-title {
    font-size: var(--font-size-md);
    font-weight: 500;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    margin: 0;
  }
  
  .models-list {
    display: flex;
    flex-direction: column;
  }
  
  .model-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--border-color);
    text-align: left;
    gap: 0.75rem;
    transition: background-color 0.2s;
  }
  
  .model-item:last-child {
    border-bottom: none;
  }
  
  .model-item:hover {
    background-color: var(--bg-tertiary);
  }
  
  .model-item.active {
    background-color: var(--bg-tertiary);
    position: relative;
  }
  
  .model-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--accent-color);
  }
  
  .model-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: var(--font-size-md);
    flex-shrink: 0;
  }
  
  .model-info {
    display: flex;
    flex-direction: column;
  }
  
  .model-name {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .model-provider {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
</style>