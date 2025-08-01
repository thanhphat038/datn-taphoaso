import React, { useState, useEffect } from 'react';

const Alert = ({ 
  isOpen, 
  onClose, 
  title = "Thông báo", 
  message, 
  type = "info", // "info", "success", "warning", "error"
  showIcon = true,
  autoClose = true,
  autoCloseDelay = 3000,
  showCloseButton = true,
  actions = null // Array of action buttons
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const getAlertStyles = () => {
    const baseStyles = "fixed inset-0 z-50 flex items-center justify-center p-4";
    return baseStyles;
  };

  const getModalStyles = () => {
    const baseStyles = "bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200";
    const visibilityStyles = isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0";
    return `${baseStyles} ${visibilityStyles}`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: "text-green-500",
          border: "border-l-4 border-l-green-500",
          bg: "bg-green-50",
          title: "text-green-800",
          message: "text-green-700"
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          border: "border-l-4 border-l-yellow-500",
          bg: "bg-yellow-50",
          title: "text-yellow-800",
          message: "text-yellow-700"
        };
      case "error":
        return {
          icon: "text-red-500",
          border: "border-l-4 border-l-red-500",
          bg: "bg-red-50",
          title: "text-red-800",
          message: "text-red-700"
        };
      default:
        return {
          icon: "text-blue-500",
          border: "border-l-4 border-l-blue-500",
          bg: "bg-blue-50",
          title: "text-blue-800",
          message: "text-blue-700"
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className={getAlertStyles()}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />
      
      {/* Alert Modal */}
      <div className={getModalStyles()}>
        <div className={`${styles.border} ${styles.bg} p-6`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {showIcon && (
                <div className={`${styles.icon} flex-shrink-0`}>
                  {getIcon()}
                </div>
              )}
              <h3 className={`text-lg font-semibold ${styles.title}`}>
                {title}
              </h3>
            </div>
            
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Message */}
          <div className={`${styles.message} text-sm leading-relaxed mb-6`}>
            {message}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 ? (
            <div className="flex gap-3 justify-end">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    action.variant === 'secondary' 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : action.variant === 'danger'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert; 