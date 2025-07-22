import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaPercentage, FaDollarSign, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';
import { getVoucherById, createVoucher, updateVoucher } from '../../service/Admin.Service.jsx';

const API_BASE_URL = 'http://localhost:3000/api';

const AddVoucherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    max_discount: '',
    min_order_value: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'active'
  });

  // Fetch voucher data if editing
  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          setLoading(true);
          const response = await getVoucherById(id);
          const voucher = response.data.data;
          // Format dates for input fields
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          setFormData({
            code: voucher.code || '',
            discount_type: voucher.discount_type || 'percentage',
            discount_value: voucher.discount_value?.toString() || '',
            max_discount: voucher.max_discount?.toString() || '',
            min_order_value: voucher.min_order_value?.toString() || '',
            start_date: formatDate(voucher.start_date) || '',
            end_date: formatDate(voucher.end_date) || '',
            description: voucher.description || '',
            status: voucher.status || 'active'
          });
        } catch (error) {
          setError('Không thể tải thông tin voucher: ' + (error.response?.data?.message || error.message));
        } finally {
          setLoading(false);
        }
      };
      fetchVoucher();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value
    }));
  };

  const validateForm = () => {
    if (!formData.code) {
      setError('Vui lòng nhập mã voucher');
      return false;
    }

    if (!formData.discount_value || Number(formData.discount_value) <= 0) {
      setError('Giá trị giảm giá phải lớn hơn 0');
      return false;
    }

    if (formData.discount_type === 'percentage' && Number(formData.discount_value) > 100) {
      setError('Phần trăm giảm giá không thể vượt quá 100%');
      return false;
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return false;
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }

    if (!formData.min_order_value || Number(formData.min_order_value) < 0) {
      setError('Giá trị đơn hàng tối thiểu không được âm');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError(null);
      const data = {
        ...formData,
        discount_value: Number(formData.discount_value),
        max_discount: formData.max_discount ? Number(formData.max_discount) : undefined,
        min_order_value: Number(formData.min_order_value)
      };
      if (id) {
        await updateVoucher(id, data);
      } else {
        await createVoucher(data);
      }
      navigate('/admin/voucher');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmMessage = 'Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.';
    if (window.confirm(confirmMessage)) {
      navigate('/admin/voucher');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Cập nhật thông tin voucher' : 'Tạo mã giảm giá mới cho khách hàng'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <AdminCard title="Thông tin chung">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã voucher <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaTicketAlt className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Nhập mã voucher"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Mã voucher phải là duy nhất</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Discount Settings */}
            <AdminCard title="Cài đặt giảm giá">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giảm giá
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.discount_type === 'percentage'
                        ? 'border-[#06AEF4] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="discount_type"
                        value="percentage"
                        checked={formData.discount_type === 'percentage'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.discount_type === 'percentage'
                          ? 'bg-[#06AEF4] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaPercentage className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Theo phần trăm</div>
                        <div className="text-sm text-gray-500">Giảm theo % giá trị đơn hàng</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.discount_type === 'fixed'
                        ? 'border-[#06AEF4] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="discount_type"
                        value="fixed"
                        checked={formData.discount_type === 'fixed'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.discount_type === 'fixed'
                          ? 'bg-[#06AEF4] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaDollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Số tiền cố định</div>
                        <div className="text-sm text-gray-500">Giảm một số tiền nhất định</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.discount_type === 'percentage' ? 'Phần trăm giảm (%)' : 'Số tiền giảm'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      {formData.discount_type === 'percentage' ? (
                        <FaPercentage className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FaDollarSign className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="number"
                      name="discount_value"
                      value={formData.discount_value}
                      onChange={handleChange}
                      min="0"
                      max={formData.discount_type === 'percentage' ? "100" : undefined}
                      step={formData.discount_type === 'percentage' ? "1" : "1000"}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    />
                  </div>
                </div>

                {formData.discount_type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giảm tối đa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaDollarSign className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="max_discount"
                        value={formData.max_discount}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị đơn hàng tối thiểu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaDollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="min_order_value"
                      value={formData.min_order_value}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Description */}
            <AdminCard title="Mô tả">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Nhập mô tả cho voucher"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <AdminCard title="Trạng thái">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Voucher {formData.status === 'active' ? 'có thể' : 'không thể'} được sử dụng
              </p>
            </AdminCard>

            {/* Information */}
            <AdminCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <FaInfoCircle className="w-5 h-5" />
                  <span className="font-medium">Thông tin thêm</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    Voucher chỉ có hiệu lực trong khoảng thời gian đã chọn
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    Mã voucher phải là duy nhất trong hệ thống
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    Giá trị giảm không được vượt quá giá trị đơn hàng
                  </li>
                  {formData.discount_type === 'percentage' && (
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      Phần trăm giảm giá không được vượt quá 100%
                    </li>
                  )}
                </ul>
              </div>
            </AdminCard>

            {/* Actions */}
            <AdminCard>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <ModalButton
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full justify-center"
                >
                  {loading ? 'Đang lưu...' : id ? 'Cập nhật voucher' : 'Tạo voucher'}
                </ModalButton>
                <ModalButton
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full justify-center"
                >
                  Hủy bỏ
                </ModalButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddVoucherPage;
