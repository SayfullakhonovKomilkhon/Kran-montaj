// Original fetch function
const originalFetch = window.fetch;

// Override fetch to intercept calls to extensions.aitopia.ai
window.fetch = function(resource, init) {
  // Check if this is a request to extensions.aitopia.ai
  if (typeof resource === 'string' && resource.includes('extensions.aitopia.ai/ai/prompts')) {
    console.log('Intercepting request to extensions.aitopia.ai and redirecting through proxy');
    
    // Redirect through our proxy
    const proxyUrl = '/api/ai-proxy';
    
    // Create new init object with the original request's body and headers
    const newInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
      }
    };
    
    // Return fetch call to our proxy instead
    return originalFetch(proxyUrl, newInit);
  }
  
  // For all other requests, use the original fetch
  return originalFetch(resource, init);
}; 