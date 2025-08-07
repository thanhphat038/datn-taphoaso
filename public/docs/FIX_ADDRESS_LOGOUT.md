# Sửa lỗi địa chỉ vẫn còn khi đổi tài khoản

## Vấn đề
Khi người dùng đổi tài khoản khác (logout và login tài khoản mới), địa chỉ của tài khoản cũ vẫn còn hiển thị trong trang quản lý địa chỉ.

## Nguyên nhân
1. **Không xóa dữ liệu localStorage**: Khi logout chỉ xóa `auth_token` cookie nhưng không xóa dữ liệu user trong localStorage
2. **State không được reset**: Các component không reset state khi token thay đổi
3. **Không có cơ chế đồng bộ**: Không có cách để các component biết khi user logout

## Giải pháp đã thực hiện

### 1. Tạo AuthContext để quản lý authentication globally
**File**: `src/context/AuthContext.jsx`
- Tạo context để quản lý trạng thái authentication
- Cung cấp `login()`, `logout()`, `isAuthenticated` cho toàn bộ app
- Tự động sync trạng thái giữa các tab/window
- Dispatch events để các component khác biết khi user login/logout

### 2. Cập nhật App.jsx để sử dụng AuthProvider
**File**: `src/App.jsx`
- Wrap toàn bộ app với `AuthProvider`
- Đảm bảo tất cả component có thể truy cập authentication state

### 3. Cải thiện component Address hoàn toàn
**File**: `src/pages/profile/Address.jsx`
- Sử dụng `useAuth()` hook thay vì kiểm tra token trực tiếp
- Thêm `resetAllState()` function để reset toàn bộ state
- Thêm `checkAuth()` function để kiểm tra authentication
- Listen cho authentication changes thay vì token changes
- Force reset state khi user không authenticated

### 4. Cập nhật tất cả component để sử dụng AuthContext
**Files**: 
- `src/pages/LoginPage.jsx` - Sử dụng `login()` từ AuthContext
- `src/pages/ProfilePage.jsx` - Sử dụng `logout()` từ AuthContext
- `src/components/Header.jsx` - Sử dụng `isAuthenticated` và `logout()`
- `src/components/admin/AdminLayout.jsx` - Sử dụng `logout()` từ AuthContext

### 5. Cải thiện logout function
**File**: `src/service/UserService.jsx`
- Sử dụng `clearAuthData()` utility function
- Xóa sạch tất cả dữ liệu (cookies, localStorage, sessionStorage)
- Redirect về `/login` thay vì reload

## Các thay đổi chi tiết

### 1. AuthContext implementation
**File**: `src/context/AuthContext.jsx`
```javascript
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    Cookies.set('auth_token', token, { expires: 7 });
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new CustomEvent('user-login', { detail: userData }));
  };

  const logout = () => {
    Cookies.remove('auth_token');
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new CustomEvent('user-logout'));
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Address component với AuthContext
```javascript
const Address = () => {
  const { isAuthenticated, logout } = useAuth();
  
  const resetAllState = () => {
    setAddresses([]);
    setShowAddForm(false);
    // ... reset all other states
  };

  const checkAuth = () => {
    if (!isAuthenticated) {
      resetAllState();
      logout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      resetAllState();
    }
  }, [isAuthenticated]);
};
```

### 2. Event listener trong Address component
```javascript
useEffect(() => {
  const handleUserLogout = () => {
    setAddresses([]);
    setShowAddForm(false);
    setEditId(null);
    setNewAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
    setEditAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
  };

  window.addEventListener('user-logout', handleUserLogout);
  
  return () => {
    window.removeEventListener('user-logout', handleUserLogout);
  };
}, []);
```

### 3. Cải thiện kiểm tra token trong fetchAddresses
```javascript
const fetchAddresses = async () => {
  // Kiểm tra token mới mỗi lần gọi
  const currentToken = Cookies.get('auth_token');
  
  // Chỉ fetch khi có token
  if (!currentToken) {
    setAddresses([]);
    return;
  }
  // ... rest of the function
};
```

### 4. Force reload khi login
**File**: `src/pages/LoginPage.jsx`
```javascript
// Force reload để reset tất cả state
if (user.role === 'admin') {
  window.location.href = '/admin';
} else {
  window.location.href = '/';
}
```

### 5. User Isolation - Mỗi user chỉ thấy địa chỉ của mình
**File**: `src/pages/profile/Address.jsx`
```javascript
// Reset state khi component mount và khi token thay đổi
useEffect(() => {
  if (!checkAuth()) return;
  
  // Reset state trước khi fetch
  resetAllState();
  
  // Fetch dữ liệu
  fetchAddresses();
  getProvinces().then(res => setCities(res.data));
}, [Cookies.get('auth_token')]); // Thêm dependency để re-run khi token thay đổi

