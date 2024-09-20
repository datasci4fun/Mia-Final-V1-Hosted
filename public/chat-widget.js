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

    // Fetch the BUILD_ID first to construct the correct manifest paths
    fetch('/_next/BUILD_ID')
      .then((response) => response.text())
      .then((buildId) => {
        const manifestPaths = [
          `/_next/static/${buildId}/app-build-manifest.json`, // Construct path using the build ID
          `/_next/static/${buildId}/build-manifest.json` // Alternative path
        ];

        // Fetch the first available manifest
        return fetchFirstAvailableManifest(manifestPaths);
      })
      .then((manifest) => {
        // Find relevant chunks from the manifest data
        const widgetChunkPaths = findWidgetChunks(manifest);

        if (!widgetChunkPaths.length) {
          console.error('No relevant ChatWidget chunks found in the manifest.');
          return;
        }

        // Load the identified chunks dynamically
        widgetChunkPaths.forEach((chunkPath) => {
          loadChunk(`/_next/static/${chunkPath}`, chatDiv);
        });
      })
      .catch((error) => {
        console.error('Error fetching the build ID or loading the manifest:', error);
      });
  }

  // Function to fetch the first available manifest
  function fetchFirstAvailableManifest(paths) {
    return new Promise((resolve, reject) => {
      let index = 0;

      function tryFetch() {
        if (index >= paths.length) {
          reject(new Error('No available manifests found.'));
          return;
        }

        fetch(paths[index])
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

  // Function to find widget-related chunks from the manifest data
  function findWidgetChunks(manifest) {
    const pageChunks = manifest.pages ? manifest.pages["/[locale]/chat/page"] : manifest.rootMainFiles || [];
    return pageChunks.filter(path => path.includes('main-app') || path.includes('chat/page'));
  }

  // Function to load a specific chunk and initialize the ChatWidget
  function loadChunk(chunkPath, container) {
    const script = document.createElement('script');
    script.src = chunkPath;
    script.async = true;

    script.onload = () => {
      const { createElement } = window.React;
      const { render } = window.ReactDOM;
      const ChatWidget = window.ChatWidget; // Ensure this matches your component's export

      if (!ChatWidget) {
        console.error('ChatWidget component not found on the window.');
        return;
      }

      const widgetRoot = document.createElement('div');
      widgetRoot.id = 'chat-widget-root';
      container.appendChild(widgetRoot);

      render(createElement(ChatWidget), widgetRoot);
    };

    script.onerror = () => {
      console.error(`Failed to load the script at ${chunkPath}`);
    };

    document.head.appendChild(script);
  }
})();
