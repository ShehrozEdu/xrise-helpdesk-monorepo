import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Something went wrong',
  onRetry,
}) => {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <AlertCircle size={28} />
      </div>
      <h3>Oops!</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary mt-4" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
