import React from 'react';

const ProductPackageSelector = ({ product, onPackageSelect, selectedPackage }) => {
  // Tạo các gói sản phẩm dựa trên loại sản phẩm
  const generatePackages = (product) => {
    const packages = [];
    
    // Gói đơn lẻ (mặc định) - cho tất cả sản phẩm
    packages.push({
      id: 'single',
      name: 'Đơn lẻ',
      quantity: 1,
      unit: getUnitByCategory(product.category?.name),
      price: product.price,
      unitPrice: product.price,
      image: product.images?.[0],
      isPopular: false,
      freeShipping: false
    });

    // Thêm gói cho Bia
    if (product.category?.name === 'Bia') {
      packages.push({
        id: 'pack',
        name: 'Lốc 6 Lon',
        quantity: 6,
        unit: 'Lon',
        price: Math.round(product.price * 6 * 0.95),
        unitPrice: Math.round(product.price * 0.95),
        image: product.images?.[0],
        isPopular: true,
        freeShipping: false,
        discount: 5
      });

      packages.push({
        id: 'carton',
        name: 'Thùng 20 Lon',
        quantity: 20,
        unit: 'Lon',
        price: Math.round(product.price * 20 * 0.85),
        unitPrice: Math.round(product.price * 0.85),
        image: product.images?.[0],
        isPopular: false,
        freeShipping: true,
        discount: 15
      });
    }

    // Thêm gói cho Nước uống
    else if (product.category?.name === 'Nước uống') {
      packages.push({
        id: 'pack',
        name: 'Lốc 6 Chai',
        quantity: 6,
        unit: 'Chai',
        price: Math.round(product.price * 6 * 0.92),
        unitPrice: Math.round(product.price * 0.92),
        image: product.images?.[0],
        isPopular: true,
        freeShipping: false,
        discount: 8
      });

      packages.push({
        id: 'carton',
        name: 'Thùng 24 Chai',
        quantity: 24,
        unit: 'Chai',
        price: Math.round(product.price * 24 * 0.83),
        unitPrice: Math.round(product.price * 0.83),
        image: product.images?.[0],
        isPopular: false,
        freeShipping: true,
        discount: 17
      });
    }

    // Thêm gói cho Mì
    else if (product.category?.name === 'Mì') {
      packages.push({
        id: 'pack',
        name: 'Gói 5 Gói',
        quantity: 5,
        unit: 'Gói',
        price: Math.round(product.price * 5 * 0.90),
        unitPrice: Math.round(product.price * 0.90),
        image: product.images?.[0],
        isPopular: true,
        freeShipping: false,
        discount: 10
      });

      packages.push({
        id: 'carton',
        name: 'Thùng 30 Gói',
        quantity: 30,
        unit: 'Gói',
        price: Math.round(product.price * 30 * 0.80),
        unitPrice: Math.round(product.price * 0.80),
        image: product.images?.[0],
        isPopular: false,
        freeShipping: true,
        discount: 20
      });
    }

    // Thêm gói cho Nước
    else if (product.category?.name === 'Nước') {
      packages.push({
        id: 'pack',
        name: 'Lốc 6 Chai',
        quantity: 6,
        unit: 'Chai',
        price: Math.round(product.price * 6 * 0.92),
        unitPrice: Math.round(product.price * 0.92),
        image: product.images?.[0],
        isPopular: true,
        freeShipping: false,
        discount: 8
      });

      packages.push({
        id: 'carton',
        name: 'Thùng 24 Chai',
        quantity: 24,
        unit: 'Chai',
        price: Math.round(product.price * 24 * 0.83),
        unitPrice: Math.round(product.price * 0.83),
        image: product.images?.[0],
        isPopular: false,
        freeShipping: true,
        discount: 17
      });
    }

    // Thêm gói cho các sản phẩm khác (mặc định)
    else {
      packages.push({
        id: 'pack',
        name: 'Gói 3 Sản phẩm',
        quantity: 3,
        unit: 'Sản phẩm',
        price: Math.round(product.price * 3 * 0.90),
        unitPrice: Math.round(product.price * 0.90),
        image: product.images?.[0],
        isPopular: true,
        freeShipping: false,
        discount: 10
      });

      packages.push({
        id: 'carton',
        name: 'Gói 10 Sản phẩm',
        quantity: 10,
        unit: 'Sản phẩm',
        price: Math.round(product.price * 10 * 0.80),
        unitPrice: Math.round(product.price * 0.80),
        image: product.images?.[0],
        isPopular: false,
        freeShipping: true,
        discount: 20
      });
    }

    return packages;
  };

  // Function để xác định đơn vị theo danh mục
  const getUnitByCategory = (categoryName) => {
    switch (categoryName) {
      case 'Bia':
        return 'Lon';
      case 'Mì':
        return 'Gói';
      case 'Nước uống':
      case 'Nước':
        return 'Chai';
      case 'Thực phẩm':
        return 'Gói';
      case 'Đồ gia dụng':
        return 'Cái';
      case 'Mỹ phẩm':
        return 'Chai';
      case 'Thời trang':
        return 'Cái';
      default:
        return 'Sản phẩm';
    }
  };

  const packages = generatePackages(product);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Chọn gói sản phẩm</h3>
      
      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedPackage?.id === pkg.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPackageSelect(pkg)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={pkg.image || '/placeholder-product.png'}
                    alt={pkg.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>

                {/* Package Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                    {pkg.isPopular && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Phổ biến
                      </span>
                    )}
                    {pkg.freeShipping && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Miễn phí giao hàng
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {pkg.quantity} {pkg.unit}
                    </span>
                    {pkg.discount && (
                      <span className="text-sm text-red-600 font-medium">
                        Giảm {pkg.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {pkg.price.toLocaleString()}₫
                </div>
                <div className="text-sm text-gray-500">
                  {pkg.unitPrice.toLocaleString()}₫/{pkg.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPackageSelector; 