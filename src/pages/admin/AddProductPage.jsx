import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaTrash,
  FaImage,
  FaPlus,
  FaCubes,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminCard from "../../components/admin/AdminCard";
import AdminModal, { ModalButton } from "../../components/admin/AdminModal";
import {
  getAllCategories,
  createCategory,
  getAllBrands,
} from "../../service/Admin.Service.js";
import { getVariantsByProduct } from "../../service/Variant.service.js";
import Cookies from "js-cookie";

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

// Utility function to convert ISO or any date string to yyyy-MM-dd
const toDateInputValue = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const AddProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    discount_percent: "", // New discount percentage field
    stock: "0", // Default to '0' for in_stock field
    category_id: "",
    brand_id: "",
    status: "active",
    images: [],
    created_at: new Date().toISOString().split("T")[0], // Auto-fill today's date
  });

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Brands
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Variants
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  // Variant modal
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantForm, setVariantForm] = useState({
    name: "",
    description: "",
    unit: "chai",
    quantity_per_unit: "1",
    price: "",
    original_price: "",
    in_stock: "0",
    status: "active",
    is_default: false,
    images: [],
  });
  const [variantImageFiles, setVariantImageFiles] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Variant selection modal
  const [showVariantSelectionModal, setShowVariantSelectionModal] =
    useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

      // Fetch product data if editing
    useEffect(() => {
      if (id) {
        const fetchProduct = async () => {
          try {
            setLoading(true);
            
            const token = Cookies.get('auth_token');
            if (!token) {
              console.error('No authentication token found');
              navigate('/login');
              return;
            }

            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error("Failed to fetch product");
            }
            
            const result = await response.json();
            const product = result.data;
            
            setFormData({
              name: product.name || "",
              description: product.description || "",
              price: product.price ? product.price.toString() : "",
              original_price: product.original_price
                ? product.original_price.toString()
                : "",
              stock: product.in_stock ? product.in_stock.toString() : "0", // Map from in_stock
              category_id: product.category_id?._id || product.category_id || "",
              brand_id: product.brand_id?._id || product.brand_id || "",
              status: product.status || "active",
              images: product.images || [],
              created_at: toDateInputValue(
                product.created_at ||
                  product.create_at ||
                  product.createdAt ||
                  new Date()
              ),
            });

            if (product.images && product.images.length > 0) {
              setImagePreviews(product.images);
            }

            // Fetch variants for this product
            await fetchVariants(id);
          } catch (error) {
            setError("Không thể tải thông tin sản phẩm: " + error.message);
          } finally {
            setLoading(false);
          }
        };
        fetchProduct();
      }
    }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getAllCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        setError(
          "Không thể tải danh mục: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await getAllBrands();
        setBrands(response.data.data || []);
      } catch (error) {
        // Không cần setError ở đây, chỉ cần để brands là [] nếu lỗi
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch variants for a product
  const fetchVariants = async (productId) => {
    try {
      if (!productId) {
        setVariants([]);
        return;
      }
      
      setVariantsLoading(true);
      
      const response = await getVariantsByProduct(productId);
      
      if (response && response.data) {
        setVariants(response.data);
      } else {
        setVariants([]);
      }
    } catch (error) {
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload with compression
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file sizes (max 2MB each to prevent server errors)
    const maxSize = 2 * 1024 * 1024; // Reduced to 2MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError("Kích thước file không được vượt quá 2MB");
      return;
    }

    // Limit to 3 images total to reduce payload size
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 5) {
      setError("Tối đa 5 hình ảnh cho mỗi sản phẩm");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    // Create compressed previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Compress image by resizing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

          setImagePreviews((prev) => [...prev, compressedDataUrl]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      setLoading(true);
      const response = await createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        status: "active",
      });
      const created = response.data.data;
      setCategories((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, category_id: created._id }));
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);
      setError(null);
    } catch (error) {
      setError(
        "Lỗi khi tạo danh mục: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Open variant creation modal
  const handleCreateVariant = () => {
    setVariantForm({
      name: "",
      description: "",
      unit: "chai",
      quantity_per_unit: "1",
      price: "",
      original_price: "",
      in_stock: "0",
      status: "active",
      is_default: false,
      images: [],
    });
    setVariantImagePreviews([]);
    setVariantImageFiles([]);
    setShowVariantModal(true);
  };

  // Navigate to variant edit page
  const handleEditVariant = (variantId) => {
    navigate(`/admin/addvariant/${variantId}`);
  };

  // Open variant selection modal
  const handleOpenVariantSelection = async () => {
    if (id) {
      // Fetch latest variants when opening the modal
      await fetchVariants(id);
    }
    
    setShowVariantSelectionModal(true);
  };

  // Handle variant selection
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    setShowVariantSelectionModal(false);
  };

  // Clear selected variant
  const handleClearSelectedVariant = () => {
    setSelectedVariant(null);
  };

  // Set variant as default
  const handleSetDefaultVariant = async (variantId) => {
    try {
      setLoading(true);
      const token = Cookies.get("auth_token");
      const response = await fetch(
        `${API_BASE_URL}/variants/${variantId}/set-default`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default variant");
      }

      // Update local state
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          is_default: v._id === variantId,
        }))
      );

      setError(null);
    } catch (error) {
      setError("Lỗi khi đặt biến thể mặc định: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle show all variants

  // Handle variant form changes
  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle variant image change
  const handleVariantImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        setError("Chỉ chấp nhận file JPG, PNG hoặc WebP");
        return false;
      }

      if (!isValidSize) {
        setError("Kích thước file không được vượt quá 5MB");
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Convert to base64
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setVariantImagePreviews((prev) => [...prev, base64]);
        setVariantForm((prev) => ({
          ...prev,
          images: [...prev.images, base64],
        }));
      };
      reader.readAsDataURL(file);
    });

    setVariantImageFiles((prev) => [...prev, ...validFiles]);
    setError(null);
  };

  // Remove variant image
  const removeVariantImage = (index) => {
    setVariantImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setVariantForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setVariantImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove temporary variant
  const removeTempVariant = (variantId) => {
    setVariants((prev) => prev.filter((v) => v._id !== variantId));
  };

  // Validate variant form
  const validateVariantForm = () => {
    if (!variantForm.name.trim()) {
      setError("Tên biến thể là bắt buộc");
      return false;
    }

    if (!variantForm.price || parseFloat(variantForm.price) <= 0) {
      setError("Giá phải lớn hơn 0");
      return false;
    }

    if (
      variantForm.original_price &&
      parseFloat(variantForm.original_price) <= 0
    ) {
      setError("Giá gốc phải lớn hơn 0");
      return false;
    }

    if (
      variantForm.original_price &&
      parseFloat(variantForm.original_price) <= parseFloat(variantForm.price)
    ) {
      setError("Giá gốc phải lớn hơn giá hiện tại");
      return false;
    }

    if (parseInt(variantForm.in_stock) < 0) {
      setError("Số lượng tồn kho không được âm");
      return false;
    }

    if (!variantForm.unit) {
      setError("Vui lòng chọn đơn vị");
      return false;
    }

    if (parseInt(variantForm.quantity_per_unit) < 1) {
      setError("Số lượng mỗi đơn vị phải lớn hơn 0");
      return false;
    }

    return true;
  };

  // Handle variant form submission
  const handleVariantSubmit = async () => {
    if (!validateVariantForm()) {
      return;
    }

    // If product is not saved yet, just add variant to temporary list
    if (!id) {
      const tempVariant = {
        ...variantForm,
        _id: `temp_${Date.now()}`, // Temporary ID
        price: parseFloat(variantForm.price),
        original_price: parseFloat(variantForm.original_price),
        in_stock: parseInt(variantForm.in_stock),
        quantity_per_unit: parseInt(variantForm.quantity_per_unit),
        is_temp: true, // Mark as temporary
      };

      setVariants((prev) => [...prev, tempVariant]);
      setShowVariantModal(false);
      setVariantForm({
        name: "",
        description: "",
        unit: "chai",
        quantity_per_unit: "1",
        price: "",
        original_price: "",
        in_stock: "0",
        status: "active",
        is_default: false,
        images: [],
      });
      setVariantImagePreviews([]);
      setVariantImageFiles([]);
      setError(null);
      return;
    }

    // If product is already saved, create variant via API
    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...variantForm,
        product_id: id,
        price: parseFloat(variantForm.price),
        original_price: parseFloat(variantForm.original_price),
        in_stock: parseInt(variantForm.in_stock),
        quantity_per_unit: parseInt(variantForm.quantity_per_unit),
      };

      const token = Cookies.get("auth_token");
      const response = await fetch(`${API_BASE_URL}/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create variant");
      }

      const result = await response.json();
      setVariants((prev) => [...prev, result.data]);
      setShowVariantModal(false);
      setVariantForm({
        name: "",
        description: "",
        unit: "chai",
        quantity_per_unit: "1",
        price: "",
        original_price: "",
        in_stock: "0",
        status: "active",
        is_default: false,
        images: [],
      });
      setVariantImagePreviews([]);
      setVariantImageFiles([]);
      setError(null);
    } catch (error) {
      setError(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Tên sản phẩm không được để trống");
      return false;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Giá bán phải lớn hơn 0");
      return false;
    }

    if (!formData.original_price || Number(formData.original_price) <= 0) {
      setError("Giá gốc phải lớn hơn 0");
      return false;
    }

    if (Number(formData.price) > Number(formData.original_price)) {
      setError("Giá bán không được lớn hơn giá gốc");
      return false;
    }

    if (
      formData.discount_percent !== "" &&
      (Number(formData.discount_percent) < 0 ||
        Number(formData.discount_percent) > 100)
    ) {
      setError("Phần trăm giảm giá phải từ 0 đến 100");
      return false;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      setError("Số lượng tồn kho không được âm");
      return false;
    }

    if (!formData.category_id) {
      setError("Vui lòng chọn danh mục");
      return false;
    }

    if (!formData.brand_id) {
      setError("Vui lòng chọn thương hiệu");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare product data with base64 images (fallback approach)
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        discount_percent:
          formData.discount_percent === ""
            ? 0
            : Number(formData.discount_percent),
        in_stock: Number(formData.stock),
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        status: formData.status,
        images: imagePreviews, // Use compressed base64 images directly
      };

      // Only include create_at for new products, not for updates
      if (!id) {
        productData.create_at = formData.created_at;
      }

      const url = id
        ? `${API_BASE_URL}/products/${id}`
        : `${API_BASE_URL}/products`;
      const method = id ? "PUT" : "POST";

      const token = Cookies.get("auth_token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      const result = await response.json();
      const savedProductId = result.data._id || id;

      // If this was a new product and has temporary variants, create them
      if (!id && variants.length > 0) {
        const tempVariants = variants.filter((v) => v.is_temp);
        if (tempVariants.length > 0) {
          try {
            for (const variant of tempVariants) {
              const variantData = {
                ...variant,
                product_id: savedProductId,
                // Remove temporary fields
                _id: undefined,
                is_temp: undefined,
              };

              const variantResponse = await fetch(`${API_BASE_URL}/variants`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(variantData),
              });

              if (!variantResponse.ok) {
                console.error("Failed to create variant:", variant.name);
              }
            }
          } catch (variantError) {
            console.error("Error creating variants:", variantError);
          }
        }
      }

      navigate("/admin/product");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const hasChanges =
      formData.name ||
      formData.description ||
      formData.price ||
      imagePreviews.length > 0;

    if (hasChanges) {
      const confirmMessage =
        "Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.";
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    navigate("/admin/product");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id
              ? "Cập nhật thông tin sản phẩm"
              : "Tạo sản phẩm mới cho cửa hàng"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <AdminCard title="Thông tin cơ bản">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập tên sản phẩm"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Nhập mô tả chi tiết về sản phẩm"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo
                    </label>
                    <input
                      type="date"
                      name="created_at"
                      value={toDateInputValue(formData.created_at)}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      readOnly={!!id}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ngày tạo sản phẩm (tự động điền ngày hôm nay)
                    </p>
                  </div>
                </div>
              </AdminCard>

              {/* Variants Section - Always show */}
              <AdminCard title="Biến thể sản phẩm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCubes className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Biến thể của sản phẩm ({variants.length})
                      </span>
                      {selectedVariant && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Đã chọn: {selectedVariant.name}
                          </span>
                          <button
                            type="button"
                            onClick={handleClearSelectedVariant}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Xóa biến thể đã chọn"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* <button
                          type="button"
                          onClick={handleOpenVariantSelection}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaCubes className="w-4 h-4" />
                          Chọn biến thể
                        </button> */}
                      <button
                        type="button"
                        onClick={handleCreateVariant}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPlus className="w-4 h-4" />
                        Thêm biến thể
                      </button>
                    </div>
                  </div>

                  {variantsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">Đang tải biến thể...</div>
                    </div>
                  ) : variants.length > 0 ? (
                    <div className="space-y-3">
                      {/* Variants Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên biến thể
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đơn vị
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tồn kho
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {variants.map((variant) => (
                              <tr
                                key={variant._id}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      {variant.name}
                                    </span>
                                    {variant.is_default && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Mặc định
                                      </span>
                                    )}
                                    {variant.is_temp && (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                        Tạm thời
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {variant.unit} • {variant.quantity_per_unit}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {variant.price.toLocaleString("vi-VN")}đ
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {variant.in_stock || 0}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      variant.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {variant.status === "active"
                                      ? "Hoạt động"
                                      : "Vô hiệu"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {variant.is_temp ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeTempVariant(variant._id)
                                        }
                                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                        title="Xóa biến thể tạm thời"
                                      >
                                        <FaTrash className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleEditVariant(variant._id)
                                          }
                                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                          title="Chỉnh sửa biến thể"
                                        >
                                          <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSelectVariant(variant)
                                          }
                                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                                          title="Chọn biến thể này"
                                        >
                                          <FaCheck className="w-4 h-4" />
                                        </button>
                                        {!variant.is_default && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleSetDefaultVariant(
                                                variant._id
                                              )
                                            }
                                            className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                            title="Đặt làm biến thể mặc định"
                                          >
                                            <FaCubes className="w-4 h-4" />
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaCubes className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-3">Chưa có biến thể nào</p>
                      <button
                        type="button"
                        onClick={handleCreateVariant}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPlus className="w-4 h-4" />
                        Tạo biến thể đầu tiên
                      </button>
                    </div>
                  )}
                </div>
              </AdminCard>

              {/* Images */}
              <AdminCard title="Hình ảnh sản phẩm">
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FaUpload className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        Kéo thả hoặc click để tải lên hình ảnh
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP (tối đa 5MB mỗi file, tối đa 5 ảnh)
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaImage className="w-4 h-4" />
                        Chọn file
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AdminCard>

              {/* Pricing */}
              <AdminCard title="Giá cả và kho hàng">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá gốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Giá gốc của sản phẩm (VND, cho phép số lẻ)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá bán <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Giá bán cho khách hàng (VND, cho phép số lẻ)
                    </p>
                  </div>
                  {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm giá (%) 
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Phần trăm giảm giá (0-100%)</p>
              </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Số lượng sản phẩm có sẵn
                    </p>
                  </div>
                </div>
              </AdminCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <AdminCard title="Trạng thái">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                >
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.status === "active"
                    ? "Sản phẩm sẽ hiển thị trên cửa hàng"
                    : "Sản phẩm sẽ bị ẩn khỏi cửa hàng"}
                </p>
              </AdminCard>

              {/* Category */}
              <AdminCard title="Danh mục">
                <div className="space-y-3">
                  {categoriesLoading ? (
                    <div className="text-gray-500">Đang tải danh mục...</div>
                  ) : (
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    Tạo danh mục mới
                  </button>
                </div>
              </AdminCard>

              {/* Brand */}
              <AdminCard title="Thương hiệu">
                <div className="space-y-3">
                  {brandsLoading ? (
                    <div className="text-gray-500">Đang tải thương hiệu...</div>
                  ) : (
                    <select
                      name="brand_id"
                      value={formData.brand_id || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </AdminCard>

              {/* Actions */}
              <AdminCard>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <ModalButton
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading
                      ? "Đang lưu..."
                      : id
                      ? "Cập nhật sản phẩm"
                      : "Tạo sản phẩm"}
                  </ModalButton>
                  <ModalButton
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    Hủy bỏ
                  </ModalButton>
                </div>
              </AdminCard>
            </div>
          </div>
        </form>

        {/* Add Category Modal */}
        <AdminModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setNewCategory({ name: "", description: "" });
            setError(null);
          }}
          title="Thêm danh mục mới"
          footer={
            <>
              <ModalButton
                variant="secondary"
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategory({ name: "", description: "" });
                  setError(null);
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton onClick={handleAddCategory} disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo danh mục"}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả danh mục
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả danh mục (tùy chọn)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>

        {/* Add Variant Modal */}
        <AdminModal
          isOpen={showVariantModal}
          onClose={() => {
            setShowVariantModal(false);
            setVariantForm({
              name: "",
              description: "",
              unit: "chai",
              quantity_per_unit: "1",
              price: "",
              original_price: "",
              in_stock: "0",
              status: "active",
              is_default: false,
              images: [],
            });
            setVariantImagePreviews([]);
            setVariantImageFiles([]);
            setError(null);
          }}
          title="Thêm biến thể mới"
          footer={
            <>
              <ModalButton
                variant="secondary"
                onClick={() => {
                  setShowVariantModal(false);
                  setVariantForm({
                    name: "",
                    description: "",
                    unit: "chai",
                    quantity_per_unit: "1",
                    price: "",
                    original_price: "",
                    in_stock: "0",
                    status: "active",
                    is_default: false,
                    images: [],
                  });
                  setVariantImagePreviews([]);
                  setVariantImageFiles([]);
                  setError(null);
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton onClick={handleVariantSubmit} disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo biến thể"}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên biến thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={variantForm.name}
                    onChange={handleVariantChange}
                    placeholder="Nhập tên biến thể"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={variantForm.unit}
                    onChange={handleVariantChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    required
                  >
                    <option value="thùng">Thùng</option>
                    <option value="lốc">Lốc</option>
                    <option value="gói">Gói</option>
                    <option value="chai">Chai</option>
                    <option value="lon">Lon</option>
                    <option value="túi">Túi</option>
                    <option value="hộp">Hộp</option>
                    <option value="kg">Kg</option>
                    <option value="gram">Gram</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={variantForm.description}
                    onChange={handleVariantChange}
                    placeholder="Nhập mô tả biến thể"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Stock */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Giá và Tồn kho
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá hiện tại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={variantForm.price}
                    onChange={handleVariantChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    value={variantForm.original_price}
                    onChange={handleVariantChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    name="in_stock"
                    value={variantForm.in_stock}
                    onChange={handleVariantChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng mỗi đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity_per_unit"
                    value={variantForm.quantity_per_unit}
                    onChange={handleVariantChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={variantForm.status}
                    onChange={handleVariantChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Vô hiệu hóa</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={variantForm.is_default}
                    onChange={handleVariantChange}
                    className="rounded border-gray-300 text-[#06AEF4] focus:ring-[#06AEF4]"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Đặt làm biến thể mặc định
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hình ảnh
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleVariantImageChange}
                    className="hidden"
                    id="variant-image-upload"
                  />
                  <label
                    htmlFor="variant-image-upload"
                    className="cursor-pointer"
                  >
                    <FaUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      Click để tải hình ảnh hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WebP (tối đa 5MB)
                    </p>
                  </label>
                </div>

                {variantImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {variantImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AdminModal>

        {/* Variant Selection Modal */}
        <AdminModal
          isOpen={showVariantSelectionModal}
          onClose={() => {
            setShowVariantSelectionModal(false);
            setSelectedVariant(null);
          }}
          title="Chọn biến thể cho sản phẩm"
          footer={
            <>
              <ModalButton
                variant="secondary"
                onClick={() => {
                  setShowVariantSelectionModal(false);
                  setSelectedVariant(null);
                }}
              >
                Đóng
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            {variants.length === 0 ? (
              <div className="text-center py-8">
                <FaCubes className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">Chưa có biến thể nào</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowVariantSelectionModal(false);
                    handleCreateVariant();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Tạo biến thể đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Chọn biến thể để xem chi tiết hoặc đặt làm biến thể mặc định
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên biến thể
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đơn vị
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tồn kho
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {variants.map((variant) => (
                        <tr key={variant._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {variant.name}
                              </span>
                              {variant.is_default && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Mặc định
                                </span>
                              )}
                              {variant.is_temp && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Tạm thời
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {variant.unit} • {variant.quantity_per_unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {variant.price.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {variant.in_stock || 0}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                variant.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {variant.status === "active"
                                ? "Hoạt động"
                                : "Vô hiệu"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {!variant.is_temp && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditVariant(variant._id)
                                    }
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    title="Chỉnh sửa biến thể"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                  {!variant.is_default && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetDefaultVariant(variant._id)
                                      }
                                      className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                      title="Đặt làm biến thể mặc định"
                                    >
                                      <FaCubes className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;
