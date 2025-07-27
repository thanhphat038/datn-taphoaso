import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Product from '../components/Product';
import 'swiper/css';

const API_BASE_URL = 'http://localhost:3000/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách sản phẩm: ' + error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm lấy danh sách các category_id đang có trong dữ liệu sản phẩm
  const getAllCategoryIds = () => {
    // Lấy ra mảng các id danh mục duy nhất từ products
    return Array.from(new Set(products.map(p => p.category_id)));
  };

  // Hàm lọc sản phẩm theo id danh mục
  const getProductsByCategory = (categoryId, limit = 5) => {
    if (loading) {
      // Hiển thị skeleton loading
      return Array.from({ length: limit }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
          <div className="bg-gray-200 h-4 rounded mb-1"></div>
          <div className="bg-gray-200 h-4 rounded w-2/3"></div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-600">Không thể tải sản phẩm</p>
        </div>
      );
    }

    // Lọc sản phẩm theo id danh mục (so sánh chuỗi)
    const filteredProducts = products.filter(product => product.category_id === categoryId);
    // Log ra để kiểm tra
    // console.log('categoryId:', categoryId);
    // console.log('filteredProducts:', filteredProducts);

    if (filteredProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Không có sản phẩm nào trong danh mục này</p>
        </div>
      );
    }

    return filteredProducts.slice(0, limit).map((product, index) => (
      <Product key={product._id || index} data={product} />
    ));
  };

  // Log ra các category_id đang có để dev dễ lấy đúng id
  useEffect(() => {
    if (products.length > 0) {
      const ids = getAllCategoryIds();
      console.log('Các category_id đang có:', ids);
    }
  }, [products]);

  return (
    <main className='w-full'>
      <div className='w-[1240px] m-auto py-10 grid gap-15'>

        <div className='flex gap-5 mb-5'>
          <div className='grow-2'>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              className='rounded-[30px] w-full max-w-[800px] mx-auto'
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
            >
              <SwiperSlide>
                <img className='rounded-[30px] w-full h-[560px] object-cover' src="./images/banner_taphoaso.png" alt="Banner 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-[30px] w-full h-[560px] object-cover' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="Banner 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-[30px] w-full h-[560px] object-cover' src="https://amis.misa.vn/wp-content/uploads/2022/07/tim-hieu-tong-quan-chien-luoc-marketing-cua-chocopie.jpg" alt="Banner 3" />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className='grow-1 grid gap-5'>
            <img className='rounded-[30px]' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="" />
            <img className='rounded-[30px]' src="./images/banner_3.png" alt="" />
          </div>
        </div>

        <div className="relative w-full flex justify-center">
          {/* Tam giác kẹp giấy (phía sau nội dung) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-0 flex items-center">
            {/* Tam giác trái */}
            <div className="w-0 h-0 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-r-[19px] border-r-green-500"></div>

            {/* Tam giác phải */}
            <div className="w-0 h-0 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-l-[19px] border-l-green-500"></div>
          </div>

          {/* Nút chính (nổi trên cùng) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-[999]">
            <div className="relative bg-green-100 text-green-700 text-[20px] font-semibold px-8 py-3.5 rounded-b-md border border-green-500 border-t-0 min-w-[211px] text-center shadow">
              THỊT, CÁ, TRỨNG, HẢI SẢN
            </div>
          </div>

          {/* Box nội dung */}
          <div className="w-full px-3 pb-5 rounded-[5px] shadow bg-cyan-100 pt-12 z-10 relative">
            <div className='grid grid-cols-5 gap-3'>
              {getProductsByCategory("684697023d545550b38460cd", 5)}
            </div>

            <div className='mt-5 flex place-content-center'>
              <Link to="/product?category=684697023d545550b38460cd" className='text-[18px]'>Xem thêm</Link>
            </div>
          </div>
        </div>

        <div className='bg-[#06adf492] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center capitalize'>nước uống</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {getProductsByCategory("68693d5117edd67c23b67bc1", 5)}
          </div>

          <div className='mt-5 flex place-content-center'>
            <Link to="/product?category=68693d5117edd67c23b67bc1" className='text-[18px]'>Xem thêm</Link>
          </div>
        </div>

        <div className='mb-5'>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            className='rounded-[30px] w-full max-w-[1250px] mx-auto'
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
          >
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="./images/banner_4.png" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="https://blog.strawberrycstore.com/wp-content/uploads/2019/06/Cocacola1.jpg" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-thiết-kế-bộ-nhận-diện-mới-logo-Pepsi-22.jpg" alt="Banner 4" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className='bg-[#f2f2f29e] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center capitalize'>mì ăn liền</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {getProductsByCategory("684697023d545550b38460cd", 5)}
          </div>

          <div className='mt-5 flex place-content-center'>
            <Link to="/product?category=684697023d545550b38460cd" className='text-[18px]'>Xem thêm</Link>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-5'>

          <img className='rounded-[5px] w-[400px] h-[500px] object-cover' src="./images/banner_nuocngot.png" alt="" />

          <div className='bg-[#f2f2f29e] px-3 pb-5 rounded-[5px] col-span-2'>
            <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
              <p className='text-[20px] w-full text-center capitalize'>nước uống</p>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              {getProductsByCategory("68693d5117edd67c23b67bc1", 3)}
            </div>

            <div className='mt-5 flex place-content-center'>
              <Link to="/product?category=68693d5117edd67c23b67bc1" className='text-[18px]'>Xem thêm</Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default HomePage;

