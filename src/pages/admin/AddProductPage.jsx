import React, { useState } from 'react';

const AddProductPage = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState('');
  const [status, setStatus] = useState('Đang bán');
  const [category, setCategory] = useState('Thịt');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    // TODO: Add logic to save new category
    alert(`Danh mục "${newCategoryName}" đã được thêm.`);
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(filesArray);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission logic
    alert('Lưu thay đổi thành công!');
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // TODO: handle cancel logic, e.g., navigate back or reset form
    alert('Hủy bỏ');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-6">Thêm Sản Phẩm</h1>
      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Left side - Overview */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Tổng quan</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="productName">Tên sản phẩm</label>
              <input
                id="productName"
                type="text"
                required
                placeholder="Tên sản phẩm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">Tên sản phẩm bắt buộc</p>
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">Mô tả sản phẩm</label>
              <textarea
                id="description"
                placeholder="Mô tả sản phẩm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Hình ảnh</h2>
            <label
              htmlFor="imageUpload"
              className="block w-full min-h-[6rem] bg-blue-200 rounded cursor-pointer flex items-center justify-center text-gray-700 hover:bg-blue-300"
            >
              {images.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((imgSrc, index) => (
                    <img key={index} src={imgSrc} alt={`Preview ${index}`} className="h-24 object-contain rounded" />
                  ))}
                </div>
              ) : (
                'Thêm hình ảnh'
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold mb-4">Giá sản phẩm</h2>
            <div>
              <label className="block mb-1 font-medium" htmlFor="price">Giá gốc</label>
              <input
                id="price"
                type="number"
                min="0"
                placeholder="Giá sản phẩm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">Đặt giá sản phẩm</p>
            </div>
            <div>
              <span className="block mb-1 font-medium">Loại giảm giá</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    value="none"
                    checked={discountType === 'none'}
                    onChange={() => {
                      setDiscountType('none');
                      setDiscountValue('');
                    }}
                  />
                  Không giảm giá
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    value="percent"
                    checked={discountType === 'percent'}
                    onChange={() => {
                      setDiscountType('percent');
                      setDiscountValue('');
                    }}
                  />
                  Giảm theo %
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    value="fixed"
                    checked={discountType === 'fixed'}
                    onChange={() => {
                      setDiscountType('fixed');
                      setDiscountValue('');
                    }}
                  />
                  Giá cố định
                </label>
              </div>
              {discountType === 'percent' && (
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="% giảm giá"
                  value={discountValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) >= 1 && Number(val) <= 100)) {
                      setDiscountValue(val);
                    }
                  }}
                  className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
              {discountType === 'fixed' && (
                <input
                  type="number"
                  min="0"
                  placeholder="Số tiền giảm (VND)"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right side - Status and Category */}
        <div className="w-64 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Trạng thái</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Đang bán</option>
              <option>Ngừng bán</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Chỉnh trạng thái sản phẩm</p>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold mb-4">Chi tiết sản phẩm</h2>
            <label className="block mb-2 font-medium" htmlFor="category">Thể loại</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Thịt</option>
              <option>Rau củ</option>
              <option>Đồ uống</option>
              <option>Đồ khô</option>
            </select>
            <button
              type="button"
              className="mt-2 w-full bg-[#06AEF4] text-white py-2 rounded hover:bg-blue-500"
              onClick={() => setShowCategoryModal(true)}
            >
              + Tạo danh mục mới
            </button>

            {showCategoryModal && (
              <>
                <div className="fixed inset-0 backdrop-combined backdrop-blur-xs z-40" onClick={() => setShowCategoryModal(false)}></div>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowCategoryModal(false)}
                    >
                      &#x2715;
                    </button>
                    <h2 className="text-lg font-semibold mb-4">Thêm danh mục</h2>
                    <form onSubmit={handleAddCategory}>
                      <label className="block mb-2 font-medium" htmlFor="categoryName">Tên danh mục</label>
                      <input
                        id="categoryName"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Tên danh mục bạn muốn đặt"
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                        required
                      />
                      <div className="flex justify-end gap-4">
                        <button
                          type="submit"
                          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-400"
                          onClick={() => setShowCategoryModal(false)}
                        >
                          Hủy bỏ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="flex justify-end gap-4 mt-6">
      <button
        type="submit"
        form="addProductForm"
        className="bg-[#06AEF4] text-white px-6 py-2 rounded hover:bg-blue-500"
        onClick={handleSubmit}
      >
        Lưu thay đổi
      </button>
      <button
        type="button"
        className="bg-red-300 text-white px-6 py-2 rounded hover:bg-red-400"
        onClick={handleCancel}
      >
        Hủy bỏ
      </button>
      </div>
    </div>
  );
};

export default AddProductPage;
