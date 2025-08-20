<script>
  import { getApiUsage } from '../../services/api';
  
  // Get usage data
  let apiUsage = getApiUsage();
  
  // Calculate percentage
  $: usagePercentage = apiUsage.remaining !== null && apiUsage.limit 
    ? Math.round((apiUsage.remaining / apiUsage.limit) * 100) 
    : 100;
  
  // Format reset time
  $: resetTimeFormatted = apiUsage.resetTime 
    ? formatTime(apiUsage.resetTime) 
    : 'Unknown';
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
</script>

<div class="usage-display">
  <h2 class="usage-title">API Usage</h2>
  
  <div class="usage-stats">
    <div class="usage-label">
      <span>Requests Remaining</span>
      <span class="usage-count">{apiUsage.remaining !== null ? apiUsage.remaining : '–'}/{apiUsage.limit || '–'}</span>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar" style="width: {usagePercentage}%"></div>
    </div>
    
    <div class="reset-info">
      <span>Resets in:</span>
      <span>{resetTimeFormatted}</span>
    </div>
  </div>
</div>

<style>
  .usage-display {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px var(--shadow-color);
  }
  
  .usage-title {
    font-size: var(--font-size-md);
    font-weight: 500;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    margin: 0;
  }
  
  .usage-stats {
    padding: 1rem;
  }
  
  .usage-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: var(--font-size-sm);
  }
  
  .usage-count {
    font-weight: 600;
  }
  
  .progress-container {
    height: 6px;
    background-color: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }
  
  .progress-bar {
    height: 100%;
    background-color: var(--accent-color);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .reset-info {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
</style>