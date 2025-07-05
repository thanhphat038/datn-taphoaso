import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const AdminActionDropdown = ({ 
  actions = [], 
  onActionClick,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={disabled}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
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
        </div>
      )}
    </div>
  );
};

export default AdminActionDropdown;
