import React, { useEffect, useState } from 'react';
import { getProductById } from '../../service/Admin.Service.jsx';
import { useFavorite } from '../../context/FavoriteContext';
import Product from '../../components/Product';

const ProductFavorite = () => {
  const { favoriteIds, removeFavorite } = useFavorite();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const prods = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              const res = await getProductById(id);
              return res.data?.data || res.data;
            } catch (e) { return null; }
          })
        );
        setProducts(prods.filter(Boolean));
      } catch (err) {
        setError('Không thể tải sản phẩm yêu thích');
      } finally {
        setLoading(false);
      }
    };
    if (favoriteIds.length > 0) fetchProducts();
    else setProducts([]);
  }, [favoriteIds]);

  if (loading) return <div>Đang tải sản phẩm yêu thích...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 py-6">
        {products.length === 0 && (
          <div className="col-span-full text-gray-500">
            Chưa có sản phẩm yêu thích nào
          </div>
        )}
        {products.map((product) => (
          <div key={product._id} className="p-2 min-w-[220px] max-w-[260px] mx-auto">
            <Product data={product} />
            {/* 
            <button
              onClick={() => removeFavorite(product._id)}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 z-10"
            >
              Xóa
            </button> 
            */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductFavorite; 