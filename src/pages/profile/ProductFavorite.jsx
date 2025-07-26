import React, { useEffect, useState } from 'react';
import { getFavorites } from '../../service/Favorite.service';
import Product from '../../components/Product';

const ProductFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFavorites();
      if (response.data?.data) {
        // Lấy danh sách sản phẩm từ favorites
        const favoriteProducts = response.data.data.map(fav => fav.product_id).filter(Boolean);
        setFavorites(favoriteProducts);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Không thể tải sản phẩm yêu thích');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();

    // Lắng nghe sự kiện xóa sản phẩm khỏi favorite
    const handleFavoriteRemoved = (event) => {
      const { productId } = event.detail;
      setFavorites(prevFavorites => 
        prevFavorites.filter(product => product._id !== productId)
      );
    };

    // Lắng nghe sự kiện thêm sản phẩm vào favorite
    const handleFavoriteAdded = (event) => {
      const { product } = event.detail;
      setFavorites(prevFavorites => {
        // Kiểm tra xem sản phẩm đã có trong danh sách chưa
        const exists = prevFavorites.some(fav => fav._id === product._id);
        if (!exists) {
          return [...prevFavorites, product];
        }
        return prevFavorites;
      });
    };

    // Thêm event listeners
    window.addEventListener('favorite-removed', handleFavoriteRemoved);
    window.addEventListener('favorite-added', handleFavoriteAdded);

    // Cleanup event listeners khi component unmount
    return () => {
      window.removeEventListener('favorite-removed', handleFavoriteRemoved);
      window.removeEventListener('favorite-added', handleFavoriteAdded);
    };
  }, []);

  if (loading) return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải sản phẩm yêu thích...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="text-red-500 text-center py-8">{error}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
<h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="mt-2">Chưa có sản phẩm yêu thích nào</p>
            <p className="text-sm text-gray-400">Hãy thêm sản phẩm vào danh sách yêu thích để xem chúng ở đây</p>
          </div>
        ) : (
          favorites.map((product) => (
            <div key={product._id} className="p-2 min-w-[220px] max-w-[260px] mx-auto">
              <Product data={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductFavorite;