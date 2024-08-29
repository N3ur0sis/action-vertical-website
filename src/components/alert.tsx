import React, { useEffect } from 'react';

const alertStyles = {
  success: 'bg-green-100 text-green-800 border-green-500',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-500',
  info: 'bg-blue-100 text-blue-800 border-blue-500',
};

const iconStyles = {
  success: 'text-green-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const Alert = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-0 right-0 z-50 mt-4 mr-4 p-4 rounded-lg border-l-4 ${alertStyles[type]} transition-opacity ease-in-out duration-500`}
      style={{ opacity: 1, animation: `fadeOut ${duration}ms forwards` }}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className={`w-6 h-6 mr-2 ${iconStyles[type]}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {type === 'success' && (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-7.707a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            )}
            {type === 'warning' && (
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.84 12.146c.718 1.276-.177 2.855-1.742 2.855H3.16c-1.565 0-2.46-1.579-1.742-2.855L8.257 3.1zM11 13a1 1 0 11-2 0v-2a1 1 0 112 0v2zm-1 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                clipRule="evenodd"
              />
            )}
            {type === 'info' && (
              <path
                fillRule="evenodd"
                d="M18 8a8 8 0 11-16 0 8 8 0 0116 0zM9 4a1 1 0 112 0v5a1 1 0 01-2 0V4zm0 9a1 1 0 112 0 1 1 0 01-2 0z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span className="font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