// Listen for user login/logout events
useEffect(() => {
  const handleUserLogout = () => {
    console.log('🚪 User logout detected, resetting addresses...');
    resetAllState();
  };

  const handleUserLogin = () => {
    console.log('🚪 User login detected, refreshing addresses...');
    resetAllState();
    setTimeout(() => {
      if (checkAuth()) {
        fetchAddresses();
      }
    }, 100);
  };

  window.addEventListener('user-logout', handleUserLogout);
  window.addEventListener('user-login', handleUserLogin);
  
  return () => {
    window.removeEventListener('user-logout', handleUserLogout);
    window.removeEventListener('user-login', handleUserLogin);
  };
}, []);
```

### 6. Dispatch login event
**File**: `src/pages/LoginPage.jsx`
```javascript
// Dispatch login event để các component khác biết
window.dispatchEvent(new CustomEvent('user-login', { detail: user }));
```

### 7. Backend API Enhancement - User-specific addresses
**File**: `be/src/routes/address.route.js`
```javascript
// Get user addresses (current user only)
router.get('/user/me', getUserAddresses);
```

**File**: `src/service/Address.service.js`
```javascript
export const getAllAddress = () => {
    return axios.get(`${api}/addresses/user/me`, { headers: getAuthHeaders() });
};
```

### 8. Advanced User Isolation
**File**: `src/pages/profile/Address.jsx`
```javascript
// Force refresh addresses khi token thay đổi
useEffect(() => {
  const token = Cookies.get('auth_token');
  if (!token) {
    resetAllState();
    return;
  }
  
  console.log('🔄 Token changed, refreshing addresses...');
  resetAllState();
  setTimeout(() => {
    if (checkAuth()) {
      fetchAddresses();
      getProvinces().then(res => setCities(res.data));
    }
  }, 100);
}, [Cookies.get('auth_token')]);
```

### 9. Profile Page Protection
**File**: `src/components/ProtectedRoute.jsx`
```javascript
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced authentication check with periodic validation
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('auth_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate(redirectTo);
        return false;
      }
      // ... validation logic
    };
  }, [navigate, redirectTo]);
};
```

**File**: `src/App.jsx`
```javascript
<Route path="/profile/*" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

**File**: `src/pages/ProfilePage.jsx`
```javascript
// Enhanced authentication check and redirect
useEffect(() => {
  const checkAuthAndRedirect = () => {
    const token = Cookies.get("auth_token");
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
      return false;
    }
    // ... validation logic
  };
}, [navigate]);
```

### 10. Favorites API Protection
**File**: `src/components/Product.jsx`
```javascript
// Kiểm tra trạng thái yêu thích khi component mount
useEffect(() => {
  // Kiểm tra xem user đã đăng nhập chưa
  const userId = getUserId();
  if (!userId) {
    console.log('🔒 User not logged in, skipping favorite check');
    setIsFavorite(false);
    return;
  }
  
  // ... API call logic
}, [product._id, isFavorited]);
```

**File**: `src/service/Favorite.service.js`
```javascript
export const getFavorites = (userId) => {
  // Kiểm tra authentication trước
  const token = Cookies.get('auth_token');
  if (!token) {
    console.log('🔒 No auth token found, skipping favorites fetch');
    return Promise.reject(new Error('No authentication token'));
  }
  
  // ... API call logic
};
```

### 11. Buy Now Flow Enhancement
**File**: `src/components/Product.jsx`
```javascript
const handleBuyNow = async () => {
  const userId = getUserId();
  if (!userId) {
    console.log('🔒 User not logged in, redirecting to login page');
    
    // Lưu thông tin sản phẩm để mua ngay sau khi đăng nhập
    const buyNowProduct = {
      productId: product._id,
      name: productName,
      price: productPrice,
      quantity: 1,
      image: imageUrl,
      originalPrice: product.original_price || productPrice
    }
    localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
    
    // Hiện thông báo ngắn và chuyển về trang đăng nhập
    showAlert({
      title: 'Yêu cầu đăng nhập',
      message: 'Đang chuyển đến trang đăng nhập...',
      type: 'warning'
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
    
    return;
  }
  // ... normal flow
};
```

