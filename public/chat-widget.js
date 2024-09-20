(function () {
  // Load React and ReactDOM from CDN
  const loadScript = (src, callback) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
  };

  // Load React and ReactDOM before initializing the widget
  loadScript(
    "https://unpkg.com/react@18/umd/react.production.min.js",
    () => {
      loadScript(
        "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        initWidget
      );
    }
  );

  function initWidget() {
    const chatDiv = document.createElement("div");
    chatDiv.id = "chat-widget-container";
    document.body.appendChild(chatDiv);

    // Fetch the custom build ID from the server-side environment variable
    const buildId = document
      .querySelector('meta[name="build-id"]')
      ?.getAttribute("content");

    if (!buildId) {
      console.error("Build ID not found.");
      return;
    }

    // Construct manifest paths with the build ID
    const manifestPaths = [
      `/_next/static/${buildId}/app-build-manifest.json`,
      `/_next/static/${buildId}/build-manifest.json`,
    ];

    fetchFirstAvailableManifest(manifestPaths)
      .then((manifest) => {
        const widgetChunkPaths = findWidgetChunks(manifest);

        if (!widgetChunkPaths.length) {
          console.error("No relevant ChatWidget chunks found in the manifest.");
          return;
        }

        widgetChunkPaths.forEach((chunkPath) => {
          loadChunk(`/_next/static/${chunkPath}`, chatDiv);
        });
      })
      .catch((error) => {
        console.error(
          "Error fetching the manifest or loading the ChatWidget chunk:",
          error
        );
      });
  }

  function fetchFirstAvailableManifest(paths) {
    return new Promise((resolve, reject) => {
      let index = 0;

      function tryFetch() {
        if (index >= paths.length) {
          reject(new Error("No available manifests found."));
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

  function findWidgetChunks(manifest) {
    const pageChunks = manifest.pages
      ? manifest.pages["/[locale]/chat/page"]
      : manifest.rootMainFiles || [];
    return pageChunks.filter(
      (path) => path.includes("main-app") || path.includes("chat/page")
    );
  }

  function loadChunk(chunkPath, container) {
    const script = document.createElement("script");
    script.src = chunkPath;
    script.async = true;

    script.onload = () => {
      const { createElement } = window.React;
      const { render } = window.ReactDOM;
      const ChatWidget = window.ChatWidget;

      if (!ChatWidget) {
        console.error("ChatWidget component not found on the window.");
        return;
      }

      const widgetRoot = document.createElement("div");
      widgetRoot.id = "chat-widget-root";
      container.appendChild(widgetRoot);

      render(createElement(ChatWidget), widgetRoot);
    };

    script.onerror = () => {
      console.error(`Failed to load the script at ${chunkPath}`);
    };

    document.head.appendChild(script);
  }
})();
