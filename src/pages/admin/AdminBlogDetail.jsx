import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../data/blog.json';

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Đang bán');
  const [category, setCategory] = useState('Thịt');

  useEffect(() => {
    // Find blog by id from data
    const blog = data.find((b) => b.id.toString() === id);
    if (blog) {
      setTitle(blog.title || '');
      setDescription(blog.summary || '');
      setImage(blog.image || '');
      setStatus(blog.status === 'published' ? 'Đang bán' : 'Ngừng bán');
      setCategory(blog.category || 'Thịt');
    } else {
      // If blog not found, navigate back to admin blog list
      navigate('/admin/blog');
    }
  }, [id, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle update blog logic
    alert('Cập nhật bài viết thành công!');
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/admin/blog');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-6">Chi tiết Blog</h1>
      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Left side - Overview */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Tổng quan</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="title">Tiêu Đề</label>
              <input
                id="title"
                type="text"
                required
                placeholder="Tiêu Đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">Tên bài blog</p>
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">Mô tả</label>
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
              {image ? (
                <img src={image} alt="Preview" className="h-24 object-contain rounded" />
              ) : (
                'Thêm hình ảnh'
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
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
          </div>
        </div>
      </form>

      <div className="flex justify-start gap-4 mt-6">
        <button
          type="submit"
          form="addBlogForm"
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

export default AdminBlogDetail;
