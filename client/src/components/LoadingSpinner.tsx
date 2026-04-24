import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
