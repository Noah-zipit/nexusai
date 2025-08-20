 <script>
  export let model;
  export let isActive = false;
  export let onClick;
</script>

<button 
  class="model-button" 
  class:active={isActive}
  on:click={onClick}
  style="--model-color: {model.accentColor}"
>
  <div class="model-icon">
    <img src={model.icon} alt={model.name} />
  </div>
  <div class="model-info">
    <span class="model-name">{model.name}</span>
    <span class="model-provider">{model.provider}</span>
  </div>
  
  <!-- Usage indicator -->
  <div class="usage-indicator">
    <div class="progress-bar">
      <div 
        class="progress" 
        style="width: {(model.usage.used / model.usage.limit) * 100}%"
      ></div>
    </div>
  </div>
</button>

<style>
  .model-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
    height: 120px;
  }
  
  .model-button:hover {
    border-color: var(--model-color);
    transform: translateY(-2px);
    background-color: var(--bg-secondary);
  }
  
  .model-button.active {
    border-color: var(--model-color);
    box-shadow: 0 0 0 1px var(--model-color);
    background-color: rgba(var(--model-color-rgb, 0, 0, 0), 0.1);
  }
  
  .model-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .model-icon img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .model-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .model-name {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .model-provider {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .usage-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
  }
  
  .progress-bar {
    height: 4px;
    background-color: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: var(--model-color);
  }
</style>