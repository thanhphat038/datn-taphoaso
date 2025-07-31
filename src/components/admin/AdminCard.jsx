import React from 'react';

const AdminCard = ({ 
  title, 
  children, 
  className = '', 
  headerAction = null,
  noPadding = false 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 relative ${className}`}>
      {title && (
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-8'} relative`}>
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
