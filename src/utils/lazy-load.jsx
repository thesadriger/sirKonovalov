// utils/lazy-load.jsx
import React from 'react';

export const lazyLoad = (importer) => {
  return React.lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      console.error('Lazy load error:', error);
      return { 
        default: () => <div className="error">Component load failed</div>
      };
    }
  });
}; 