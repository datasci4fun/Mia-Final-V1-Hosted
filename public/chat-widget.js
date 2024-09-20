(function () {
  // Load React and ReactDOM from CDN
  const loadScript = (src, callback) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  };

  loadScript('https://unpkg.com/react@18/umd/react.production.min.js', () => {
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', initWidget);
  });

  function initWidget() {
    const chatDiv = document.createElement('div');
    chatDiv.id = 'chat-widget-container';
    document.body.appendChild(chatDiv);

    // Fetch app-build-manifest.json to get the correct chunk URL
    fetch('/_next/static/app-build-manifest.json')
      .then(response => response.json())
      .then(manifest => {
        // Find the chunk associated with your ChatWidget page
        const pageChunks = manifest.pages["/[locale]/chat/page"] || [];

        // Filter to find the main application chunk or a specific one relevant to your ChatWidget
        const widgetChunkPath = pageChunks.find(path => path.includes('main-app') || path.includes('chat/page'));

        if (!widgetChunkPath) {
          console.error('ChatWidget chunk not found in the app-build manifest.');
          return;
        }

        // Load the main or specific widget chunk dynamically
        const widgetScript = document.createElement('script');
        widgetScript.src = `/_next/static/${widgetChunkPath}`;
        widgetScript.async = true;

        widgetScript.onload = () => {
          const { createElement } = window.React;
          const { render } = window.ReactDOM;
          const ChatWidget = window.ChatWidget; // Adjust to ensure the component is correctly exported in the bundle

          if (!ChatWidget) {
            console.error('ChatWidget component not found on the window.');
            return;
          }

          const widgetRoot = document.createElement('div');
          widgetRoot.id = 'chat-widget-root';
          chatDiv.appendChild(widgetRoot);

          render(createElement(ChatWidget), widgetRoot);
        };

        widgetScript.onerror = () => {
          console.error('Failed to load the ChatWidget script.');
        };

        document.head.appendChild(widgetScript);
      })
      .catch(error => {
        console.error('Error fetching the app-build manifest or loading the ChatWidget chunk:', error);
      });
  }
})();
