import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from './Alert';

const AlertContext = createContext();

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    actions: null,
    autoClose: true,
    autoCloseDelay: 3000
  });

  const showAlert = useCallback(({
    title = 'Thông báo',
    message,
    type = 'info',
    actions = null,
    autoClose = true,
    autoCloseDelay = 3000
  }) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      actions,
      autoClose,
      autoCloseDelay
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const showSuccess = useCallback((message, title = 'Thành công') => {
    showAlert({ title, message, type: 'success' });
  }, [showAlert]);

  const showError = useCallback((message, title = 'Lỗi') => {
    showAlert({ title, message, type: 'error' });
  }, [showAlert]);

  const showWarning = useCallback((message, title = 'Cảnh báo') => {
    showAlert({ title, message, type: 'warning' });
  }, [showAlert]);

  const showInfo = useCallback((message, title = 'Thông báo') => {
    showAlert({ title, message, type: 'info' });
  }, [showAlert]);

  const showConfirm = useCallback(({
    title = 'Xác nhận',
    message,
    onConfirm,
    onCancel,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy'
  }) => {
    const actions = [
      {
        label: cancelText,
        variant: 'secondary',
        onClick: () => {
          hideAlert();
          if (onCancel) onCancel();
        }
      },
      {
        label: confirmText,
        variant: 'danger',
        onClick: () => {
          hideAlert();
          if (onConfirm) onConfirm();
        }
      }
    ];

    showAlert({
      title,
      message,
      type: 'warning',
      actions,
      autoClose: false
    });
  }, [showAlert, hideAlert]);

  const value = {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        actions={alertState.actions}
        autoClose={alertState.autoClose}
        autoCloseDelay={alertState.autoCloseDelay}
      />
    </AlertContext.Provider>
  );
}; 