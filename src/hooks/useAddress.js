import { useState, useEffect } from 'react';
import { getAllAddress } from '../service/Address.service';

/**
 * Custom hook cho xử lý địa chỉ
 * @returns {Object} Các state và functions liên quan đến địa chỉ
 */
export const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Lấy danh sách địa chỉ từ API
   */
  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await getAllAddress();
      const addressList = res.data.data || [];
      setAddresses(addressList);
      
      // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
      const defaultAddr = addressList.find(a => a.is_default) || addressList[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
      
      return addressList;
    } catch (err) {
      setError('Không thể lấy danh sách địa chỉ');
      setAddresses([]);
      setSelectedAddress(null);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Chọn địa chỉ
   * @param {Object} address - Địa chỉ được chọn
   */
  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  /**
   * Chọn địa chỉ theo ID
   * @param {string} addressId - ID của địa chỉ
   */
  const selectAddressById = (addressId) => {
    const address = addresses.find(addr => addr._id === addressId);
    if (address) {
      setSelectedAddress(address);
    }
  };

  /**
   * Cập nhật danh sách địa chỉ
   * @param {Array} newAddresses - Danh sách địa chỉ mới
   */
  const updateAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    
    // Cập nhật địa chỉ được chọn nếu cần
    if (selectedAddress) {
      const updatedSelected = newAddresses.find(addr => addr._id === selectedAddress._id);
      if (updatedSelected) {
        setSelectedAddress(updatedSelected);
      } else {
        // Nếu địa chỉ được chọn không còn tồn tại, chọn địa chỉ mặc định
        const defaultAddr = newAddresses.find(a => a.is_default) || newAddresses[0];
        setSelectedAddress(defaultAddr || null);
      }
    }
  };

  /**
   * Thêm địa chỉ mới vào danh sách
   * @param {Object} newAddress - Địa chỉ mới
   */
  const addAddress = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    
    // Nếu đây là địa chỉ đầu tiên hoặc địa chỉ mặc định, tự động chọn
    if (addresses.length === 0 || newAddress.is_default) {
      setSelectedAddress(newAddress);
    }
  };

  /**
   * Xóa địa chỉ khỏi danh sách
   * @param {string} addressId - ID của địa chỉ cần xóa
   */
  const removeAddress = (addressId) => {
    setAddresses(prev => prev.filter(addr => addr._id !== addressId));
    
    // Nếu địa chỉ bị xóa là địa chỉ đang được chọn
    if (selectedAddress && selectedAddress._id === addressId) {
      const remainingAddresses = addresses.filter(addr => addr._id !== addressId);
      const newSelected = remainingAddresses.find(a => a.is_default) || remainingAddresses[0];
      setSelectedAddress(newSelected || null);
    }
  };

  /**
   * Cập nhật địa chỉ
   * @param {string} addressId - ID của địa chỉ cần cập nhật
   * @param {Object} updatedData - Dữ liệu cập nhật
   */
  const updateAddress = (addressId, updatedData) => {
    setAddresses(prev => prev.map(addr => 
      addr._id === addressId ? { ...addr, ...updatedData } : addr
    ));
    
    // Cập nhật địa chỉ được chọn nếu cần
    if (selectedAddress && selectedAddress._id === addressId) {
      setSelectedAddress(prev => ({ ...prev, ...updatedData }));
    }
  };

  /**
   * Kiểm tra xem có địa chỉ nào không
   * @returns {boolean} True nếu có địa chỉ
   */
  const hasAddresses = () => addresses.length > 0;

  /**
   * Kiểm tra xem có địa chỉ được chọn không
   * @returns {boolean} True nếu có địa chỉ được chọn
   */
  const hasSelectedAddress = () => !!selectedAddress;

  /**
   * Lấy địa chỉ mặc định
   * @returns {Object|null} Địa chỉ mặc định
   */
  const getDefaultAddress = () => addresses.find(addr => addr.is_default);

  /**
   * Lấy địa chỉ đầu tiên
   * @returns {Object|null} Địa chỉ đầu tiên
   */
  const getFirstAddress = () => addresses[0] || null;

  // Tự động fetch địa chỉ khi component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    // State
    addresses,
    selectedAddress,
    loading,
    error,
    
    // Actions
    fetchAddresses,
    selectAddress,
    selectAddressById,
    updateAddresses,
    addAddress,
    removeAddress,
    updateAddress,
    
    // Computed values
    hasAddresses: hasAddresses(),
    hasSelectedAddress: hasSelectedAddress(),
    defaultAddress: getDefaultAddress(),
    firstAddress: getFirstAddress(),
    
    // Helpers
    addressCount: addresses.length
  };
};
