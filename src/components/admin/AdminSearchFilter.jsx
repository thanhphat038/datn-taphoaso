import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa';

const AdminSearchFilter = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  filters = [],
  onFilterChange,
  className = ''
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <div key={index} className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white shadow-sm min-w-[120px] justify-between"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500 w-4 h-4" />
              <span className="text-gray-700 font-medium">
                {filter.selectedLabel || filter.label}
              </span>
            </div>
            <FaChevronDown className={`text-gray-400 w-3 h-3 transition-transform ${
              openDropdown === index ? 'rotate-180' : ''
            }`} />
          </button>
          
          {openDropdown === index && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {filter.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    filter.value === option.value ? 'bg-[#06AEF4] text-white hover:bg-[#0590d8]' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onFilterChange(filter.key, option.value, option.label);
                    setOpenDropdown(null);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Search Button */}
      <button className="px-6 py-3 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm">
        <FaSearch className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AdminSearchFilter;
