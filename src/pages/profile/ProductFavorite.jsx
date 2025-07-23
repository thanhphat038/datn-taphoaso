import React, { useEffect, useState } from 'react';
import { getFavorites, removeFromFavorite } from '../../service/Favorite.service';
import { formatCurrency } from '../../components/Product';
import { getProductById } from '../../service/Admin.Service.jsx';

const ProductFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavorites();
      const favs = res.data?.data || [];
      // Lấy chi tiết sản phẩm cho từng favorite
      const favsWithProduct = await Promise.all(favs.map(async fav => {
        let product = null;
        try {
          const productRes = await getProductById(fav.product_id);
          product = productRes?.data?.data || productRes?.data;
        } catch (e) {}
        return { ...fav, product };
      }));
      setFavorites(favsWithProduct);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi yêu thích?')) return;
    try {
      await removeFromFavorite(productId);
      setFavorites(favorites.filter(fav => fav.product?._id !== productId));
    } catch (err) {
      alert('Lỗi khi xóa sản phẩm khỏi yêu thích!');
    }
  };

  if (loading) return <div>Đang tải sản phẩm yêu thích...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favorites.length === 0 && <div className="col-span-full text-gray-500">Chưa có sản phẩm yêu thích nào</div>}
        {favorites
          .filter(fav => fav.product && fav.product._id)
          .map(fav => (
            <div key={fav._id || fav.product._id} className="bg-gray-50 rounded-lg p-3 flex flex-col">
              <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                <img src={fav.product?.images?.[0] || '/images/image_product.png'} alt={fav.product?.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 truncate">{fav.product?.name}</h3>
              <p className="text-red-500 font-semibold mb-3">{formatCurrency(fav.product?.price)}</p>
              <button onClick={() => handleRemove(fav.product?._id)} className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
            </div>
          ))}
      </div>
    </div>
  );
};
export default ProductFavorite; 