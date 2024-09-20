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

    // Attempt to fetch the build-manifest.json directly
    const manifestPath = "/build-manifest.json";

    fetch(manifestPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch build manifest.");
        }
        return response.json();
      })
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

  function findWidgetChunks(manifest) {
    // Extract the relevant chunks from the manifest
    const rootMainFiles = manifest.rootMainFiles || [];
    const pageChunks = manifest.pages
      ? manifest.pages["/[locale]/chat/page"] || []
      : [];
    return [...rootMainFiles, ...pageChunks].filter(
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
