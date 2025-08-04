import React, { useEffect, useState } from 'react';
import { getFavorites } from '../../service/Favorite.service';
import { dataProductDetail } from '../../service/Product.service';
import Product from '../../components/Product';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProductFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Lấy user_id từ token
  const getUserId = () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      console.log('🔍 Debug - User ID:', userId);
      
      if (!userId) {
        console.log('🔒 User not authenticated, skipping favorites fetch');
        setIsAuthenticated(false);
        setFavorites([]);
        return;
      }
      
      setIsAuthenticated(true);
      const response = await getFavorites(userId);
      console.log('🔍 Debug - Favorites response:', response);
      if (response.data?.data) {
        // Lấy danh sách sản phẩm từ favorites - kiểm tra xem có thông tin đầy đủ không
        const favoriteProducts = [];
        const productIdsToFetch = [];
        
        for (const fav of response.data.data) {
          // Nếu fav.product_id chỉ là ID, cần lấy thông tin đầy đủ
          if (typeof fav.product_id === 'string' || (typeof fav.product_id === 'object' && !fav.product_id.name)) {
            console.log('🔍 Debug - Product ID only:', fav.product_id);
            const productId = typeof fav.product_id === 'string' ? fav.product_id : fav.product_id._id;
            productIdsToFetch.push(productId);
          } else {
            favoriteProducts.push(fav.product_id);
          }
        }
        
        console.log('🔍 Debug - Products with full data:', favoriteProducts);
        console.log('🔍 Debug - Product IDs to fetch:', productIdsToFetch);
        
        // Fetch thông tin đầy đủ cho các sản phẩm chỉ có ID
        if (productIdsToFetch.length > 0) {
          try {
            const productPromises = productIdsToFetch.map(id => dataProductDetail(id));
            const productResponses = await Promise.all(productPromises);
            const fullProducts = productResponses.map(res => res.data.data || res.data);
            console.log('🔍 Debug - Fetched full products:', fullProducts);
            favoriteProducts.push(...fullProducts);
          } catch (fetchError) {
            console.error('Error fetching product details:', fetchError);
          }
        }
        
        setFavorites(favoriteProducts);
      } else {
        console.log('🔍 Debug - No favorites data found');
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
    let isMounted = true;
    
    const loadFavorites = async () => {
      if (!isMounted) return;
      await fetchFavorites();
    };
    
    loadFavorites();

    // Lắng nghe sự kiện xóa sản phẩm khỏi favorite
    const handleFavoriteRemoved = (event) => {
      if (!isMounted) return;
      const { productId } = event.detail;
      setFavorites(prevFavorites => 
        prevFavorites.filter(product => product._id !== productId)
      );
    };

    // Lắng nghe sự kiện thêm sản phẩm vào favorite
    const handleFavoriteAdded = (event) => {
      if (!isMounted) return;
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
      isMounted = false;
      window.removeEventListener('favorite-removed', handleFavoriteRemoved);
      window.removeEventListener('favorite-added', handleFavoriteAdded);
    };
  }, []);

  // Show login prompt if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
        <div className="text-center py-8">
          <div className="text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Yêu cầu đăng nhập</h3>
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem sản phẩm yêu thích</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-gray-400 mb-4">Hãy thêm sản phẩm vào danh sách yêu thích để xem chúng ở đây</p>
            
            {!isAuthenticated && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Bạn cần đăng nhập để sử dụng tính năng yêu thích</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Đăng nhập ngay
                </button>
              </div>
            )}
          </div>
        ) : (
          favorites.map((product) => {
            console.log('🔍 Debug - Rendering product:', product);
            return (
              <div key={product._id} className="p-2 min-w-[220px] max-w-[260px] mx-auto">
                <Product data={product} isFavorited={true} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductFavorite;