import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({
    id = Date.now().toString(),
    message,
    type = 'info',
    duration = 3000,
    position = 'center'
  }) => {
    setToasts(prev => [...prev, { id, message, type, duration, position }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    addToast({ message, type: 'success', duration });
  }, [addToast]);

  const showError = useCallback((message, duration = 4000) => {
    addToast({ message, type: 'error', duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration = 3000) => {
    addToast({ message, type: 'warning', duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration = 3000) => {
    addToast({ message, type: 'info', duration });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-50">
        {/* Top Right */}
        <div className="fixed top-4 right-4 space-y-2">
          {toasts
            .filter(toast => toast.position === 'top-right')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>

        {/* Top Left */}
        <div className="fixed top-4 left-4 space-y-2">
          {toasts
            .filter(toast => toast.position === 'top-left')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>

        {/* Top Center */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-2">
          {toasts
            .filter(toast => toast.position === 'top-center')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>

        {/* Center */}
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {toasts
            .filter(toast => toast.position === 'center')
            .map(toast => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  isOpen={true}
                  onClose={() => removeToast(toast.id)}
                  message={toast.message}
                  type={toast.type}
                  duration={toast.duration}
                  position={toast.position}
                />
              </div>
            ))}
        </div>

        {/* Bottom Right */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {toasts
            .filter(toast => toast.position === 'bottom-right')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>

        {/* Bottom Left */}
        <div className="fixed bottom-4 left-4 space-y-2">
          {toasts
            .filter(toast => toast.position === 'bottom-left')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>

        {/* Bottom Center */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
          {toasts
            .filter(toast => toast.position === 'bottom-center')
            .map(toast => (
              <Toast
                key={toast.id}
                isOpen={true}
                onClose={() => removeToast(toast.id)}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={toast.position}
              />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}; 