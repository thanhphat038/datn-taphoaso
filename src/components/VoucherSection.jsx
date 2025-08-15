import React from 'react';
import { FaGift, FaChevronDown } from 'react-icons/fa';

const VoucherSection = ({
  voucherCode,
  voucherMessage,
  voucherDiscount,
  voucher,
  showVoucherDropdown,
  availableVouchers,
  loadingVouchers,
  onVoucherCodeChange,
  onApplyVoucher,
  onSelectVoucher,
  onRemoveVoucher,
  onToggleDropdown,
  disabled = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <FaGift className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Mã giảm giá</h2>
      </div>

      <div className="space-y-4">
        {/* Voucher input với dropdown */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Nhập mã giảm giá hoặc chọn từ danh sách"
                value={voucherCode}
                onChange={(e) => onVoucherCodeChange(e.target.value)}
                onFocus={() => onToggleDropdown(true)}
                disabled={disabled}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => onToggleDropdown(!showVoucherDropdown)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaChevronDown className={`w-4 h-4 transition-transform ${showVoucherDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <button
              onClick={() => onApplyVoucher()}
              disabled={!voucherCode || !voucherCode.trim() || disabled}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </div>

          {/* Voucher dropdown */}
          {showVoucherDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {loadingVouchers ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  Đang tải danh sách voucher...
                </div>
              ) : availableVouchers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Không có voucher khả dụng
                </div>
              ) : (
                <div className="py-2">
                  {availableVouchers.map((voucher) => (
                    <button
                      key={voucher._id}
                      onClick={() => onSelectVoucher(voucher)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{voucher.code}</div>
                          <div className="text-sm text-gray-600">
                            {voucher.discount_type === 'percentage' 
                              ? `Giảm ${voucher.discount_value}% tối đa ${(voucher.max_discount || 0).toLocaleString()}đ` 
                              : `Giảm ${(voucher.discount_value || 0).toLocaleString()}đ`
                            }
                          </div>
                          {voucher.min_order_value && (
                            <div className="text-xs text-gray-500">
                              Đơn hàng tối thiểu: {voucher.min_order_value?.toLocaleString()}đ
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          {voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voucher message */}
        {voucherMessage && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            voucherDiscount > 0 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {voucherDiscount > 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {voucherMessage}
          </div>
        )}

        {/* Applied voucher info */}
        {voucher && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-800">Mã {voucher.code} đã áp dụng!</div>
                <div className="text-sm text-green-600">
                  {voucher.discount_type === 'percentage'
                    ? `Giảm ${voucher.discount_value}% tối đa ${voucher.max_discount?.toLocaleString()}đ`
                    : `Giảm ${voucher.discount_value?.toLocaleString()}đ`}
                </div>
              </div>
              <button
                onClick={onRemoveVoucher}
                className="text-green-600 hover:text-green-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherSection;
