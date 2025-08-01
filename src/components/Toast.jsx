import React, { useState, useEffect } from 'react';

const Toast = ({ 
  isOpen, 
  onClose, 
  message, 
  type = "info", // "info", "success", "warning", "error"
  duration = 3000,
  position = "top-right" // "top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          icon: "text-green-500",
          border: "border-green-200",
          text: "text-green-800"
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          icon: "text-yellow-500",
          border: "border-yellow-200",
          text: "text-yellow-800"
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: "text-red-500",
          border: "border-red-200",
          text: "text-red-800"
        };
      default:
        return {
          bg: "bg-blue-500",
          icon: "text-blue-500",
          border: "border-blue-200",
          text: "text-blue-800"
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 ${getPositionStyles()}`}>
      <div 
        className={`bg-white border ${styles.border} rounded-lg shadow-lg max-w-sm w-full mx-4 transform transition-all duration-200 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center p-4">
          <div className={`${styles.icon} flex-shrink-0 mr-3`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${styles.bg} transition-all duration-300 ease-linear`}
            style={{ 
              width: isVisible ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast; 