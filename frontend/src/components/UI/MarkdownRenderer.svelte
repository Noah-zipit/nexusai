 <script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css'; // Dark theme for code
  import DOMPurify from 'dompurify';
  
  export let markdown = '';
  
  let renderedHTML = '';
  
  $: if (markdown) {
    renderMarkdown(markdown);
  }
  
  function renderMarkdown(text) {
    // Configure marked with syntax highlighting
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });
    
    // Parse markdown to HTML
    const rawHTML = marked.parse(text);
    
    // Sanitize HTML to prevent XSS
    renderedHTML = DOMPurify.sanitize(rawHTML);
  }
  
  onMount(() => {
    renderMarkdown(markdown);
  });
</script>

<div class="markdown-content">
  {@html renderedHTML}
</div>

<style>
  .markdown-content {
    line-height: 1.6;
  }
  
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3),
  .markdown-content :global(h4),
  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.25;
  }
  
  .markdown-content :global(h1) {
    font-size: 1.5rem;
  }
  
  .markdown-content :global(h2) {
    font-size: 1.3rem;
  }
  
  .markdown-content :global(h3) {
    font-size: 1.15rem;
  }
  
  .markdown-content :global(p) {
    margin-bottom: 1rem;
  }
  
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .markdown-content :global(li) {
    margin-bottom: 0.25rem;
  }
  
  .markdown-content :global(a) {
    color: var(--accent-color);
    text-decoration: none;
  }
  
  .markdown-content :global(a:hover) {
    text-decoration: underline;
  }
  
  .markdown-content :global(blockquote) {
    padding-left: 1rem;
    border-left: 3px solid var(--accent-color);
    color: var(--text-secondary);
    margin: 1rem 0;
  }
  
  .markdown-content :global(pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    background-color: var(--bg-tertiary);
    position: relative;
  }
  
  .markdown-content :global(code) {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9rem;
  }
  
  .markdown-content :global(:not(pre) > code) {
    padding: 0.1em 0.3em;
    border-radius: 0.3em;
    background-color: var(--bg-tertiary);
    font-size: 0.9em;
  }
  
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  
  .markdown-content :global(th),
  .markdown-content :global(td) {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    text-align: left;
  }
  
  .markdown-content :global(th) {
    background-color: var(--bg-tertiary);
  }
  
  .markdown-content :global(img) {
    max-width: 100%;
    border-radius: 0.25rem;
  }
  
  .markdown-content :global(hr) {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 1.5rem 0;
  }
</style>