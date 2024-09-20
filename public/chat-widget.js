(function () {
  // Load React and ReactDOM from CDN
  const loadScript = (src, callback) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
  };

  // Load React and ReactDOM before initializing the widget
  loadScript('https://unpkg.com/react@18/umd/react.production.min.js', () => {
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', initWidget);
  });

  function initWidget() {
    const chatDiv = document.createElement('div');
    chatDiv.id = 'chat-widget-container';
    document.body.appendChild(chatDiv);

    // Attempt to fetch the build manifest to dynamically find the chunk URLs
    const manifestUrls = [
      '/_next/static/build-manifest.json',  // Common path for the build manifest
      '/_next/static/app-build-manifest.json'  // Alternative path for the app build manifest
    ];

    // Fetch the first available manifest
    fetchFirstAvailableManifest(manifestUrls)
      .then((manifest) => {
        const pageChunks = manifest.pages["/[locale]/chat/page"] || [];

        // Find the relevant chunk paths in the manifest
        const widgetChunkPaths = pageChunks.filter(path => path.includes('main-app') || path.includes('chat/page'));

        if (widgetChunkPaths.length === 0) {
          console.error('No ChatWidget chunks found in the manifest.');
          return;
        }

        // Load the identified widget chunks dynamically
        widgetChunkPaths.forEach((chunkPath) => {
          const widgetScript = document.createElement('script');
          widgetScript.src = `/_next/static/${chunkPath}`;
          widgetScript.async = true;

          widgetScript.onload = () => {
            const { createElement } = window.React;
            const { render } = window.ReactDOM;
            const ChatWidget = window.ChatWidget; // Ensure this matches the export in your bundle

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
            console.error(`Failed to load the ChatWidget script at ${chunkPath}`);
          };

          document.head.appendChild(widgetScript);
        });
      })
      .catch((error) => {
        console.error('Error fetching the manifest or loading the ChatWidget chunk:', error);
      });
  }

  // Helper function to fetch the first available manifest
  function fetchFirstAvailableManifest(manifestUrls) {
    return new Promise((resolve, reject) => {
      let index = 0;

      function tryFetch() {
        if (index >= manifestUrls.length) {
          reject(new Error('No available manifests found.'));
          return;
        }

        fetch(manifestUrls[index])
          .then((response) => {
            if (!response.ok) {
              index++;
              tryFetch();
            } else {
              return response.json();
            }
          })
          .then((manifest) => {
            if (manifest) {
              resolve(manifest);
            }
          })
          .catch(() => {
            index++;
            tryFetch();
          });
      }

      tryFetch();
    });
  }
})();
