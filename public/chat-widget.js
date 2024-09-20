(function () {
  // Helper function to load external scripts
  const loadScript = (src, callback) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
  };

  // Ensure React and ReactDOM are loaded before initializing the widget
  const ensureReactLoaded = (callback) => {
    if (window.React && window.ReactDOM) {
      callback();
    } else {
      loadScript(
        "https://unpkg.com/react@18/umd/react.production.min.js",
        () => {
          console.log("React loaded successfully.");
          loadScript(
            "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
            callback
          );
        }
      );
    }
  };

  // Define the ChatWidget global object with an init method
  window.ChatWidget = {
    init: (selector) => {
      ensureReactLoaded(() => {
        console.log("ReactDOM loaded successfully, initializing widget.");
        const container = document.querySelector(selector);
        if (!container) {
          console.error("Container not found for the widget.");
          return;
        }

        // Fetch the build manifest from the correct hosted location
        const manifestPath =
          "https://mia-final-v1-hosted.vercel.app/build-manifest.json";

        fetch(manifestPath)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch build manifest.");
            }
            return response.json();
          })
          .then((manifest) => {
            console.log("Manifest fetched successfully:", manifest);
            const widgetChunkPaths = findWidgetChunks(manifest);

            if (!widgetChunkPaths.length) {
              console.error(
                "No relevant ChatWidget chunks found in the manifest."
              );
              return;
            }

            widgetChunkPaths.forEach((chunkPath) => {
              // Correct the chunk path to avoid the double 'static/static' issue
              const correctedChunkPath = chunkPath.replace(
                /^static\/static\//,
                "static/"
              );
              loadChunk(
                `https://mia-final-v1-hosted.vercel.app/_next/${correctedChunkPath}`,
                container
              );
            });
          })
          .catch((error) => {
            console.error(
              "Error fetching the manifest or loading the ChatWidget chunk:",
              error
            );
          });
      });
    },
  };

  // Helper function to find relevant chunks from the manifest
  function findWidgetChunks(manifest) {
    const rootMainFiles = manifest.rootMainFiles || [];
    const pageChunks = manifest.pages
      ? manifest.pages["/[locale]/chat/page"] || []
      : [];
    const relevantChunks = [...rootMainFiles, ...pageChunks].filter(
      (path) => path.includes("main-app") || path.includes("chat/page")
    );
    console.log("Relevant chunks found:", relevantChunks);
    return relevantChunks;
  }

  // Load a specific chunk and render the ChatWidget
  function loadChunk(chunkPath, container) {
    const script = document.createElement("script");
    script.src = chunkPath;
    script.async = true;

    script.onload = () => {
      console.log(`Loaded script: ${chunkPath}`);
      const { createElement } = window.React;
      const { render } = window.ReactDOM;
      const ChatWidgetComponent = window.ChatWidget;

      if (!ChatWidgetComponent) {
        console.error("ChatWidget component not found on the window.");
        return;
      }

      console.log("ChatWidget component found, rendering now.");
      const widgetRoot = document.createElement("div");
      widgetRoot.id = "chat-widget-root";
      container.appendChild(widgetRoot);

      render(createElement(ChatWidgetComponent), widgetRoot);
    };

    script.onerror = () => {
      console.error(`Failed to load the script at ${chunkPath}`);
    };

    document.head.appendChild(script);
  }
})();
