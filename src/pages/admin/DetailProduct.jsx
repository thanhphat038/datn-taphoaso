import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../data/db.json';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState('');
  const [status, setStatus] = useState('Đang bán');
  const [category, setCategory] = useState('Thịt');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const product = data.products.find((p) => p.id.toString() === id.toString());
    if (product) {
      setProductName(product.name);
      setDescription(product.description);
      setImages(product.images || []);
      setPrice(product.price);
      setStatus(product.status === 'active' ? 'Đang bán' : 'Ngừng bán');
      setCategory(product.category || 'Thịt');
      setDiscountType(product.discountType || 'none');
      setDiscountValue(product.discountValue || '');
    } else {
      alert('Sản phẩm không tồn tại');
      navigate('/admin/product');
    }
  }, [id, navigate]);

  const handleSave = () => {
    // TODO: Implement save logic (e.g., API call)
    alert('Lưu thay đổi thành công (giả lập)');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-6">Chi tiết sản phẩm</h1>
      <form className="flex gap-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Left side - Overview */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Tổng quan</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="productName">Tên sản phẩm</label>
              <input
                id="productName"
                type="text"
                value={productName}
                disabled={!isEditing}
                onChange={(e) => setProductName(e.target.value)}
                className={`w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">Mô tả sản phẩm</label>
              <textarea
                id="description"
                value={description}
                disabled={!isEditing}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className={`w-full border border-gray-300 rounded px-3 py-2 resize-none ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Hình ảnh</h2>
            <div className="block w-full min-h-[6rem] bg-blue-200 rounded flex items-center justify-center text-gray-700">
              {images.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((imgSrc, index) => (
                    <img key={index} src={imgSrc} alt={`Preview ${index}`} className="h-24 object-contain rounded" />
                  ))}
                </div>
              ) : (
                'Không có hình ảnh'
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold mb-4">Giá sản phẩm</h2>
            <div>
              <label className="block mb-1 font-medium" htmlFor="price">Giá gốc</label>
              <input
                id="price"
                type="number"
                value={price}
                disabled={!isEditing}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
              />
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
                    disabled={!isEditing}
                    onChange={() => setDiscountType('none')}
                  />
                  Không giảm giá
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    value="percent"
                    checked={discountType === 'percent'}
                    disabled={!isEditing}
                    onChange={() => setDiscountType('percent')}
                  />
                  Giảm theo %
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    value="fixed"
                    checked={discountType === 'fixed'}
                    disabled={!isEditing}
                    onChange={() => setDiscountType('fixed')}
                  />
                  Giá cố định
                </label>
              </div>
              {discountType === 'percent' && (
                <input
                  type="number"
                  value={discountValue}
                  disabled={!isEditing}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className={`mt-2 w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
                />
              )}
              {discountType === 'fixed' && (
                <input
                  type="number"
                  value={discountValue}
                  disabled={!isEditing}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className={`mt-2 w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
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
              disabled={!isEditing}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
            >
              <option>Đang bán</option>
              <option>Ngừng bán</option>
            </select>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold mb-4">Chi tiết sản phẩm</h2>
            <label className="block mb-2 font-medium" htmlFor="category">Thể loại</label>
            <select
              id="category"
              value={category}
              disabled={!isEditing}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full border border-gray-300 rounded px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
            >
              <option>Thịt</option>
              <option>Rau củ</option>
              <option>Đồ uống</option>
              <option>Đồ khô</option>
            </select>
          </div>
        </div>
      </form>

      <div className="flex justify-start gap-4 mt-6">
        {!isEditing ? (
          <>
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              onClick={() => navigate('/admin/product')}
            >
              Quay lại
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={handleSave}
            >
              Lưu
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              onClick={() => setIsEditing(false)}
            >
              Hủy bỏ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;