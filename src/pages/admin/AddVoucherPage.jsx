import React, { useState } from 'react';

const AddVoucherPage = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Hoạt động');
  const [searchActive, setSearchActive] = useState('');
  const [searchExpired, setSearchExpired] = useState('');

  const activeVouchers = [
    'MA777',
    'MA777',
    'MA777',
    'MA777',
    'MA777',
  ];

  const expiredVouchers = [
    'MA777',
    'MA777',
    'MA777',
    'MA777',
    'MA777',
  ];

  const handleSave = () => {
    // Implement save logic here
    alert('Lưu thay đổi thành công!');
  };

  const handleCancel = () => {
    // Reset form or navigate away
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Thêm Mã Giảm</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4">Tổng quát</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Tên mã giảm</label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Tên mã giảm bắt buộc"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Giá sản phẩm</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Loại giảm giá</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="discountType"
                      value="percentage"
                      checked={discountType === 'percentage'}
                      onChange={() => setDiscountType('percentage')}
                    />
                    Giảm theo %
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="discountType"
                      value="fixed"
                      checked={discountType === 'fixed'}
                      onChange={() => setDiscountType('fixed')}
                    />
                    Giá cố định
                  </label>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  {discountType === 'percentage' ? 'Nhập %' : 'Nhập giá giảm'}
                </label>
                {discountType === 'percentage' ? (
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="% giảm giá"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="Nhập số giá bạn muốn giảm"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Nhập giá tối đa</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Giá tối đa"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Nhập giá tối thiểu</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Giá tối thiểu"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Mô tả mã giảm</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="Mô tả sản phẩm"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-500"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-300 text-white px-6 py-2 rounded hover:bg-red-400"
            >
              Hủy bỏ
            </button>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-6 space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Trạng thái</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Hoạt động</option>
              <option>Không hoạt động</option>
            </select>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Danh sách mã giảm</h3>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchActive}
              onChange={(e) => setSearchActive(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
              {activeVouchers
                .filter((v) =>
                  v.toLowerCase().includes(searchActive.toLowerCase())
                )
                .map((v, idx) => (
                  <li key={idx} className="py-1 border-b last:border-b-0">
                    {v}
                  </li>
                ))}
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Danh sách mã giảm hết hạn</h3>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchExpired}
              onChange={(e) => setSearchExpired(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
              {expiredVouchers
                .filter((v) =>
                  v.toLowerCase().includes(searchExpired.toLowerCase())
                )
                .map((v, idx) => (
                  <li key={idx} className="py-1 border-b last:border-b-0">
                    {v}
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AddVoucherPage;