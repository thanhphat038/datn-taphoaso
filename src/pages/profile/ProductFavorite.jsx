import React, { useEffect, useState } from 'react';
import { getFavorites } from '../../service/Favorite.service';
import { dataProductDetail } from '../../service/Product.service';
import Product from '../../components/Product';
import { useToast } from '../../components/ToastContainer';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProductFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

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
      
      if (!userId) {
        setIsAuthenticated(false);
        setFavorites([]);
        return;
      }
      
      setIsAuthenticated(true);
      const response = await getFavorites(userId);
      if (response.data?.data) {
        // Lấy danh sách sản phẩm từ favorites - kiểm tra xem có thông tin đầy đủ không
        const favoriteProducts = [];
        const productIdsToFetch = [];
        
        for (const fav of response.data.data) {
          // Nếu fav.product_id chỉ là ID, cần lấy thông tin đầy đủ
          if (typeof fav.product_id === 'string' || (typeof fav.product_id === 'object' && !fav.product_id.name)) {
            const productId = typeof fav.product_id === 'string' ? fav.product_id : fav.product_id._id;
            productIdsToFetch.push(productId);
          } else {
            favoriteProducts.push(fav.product_id);
          }
        }
        
        // Fetch thông tin đầy đủ cho các sản phẩm chỉ có ID
        if (productIdsToFetch.length > 0) {
          try {
            const productPromises = productIdsToFetch.map(id => dataProductDetail(id));
            const productResponses = await Promise.all(productPromises);
            const fullProducts = productResponses.map(res => res.data.data || res.data);
            favoriteProducts.push(...fullProducts);
          } catch (fetchError) {
            console.error('Error fetching product details:', fetchError);
          }
        }
        
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

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = favorites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-3">Sản phẩm yêu thích</h2>
        <div className="text-center py-6">
          <div className="text-yellow-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">Yêu cầu đăng nhập</h3>
          <p className="text-gray-600 mb-3 text-sm">Vui lòng đăng nhập để xem sản phẩm yêu thích</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Sản phẩm yêu thích</h2>
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm">Đang tải sản phẩm yêu thích...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Sản phẩm yêu thích</h2>
      <div className="text-red-500 text-center py-6 text-sm">{error}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sản phẩm yêu thích</h2>
        {favorites.length > 0 && (
          <span className="text-sm text-gray-500">
            {favorites.length} sản phẩm • Trang {currentPage} / {totalPages}
          </span>
        )}
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mt-2 text-sm">Chưa có sản phẩm yêu thích nào</p>
          <p className="text-xs text-gray-400 mb-3">Hãy thêm sản phẩm vào danh sách yêu thích để xem chúng ở đây</p>
          
          {!isAuthenticated && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Bạn cần đăng nhập để sử dụng tính năng yêu thích</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-xs"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Grid sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {currentItems.map((product) => {
              // Callback để hiển thị thông báo khi thêm vào giỏ hàng thành công
              const handleAddToCartSuccess = (message, type = 'success') => {
                if (type === 'success') {
                  showSuccess(message);
                } else {
                  showError(message);
                }
              };

              return (
                <div key={product._id} className="w-full">
                  <Product 
                    data={product} 
                    isFavorited={true} 
                    onAddToCartSuccess={handleAddToCartSuccess}
                  />
                </div>
              );
            })}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {/* Nút Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Số trang */}
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                  disabled={pageNumber === '...'}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNumber === currentPage
                      ? 'bg-blue-600 text-white'
                      : pageNumber === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Nút Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductFavorite;