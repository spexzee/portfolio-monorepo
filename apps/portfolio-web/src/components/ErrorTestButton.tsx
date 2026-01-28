import React, { useState } from 'react';

// This component is only shown in development to test error boundaries
const ErrorTestButton: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error('Test error from ErrorTestButton component for debugging error boundary');
  }
  
  if (!import.meta.env.DEV || true) { // Temporarily disabled
    return null; // Don't show in production or when disabled
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShouldThrow(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors duration-200"
        title="Test Error Boundary (Development Only)"
      >
        🧪 Test Error
      </button>
    </div>
  );
};

export default ErrorTestButton;