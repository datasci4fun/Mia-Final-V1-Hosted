(function () {
    // Step 1: Load React and ReactDOM from a trusted CDN
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.async = true;
    document.head.appendChild(reactScript);
  
    var reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
    reactDOMScript.async = true;
    document.head.appendChild(reactDOMScript);
  
    // Step 2: Wait for React and ReactDOM to load
    reactDOMScript.onload = function () {
      // Step 3: Create the container for the chat widget
      var chatDiv = document.createElement('div');
      chatDiv.id = 'chat-widget-container';
      document.body.appendChild(chatDiv);
  
      // Step 4: Dynamically load the main Next.js bundle
      var nextScript = document.createElement('script');
      nextScript.src = 'https://your-nextjs-app.com/_next/static/chunks/main.js'; // Correct path to your Next.js bundle
      nextScript.async = true;
  
      // Step 5: When Next.js bundle is loaded, initialize the ChatWidget
      nextScript.onload = function () {
        // Fetch the ChatWidget component dynamically
        import('https://your-nextjs-app.com/_next/static/chunks/ChatWidget.js')
          .then((module) => {
            const { createElement } = window.React;
            const { render } = window.ReactDOM;
            const ChatWidget = module.ChatWidget; // Adjust to match the export from your bundle
  
            // Step 6: Create a root element for the chat widget and render it
            var widgetRoot = document.createElement('div');
            widgetRoot.id = 'chat-widget-root';
            chatDiv.appendChild(widgetRoot);
  
            render(createElement(ChatWidget), widgetRoot);
          })
          .catch((error) => {
            console.error('Error loading ChatWidget:', error);
          });
      };
  
      document.head.appendChild(nextScript);
    };
  })();
  