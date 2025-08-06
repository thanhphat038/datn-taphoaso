import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaEye,
  FaEyeSlash,
  FaImage,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminCard from "../../components/admin/AdminCard";
import AdminTable from "../../components/admin/AdminTable";
import AdminSearchFilter from "../../components/admin/AdminSearchFilter";
import AdminPagination from "../../components/admin/AdminPagination";
import AdminActionDropdown from "../../components/admin/AdminActionDropdown";
import { getAllCategories } from '../../service/Admin.Service.jsx';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm: " + error.message);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories for mapping
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        // Không cần setError ở đây, chỉ cần để danh mục là [] nếu lỗi
      }
    };
    fetchCategories();
  }, []);

  // Handle edit product
  const handleEditProduct = (productId) => {
    navigate(`/admin/addproduct/${productId}`);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId, productName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?\n\nHành động này không thể hoàn tác!`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts(products.filter((p) => p._id !== productId));
      setMessage('Xóa sản phẩm thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa sản phẩm: ' + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle product status
  const handleToggleStatus = async (productId, currentStatus, productName) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = currentStatus === "active" ? "deactivate" : "activate";
    const actionText = currentStatus === "active" ? "ẩn" : "hiện";

    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} sản phẩm "${productName}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/${action}`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} product`);
      }

      setProducts(
        products.map((p) =>
          p._id === productId ? { ...p, status: newStatus } : p
        )
      );
      setMessage(`Đã ${actionText} sản phẩm thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} sản phẩm: ` + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const now = new Date();

  const filteredProducts = products.filter((product) => {
    const createdAt = new Date(product.created_at || product.create_at || 0);
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "Today") {
      matchesDate = createdAt.toDateString() === now.toDateString();
    } else if (dateFilter === "Last7Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = createdAt >= sevenDaysAgo;
    } else if (dateFilter === "ThisMonth") {
      matchesDate =
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear();
    }

    let matchesStock = true;
    if (stockFilter === "inStock") {
      matchesStock = (product.in_stock || 0) > 0;
    } else if (stockFilter === "outOfStock") {
      matchesStock = (product.in_stock || 0) === 0;
    }

    return matchesSearch && matchesStatus && matchesDate && matchesStock;
  });

  // Apply sorting on filtered result
  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.created_at || a.create_at || 0);
    const dateB = new Date(b.created_at || b.create_at || 0);

    if (dateFilter === "Newest") return dateB - dateA;
    if (dateFilter === "Oldest") return dateA - dateB;
    if (priceFilter === "LowToHigh") return (a.price || 0) - (b.price || 0);
    if (priceFilter === "HighToLow") return (b.price || 0) - (a.price || 0);

    return dateB - dateA; // Mặc định sắp xếp mới nhất
  });

  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Get product status info
  const getProductStatusInfo = (status) => {
    if (status === "active") {
      return {
        label: "Hoạt động",
        color: "bg-green-100 text-green-800 border-green-200",
        dotColor: "bg-green-500",
      };
    } else {
      return {
        label: "Không hoạt động",
        color: "bg-red-100 text-red-800 border-red-200",
        dotColor: "bg-red-500",
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (product) => {
        const truncateDescription = (desc, wordLimit = 5) => {
          if (!desc) return "Không có mô tả";
          const words = desc.split(" ");
          if (words.length <= wordLimit) return desc;
          return words.slice(0, wordLimit).join(" ") + "...";
        };
        return (
          <div className=" flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.images && product.images[0] && !product.images[0].startsWith('blob:') ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-gray-200 flex items-center justify-center"
                style={{
                  display:
                    product.images && product.images[0] && !product.images[0].startsWith('blob:') ? "none" : "flex",
                }}
              >
                <FaImage className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {product.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {truncateDescription(product.description)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      key: "category",
      render: (product) => {
        let categoryName = "Chưa phân loại";
        if (product.category_id) {
          if (typeof product.category_id === 'object' && product.category_id.name) {
            categoryName = product.category_id.name;
          } else if (typeof product.category_id === 'string') {
            const found = categories.find(c => c._id === product.category_id);
            if (found) categoryName = found.name;
          }
        }
        return (
          <div className="text-sm text-gray-600">{categoryName}</div>
        );
      },
    },
    {
      title: "Giá bán",
      key: "price",
      render: (product) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {formatCurrency(product.price)}
          </div>
          {product.original_price && product.original_price > product.price && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(product.original_price)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Kho",
      key: "in_stock",
      render: (product) => (
        <div className="text-center">
          <div
            className={`font-semibold ${
              (product.in_stock || 0) > 10
                ? "text-green-600"
                : (product.in_stock || 0) > 0
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {product.in_stock || 0}
          </div>
          <div className="text-xs text-gray-500">
            {(product.in_stock || 0) > 10
              ? "Còn hàng"
              : (product.in_stock || 0) > 0
              ? "Sắp hết"
              : "Hết hàng"}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      render: (product) => (
        <div className="text-sm text-gray-600 text-center">
          {product.created_at || product.create_at
            ? new Date(
                product.created_at || product.create_at
              ).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (product) => {
        const statusInfo = getProductStatusInfo(product.status);
        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${statusInfo.color}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}
            ></span>
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (product) => (
        <AdminActionDropdown
          actions={[
            {
              label: "Chỉnh sửa",
              icon: FaEdit,
              onClick: () => handleEditProduct(product._id),
            },
            {
              label:
                product.status === "active" ? "Ẩn sản phẩm" : "Hiện sản phẩm",
              icon: product.status === "active" ? FaEyeSlash : FaEye,
              variant: product.status === "active" ? "warning" : "success",
              onClick: () =>
                handleToggleStatus(product._id, product.status, product.name),
            },
            {
              label: "Xóa sản phẩm",
              icon: FaTrash,
              variant: "danger",
              onClick: () => handleDeleteProduct(product._id, product.name),
            },
          ]}
          onActionClick={(action) => action.onClick()}
        />
      ),
    },
  ];

  // Filter options
  const filterOptions = [
    {
      key: "price",
      label:
        priceFilter === "All"
          ? "Sắp xếp giá"
          : priceFilter === "LowToHigh"
          ? "Giá: Thấp → Cao"
          : "Giá: Cao → Thấp",
      value: priceFilter,
      options: [
        { value: "All", label: "Sắp xếp giá" },
        { value: "LowToHigh", label: "Giá: Thấp → Cao" },
        { value: "HighToLow", label: "Giá: Cao → Thấp" },
      ],
    },
    {
      
      key: "date",
      label: (() => {
        switch (dateFilter) {
          case "Newest":
            return "Mới nhất";
          case "Oldest":
            return "Cũ nhất";
          case "Today":
            return "Hôm nay";
          case "Last7Days":
            return "7 ngày qua";
          case "ThisMonth":
            return "Tháng này";
          default:
            return "Tất cả";
        }
      })(),
      value: dateFilter,
      options: [
        { value: "All", label: "Tất cả" },
        { value: "Today", label: "Hôm nay" },
        { value: "Last7Days", label: "7 ngày qua" },
        { value: "ThisMonth", label: "Tháng này" },
        { value: "Newest", label: "Mới nhất" },
        { value: "Oldest", label: "Cũ nhất" },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    // Toggle behavior: if clicking the same value, set to "All"
    let newValue = value;
    
    if (key === "status") {
      newValue = statusFilter === value ? "All" : value;
      setStatusFilter(newValue);
    } else if (key === "price") {
      newValue = priceFilter === value ? "All" : value;
      setPriceFilter(newValue);
    } else if (key === "date") {
      newValue = dateFilter === value ? "All" : value;
      setDateFilter(newValue);
    } else if (key === "stock") {
      newValue = stockFilter === value ? "All" : value;
      setStockFilter(newValue);
    }
    setCurrentPage(1);
  };
  // Calculate statistics
  const activeProducts = products.filter((p) => p.status === "active").length;
  const inactiveProducts = products.filter(
    (p) => p.status === "inactive"
  ).length;
  const lowStockProducts = products.filter(
    (p) => (p.in_stock || 0) <= 10 && (p.in_stock || 0) > 0
  ).length;
  const outOfStockProducts = products.filter(
    (p) => (p.in_stock || 0) === 0
  ).length;

  return (
    <AdminLayout>
      {message && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <span>{message}</span>
          <button className="ml-2 text-lg" onClick={() => setMessage('')}>×</button>
        </div>
      )}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Quản lý danh sách sản phẩm và thông tin chi tiết
            </p>
          </div>
          <NavLink
            to="/admin/addproduct"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="w-5 h-5" />
            Thêm sản phẩm
          </NavLink>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-transparent border border-blue-200 hover:border-blue-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <FaBox className="w-6 h-6 text-white" />
                </div>
                <svg className="w-8 h-8 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{totalProducts}</div>
              <div className="text-sm text-gray-600 font-medium">Tổng sản phẩm</div>
            </div>
          </AdminCard>

          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-transparent border border-green-200 hover:border-green-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-8 h-8 text-green-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{activeProducts}</div>
              <div className="text-sm text-gray-600 font-medium">Đang bán</div>
            </div>
          </AdminCard>

          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-transparent border border-red-200 hover:border-red-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-8 h-8 text-red-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">{inactiveProducts}</div>
              <div className="text-sm text-gray-600 font-medium">Ngừng bán</div>
            </div>
          </AdminCard>

          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-transparent border border-orange-200 hover:border-orange-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-8 h-8 text-orange-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">{lowStockProducts}</div>
              <div className="text-sm text-gray-600 font-medium">Sắp hết hàng</div>
            </div>
          </AdminCard>

          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <svg className="w-8 h-8 text-gray-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-1">{outOfStockProducts}</div>
              <div className="text-sm text-gray-600 font-medium">Hết hàng</div>
            </div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard className="bg-gradient-to-br from-white to-gray-50 border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên sản phẩm..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaFilter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={priceFilter}
                onChange={(e) => handleFilterChange("price", e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white appearance-none cursor-pointer"
              >
                <option value="All">Sắp xếp giá</option>
                <option value="LowToHigh">Giá: Thấp → Cao</option>
                <option value="HighToLow">Giá: Cao → Thấp</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaFilter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white appearance-none cursor-pointer"
              >
                <option value="All">Tất cả</option>
                <option value="Today">Hôm nay</option>
                <option value="Last7Days">7 ngày qua</option>
                <option value="ThisMonth">Tháng này</option>
                <option value="Newest">Mới nhất</option>
                <option value="Oldest">Cũ nhất</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage(1)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 font-medium"
            >
              <FaSearch className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </AdminCard>


        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleFilterChange("status", "All")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "All"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500/50 hover:text-blue-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Tất cả
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "All" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-blue-500/10"
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange("status", "active")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "active"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-500/50 hover:text-green-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đang bán
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "active" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-green-500/10"
            }`}>
              {activeProducts}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange("status", "inactive")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "inactive"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-red-500/50 hover:text-red-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ngừng bán
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "inactive" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-red-500/10"
            }`}>
              {inactiveProducts}
            </span>
          </button>

          <button
            onClick={() => {
              setStockFilter(prev => prev === "inStock" ? "All" : "inStock");
              setCurrentPage(1);
            }}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              stockFilter === "inStock"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-500/50 hover:text-green-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Còn hàng
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              stockFilter === "inStock" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-green-500/10"
            }`}>
              {products.filter(p => (p.in_stock || 0) > 0).length}
            </span>
          </button>

          <button
            onClick={() => {
              setStockFilter(prev => prev === "outOfStock" ? "All" : "outOfStock");
              setCurrentPage(1);
            }}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              stockFilter === "outOfStock"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-red-500/50 hover:text-red-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Hết hàng
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              stockFilter === "outOfStock" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-red-500/10"
            }`}>
              {outOfStockProducts}
            </span>
          </button>
        </div>

        {/* Products Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedProducts}
            loading={loading}
            error={error}
            emptyMessage="Không có sản phẩm nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(
                checked ? paginatedProducts.map((product) => product._id) : []
              );
            }}
            onSelectOne={(id, checked) => {
              setSelectedIds((prev) =>
                checked
                  ? [...prev, id]
                  : prev.filter((selectedId) => selectedId !== id)
              );
            }}
          />

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalProducts}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>
      </div>
    </AdminLayout>
  );
};

export default AdminProduct;
