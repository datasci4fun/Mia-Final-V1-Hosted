import React from 'react';

// Button component to ensure ?view=widget in the URL
const EnsureViewWidgetButton: React.FC = () => {
  // Function to add or maintain the ?view=widget parameter in the URL
  const ensureViewParameter = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);

      // Check if the 'view' parameter exists, if not, set it to 'widget'
      if (url.searchParams.get('view') !== 'widget') {
        url.searchParams.set('view', 'widget');

        // Update the browser's URL without reloading the page
        window.history.replaceState(null, '', url.toString());
      }
    }
  };

  // Handle button click
  const handleClick = () => {
    ensureViewParameter();
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Ensure View Widget
    </button>
  );
};

export default EnsureViewWidgetButton;
