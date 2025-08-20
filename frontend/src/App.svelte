<script>
  import { onMount } from 'svelte';
  import { sidebarVisible } from './stores/ui';
  import { themeStore } from './stores/ui';
  import ChatInterface from './components/Chat/ChatInterface.svelte';
  import Sidebar from './components/Sidebar/Sidebar.svelte';
  
  function toggleSidebar() {
    sidebarVisible.update(visible => !visible);
  }
  
  // Close sidebar when clicking outside on mobile
  function handleMainContentClick() {
    if (window.innerWidth <= 768 && $sidebarVisible) {
      sidebarVisible.set(false);
    }
  }
  
  // Initialize theme
  onMount(() => {
    themeStore.initialize();
  });
</script>

<main class="app-container">
  <header class="app-header">
    <button class="menu-button" on:click={toggleSidebar} aria-label="Toggle sidebar">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    
    <h1 class="app-title">NexusAI</h1>
  </header>
  
  <div class="app-content">
    <div class="sidebar-container" class:visible={$sidebarVisible}>
      <Sidebar />
    </div>
    
    <div 
      class="main-content" 
      class:sidebar-open={$sidebarVisible}
      on:click={handleMainContentClick}
    >
      <ChatInterface />
    </div>
  </div>
</main>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
  
  .app-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--bg-secondary);
  }
  
  .menu-button {
    background: transparent;
    border: none;
    color: var(--text-primary);
    padding: 0.5rem;
    cursor: pointer;
    margin-right: 0.5rem;
  }
  
  .app-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }
  
  .app-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .sidebar-container {
    width: 250px;
    background-color: var(--bg-secondary);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  
  .main-content {
    flex: 1;
    overflow-y: auto;
    transition: opacity 0.2s ease;
  }
  
  /* Desktop styles */
  @media (min-width: 769px) {
    .sidebar-container {
      transform: translateX(0);
    }
    
    .sidebar-container:not(.visible) {
      transform: translateX(-250px);
      width: 0;
    }
    
    .main-content {
      padding: 1rem;
    }
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .sidebar-container {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      transform: translateX(-100%);
      width: 250px;
      box-shadow: none;
    }
    
    .sidebar-container.visible {
      transform: translateX(0);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    }
    
    .main-content {
      padding: 0.75rem;
    }
    
    .main-content.sidebar-open {
      opacity: 0.5;
    }
  }
</style>