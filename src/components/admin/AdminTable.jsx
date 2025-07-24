import React from 'react';

const AdminTable = ({ 
  columns, 
  data, 
  loading, 
  error,
  emptyMessage = 'Không có dữ liệu',
  loadingMessage = 'Đang tải dữ liệu...',
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectOne,
  renderExpandedRow,
  expandedRowId,
  onRowClick,
  rowClassName = '',
  tableClassName = ''
}) => {
  return (
    <div className={`overflow-x-auto ${tableClassName}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {selectable && (
              <th className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedIds.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-left text-sm font-semibold text-gray-600 ${column.className || ''}`}
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-[#06AEF4] border-t-transparent rounded-full animate-spin"></div>
                  <span>{loadingMessage}</span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center gap-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <React.Fragment key={item._id || rowIndex}>
                <tr 
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${rowClassName}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {selectable && (
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => onSelectOne && onSelectOne(item._id, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-6 py-4 ${column.tdClassName || ''}`}
                    >
                      {column.render ? column.render(item, rowIndex) : item[column.key]}
                    </td>
                  ))}
                </tr>
                {expandedRowId === item._id && renderExpandedRow && (
                  <tr>
                    <td colSpan={columns.length + (selectable ? 1 : 0)} className="border-b border-gray-200">
                      {renderExpandedRow(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
