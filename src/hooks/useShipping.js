import { useState } from 'react';
import { calculateShippingFee } from '../service/Shipping.service';

/**
 * Custom hook cho xử lý phí vận chuyển
 * @returns {Object} Các state và functions liên quan đến shipping
 */
export const useShipping = () => {
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  /**
   * Tính phí vận chuyển cho địa chỉ
   * @param {Object} address - Địa chỉ giao hàng
   * @param {string} service - Dịch vụ vận chuyển (mặc định: 'vietmap')
   * @returns {Promise<boolean>} True nếu thành công, false nếu thất bại
   */
  const calculateShippingFeeForAddress = async (address, service = 'vietmap') => {

    if (!address) {
      setShippingError('Không có địa chỉ để tính phí vận chuyển');
      return false;
    }
    
    setIsCalculatingShipping(true);
    setShippingError(null);
    
    try {
      const deliveryAddress = `${address.address_detail}, ${address.ward}, ${address.district}, ${address.city}`;
      const shippingResponse = await calculateShippingFee(deliveryAddress, service);
      
      if (shippingResponse.success && shippingResponse.shippingFee !== undefined) {
        setShippingFee(shippingResponse.shippingFee);
        return true;
      } else {
        // Nếu API trả về lỗi, giữ phí mặc định là 0 (miễn phí)
        setShippingFee(0);
        setShippingError(shippingResponse.message || 'Không thể tính phí vận chuyển, áp dụng miễn phí');
        console.log('Shipping API error, using default free shipping:', shippingResponse.message);
        return false;
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      setShippingFee(0); // Mặc định miễn phí nếu có lỗi
      setShippingError('Có lỗi khi tính phí vận chuyển, áp dụng miễn phí');
      return false;
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  /**
   * Reset phí vận chuyển về 0
   */
  const resetShippingFee = () => {
    setShippingFee(0);
    setShippingError(null);
  };

  /**
   * Kiểm tra xem có đang tính phí vận chuyển không
   * @returns {boolean} True nếu đang tính
   */
  const isCalculating = () => isCalculatingShipping;

  /**
   * Kiểm tra xem có phí vận chuyển không
   * @returns {boolean} True nếu có phí
   */
  const hasShippingFee = () => shippingFee > 0;

  /**
   * Kiểm tra xem có lỗi khi tính phí vận chuyển không
   * @returns {boolean} True nếu có lỗi
   */
  const hasShippingError = () => !!shippingError;

  /**
   * Lấy text hiển thị phí vận chuyển
   * @returns {string} Text hiển thị
   */
  const getShippingFeeDisplay = () => {
    if (isCalculatingShipping) {
      return 'Đang tính...';
    }
    
    if (shippingFee === 0) {
      return 'Miễn phí';
    }
    
    return `${shippingFee.toLocaleString()} đ`;
  };

  /**
   * Lấy class CSS cho hiển thị phí vận chuyển
   * @returns {string} CSS class
   */
  const getShippingFeeColorClass = () => {
    if (isCalculatingShipping) {
      return 'text-gray-500';
    }
    
    if (shippingFee === 0) {
      return 'text-green-600';
    }
    
    return 'text-gray-800';
  };

  return {
    // State
    shippingFee,
    isCalculatingShipping,
    shippingError,
    
    // Actions
    calculateShippingFeeForAddress,
    resetShippingFee,
    
    // Computed values
    isCalculating: isCalculating(),
    hasShippingFee: hasShippingFee(),
    hasShippingError: hasShippingError(),
    shippingFeeDisplay: getShippingFeeDisplay(),
    shippingFeeColorClass: getShippingFeeColorClass(),
    
    // Helpers
    isFreeShipping: shippingFee === 0
  };
};
