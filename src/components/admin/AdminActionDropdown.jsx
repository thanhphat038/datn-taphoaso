import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaEllipsisV } from 'react-icons/fa';

const AdminActionDropdown = ({ 
  actions = [], 
  onActionClick,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Kiểm tra vị trí để quyết định dropdown hiển thị ở trên hay dưới
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // Ước tính chiều cao dropdown
      
      // Kiểm tra không gian ở dưới
      const spaceBelow = viewportHeight - buttonRect.bottom;
      // Kiểm tra không gian ở trên
      const spaceAbove = buttonRect.top;
      
      // Tính toán vị trí dropdown
      let position = 'bottom';
      let top = buttonRect.bottom + 8;
      let left = buttonRect.right - 192; // 192px = w-48
      
      // Nếu không đủ không gian ở dưới và có đủ không gian ở trên, hiển thị ở trên
      if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
        position = 'top';
        top = buttonRect.top - dropdownHeight - 8;
      } else if (spaceBelow >= dropdownHeight) {
        position = 'bottom';
      } else {
        // Nếu cả hai đều không đủ, ưu tiên hiển thị ở dưới nhưng với scroll
        position = 'bottom';
      }
      
      setDropdownPosition(position);
      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999
      });
    }
  }, [isOpen]);

  const handleActionClick = (action, event) => {
    event.stopPropagation();
    setIsOpen(false);
    if (onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={disabled}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div 
          className="w-48 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
          style={dropdownStyle}
          ref={dropdownRef}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => handleActionClick(action, e)}
              disabled={action.disabled}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                action.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : action.variant === 'warning'
                  ? 'text-orange-600 hover:bg-orange-50'
                  : action.variant === 'success'
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${index < actions.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {action.icon && (
                <action.icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminActionDropdown;
