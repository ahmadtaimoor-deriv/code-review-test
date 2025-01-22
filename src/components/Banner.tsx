import React from 'react';

interface BannerProps {
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

const Banner: React.FC<BannerProps> = ({
  message = 'Welcome to our application!',
  type = 'info',
  onClose
}) => {
  const bgColors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`px-4 py-3 ${bgColors[type]} relative`} role="alert">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Banner;
