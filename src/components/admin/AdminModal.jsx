import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg, xl, full
  className = '',
  showCloseButton = true,
  closeOnClickOutside = true,
  preventScroll = true
}) => {
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnClickOutside) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-25 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Predefined button components for the modal
export const ModalButton = ({ 
  children, 
  onClick, 
  variant = 'primary', // primary, secondary, danger
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#06AEF4] text-white hover:bg-[#0590d8]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Example usage:
// <AdminModal
//   isOpen={showModal}
//   onClose={() => setShowModal(false)}
//   title="Edit User"
//   footer={
//     <>
//       <ModalButton variant="secondary" onClick={() => setShowModal(false)}>
//         Cancel
//       </ModalButton>
//       <ModalButton onClick={handleSave}>
//         Save Changes
//       </ModalButton>
//     </>
//   }
// >
//   <div>Modal content here</div>
// </AdminModal>

export default AdminModal;