**File**: `src/pages/LoginPage.jsx`
```javascript
// Kiểm tra xem có sản phẩm "mua ngay" đã lưu không
const buyNowProduct = localStorage.getItem('buyNowProduct');

if (buyNowProduct) {
  console.log('🛒 Found buy now product, redirecting to checkout');
  localStorage.removeItem('buyNowProduct'); // Xóa sau khi sử dụng
  
  // Force reload để reset tất cả state và chuyển đến checkout
  window.location.href = '/checkout';
} else {
  // Normal redirect
  window.location.href = '/';
}
```

### 12. Favorites Page Enhancement
**File**: `src/pages/profile/ProductFavorite.jsx`
```javascript
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
```

### 13. Favorite Button Enhancement
**File**: `src/components/Product.jsx`
```javascript
const handleToggleFavorite = async (e) => {
  e.stopPropagation();
  e.preventDefault();
  
  if (loadingFavorite) return;
  
  const userId = getUserId();
  if (!userId) {
    console.log('🔒 User not logged in, showing login prompt for favorite');
    
    // Hiện thông báo với tùy chọn chuyển về trang đăng nhập
    showAlert({
      title: 'Yêu cầu đăng nhập',
      message: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích',
      type: 'warning',
      actions: [
        {
          label: 'Đăng nhập ngay',
          onClick: () => {
            navigate('/login');
          }
        }
      ]
    });
    return;
  }
  // ... normal flow
};
```
```javascript
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced authentication check with periodic validation
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('auth_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate(redirectTo);
        return false;
      }
      // ... validation logic
    };
  }, [navigate, redirectTo]);
};
```

**File**: `src/App.jsx`
```javascript
<Route path="/profile/*" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

**File**: `src/pages/ProfilePage.jsx`
```javascript
// Enhanced authentication check and redirect
useEffect(() => {
  const checkAuthAndRedirect = () => {
    const token = Cookies.get("auth_token");
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
      return false;
    }
    // ... validation logic
  };
}, [navigate]);
```

## Kết quả
- ✅ Khi logout, tất cả dữ liệu user được xóa sạch
- ✅ Địa chỉ được reset khi đổi tài khoản
- ✅ Mỗi user chỉ thấy địa chỉ của mình
- ✅ Không bị dính địa chỉ của user khác
- ✅ Hiển thị thông báo phù hợp khi chưa đăng nhập
- ✅ Các component đồng bộ với trạng thái đăng nhập
- ✅ Trải nghiệm người dùng nhất quán
- ✅ **Profile page được bảo vệ - chỉ user đã đăng nhập mới truy cập được**
- ✅ **Tự động redirect về login khi chưa đăng nhập**
- ✅ **Loading state và access denied UI**
- ✅ **Periodic authentication check**
- ✅ **Favorites API được bảo vệ - không gọi API khi chưa đăng nhập**
- ✅ **Không còn lỗi 401 Unauthorized trong console**
- ✅ **Product component kiểm tra authentication trước khi gọi favorites API**
- ✅ **Buy Now flow được cải thiện - tự động chuyển về trang đăng nhập**
- ✅ **Sản phẩm được lưu tạm thời và chuyển đến checkout sau khi đăng nhập**
- ✅ **Add to Cart có tùy chọn "Đăng nhập ngay"**
- ✅ **Favorites page có nút "Đăng nhập ngay" giống giỏ hàng**
- ✅ **Trang yêu thích hiển thị login prompt khi chưa đăng nhập**
- ✅ **Nút favorite hiển thị "Đăng nhập ngay" thay vì "OK"**
- ✅ **Tất cả các nút yêu thích đều có tùy chọn đăng nhập**

## Cách test
1. Đăng nhập với tài khoản A
2. Thêm một số địa chỉ
3. Logout
4. Đăng nhập với tài khoản B
5. Kiểm tra trang địa chỉ - chỉ hiển thị địa chỉ của tài khoản B 