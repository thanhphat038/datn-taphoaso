import { useState, useEffect } from 'react';
import { getAllVouchers, validateVoucherAPI } from '../service/Voucher.service';

export const useVoucher = (subtotal) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // Fetch available vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoadingVouchers(true);
        const response = await getAllVouchers();
        const allVouchers = response.data.data || [];
        const activeVouchers = allVouchers.filter(v => v.status === 'active');
        setAvailableVouchers(activeVouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setAvailableVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    };
    fetchVouchers();
  }, []);

  // Apply voucher
  const handleApplyVoucher = async (code = null) => {
    const voucherCodeToUse = code || voucherCode;
    
    if (!voucherCodeToUse || !voucherCodeToUse.trim()) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      setVoucher(null);
      setVoucherDiscount(0);
      return;
    }

    try {
      const response = await validateVoucherAPI(voucherCodeToUse.trim(), subtotal);
      
      if (response.data.success) {
        const { voucher: voucherData, discountAmount } = response.data.data;
        
        setVoucher({
          code: voucherData.code,
          discount_type: voucherData.discount_type,
          discount_value: voucherData.discount_value,
          max_discount: voucherData.max_discount,
          min_order_value: voucherData.min_order_value
        });
        
        setVoucherCode(voucherData.code);
        setVoucherMessage(`Mã giảm giá ${voucherData.code} được áp dụng thành công!`);
        setVoucherDiscount(discountAmount);
      }
    } catch (error) {
      console.error('Lỗi apply voucher:', error);
      setVoucher(null);
      setVoucherDiscount(0);
      setVoucherMessage(
        error.response?.data?.message ||
        'Mã giảm giá không hợp lệ hoặc đã hết hạn.'
      );
    }
  };

  // Select voucher from dropdown
  const handleSelectVoucher = (selectedVoucher) => {
    if (!selectedVoucher || !selectedVoucher.code) return;
    
    setVoucherCode(selectedVoucher.code);
    setShowVoucherDropdown(false);
    handleApplyVoucher(selectedVoucher.code);
  };

  // Remove voucher
  const handleRemoveVoucher = () => {
    setVoucherCode('');
    setVoucherMessage('');
    setVoucherDiscount(0);
    setVoucher(null);
  };

  return {
    // States
    voucherCode,
    voucherMessage,
    voucherDiscount,
    voucher,
    showVoucherDropdown,
    availableVouchers,
    loadingVouchers,
    
    // Setters
    setVoucherCode,
    setVoucherMessage,
    setVoucherDiscount,
    setVoucher,
    setShowVoucherDropdown,
    
    // Functions
    handleApplyVoucher,
    handleSelectVoucher,
    handleRemoveVoucher,
  };
};
