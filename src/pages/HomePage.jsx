import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import Product from '../components/Product';

const API_BASE_URL = 'http://localhost:3000/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products từ API trực tiếp
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

  // Hàm lọc sản phẩm theo danh mục và giới hạn số lượng
  const getProductsByCategory = (categoryName, limit = 5) => {
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
    
    const filteredProducts = products.filter(product => {
      // Lọc theo tên danh mục (có thể là "mì ăn liền" hoặc "nước uống")
      const categoryNameLower = categoryName.toLowerCase();
      const productCategoryName = product.category_id?.name?.toLowerCase() || '';
      
      return productCategoryName.includes(categoryNameLower);
    });

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

<div className=' px-3 pb-5 rounded-[5px] shadow bg-cyan-100'>
          <div className='bg-stone-100 rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center capitalize'>mì ăn liền</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {getProductsByCategory("mì ăn liền", 5)}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

        <div className='bg-[#06adf492] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center capitalize'>nước uống</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {getProductsByCategory("nước uống", 5)}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
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
            {getProductsByCategory("mì ăn liền", 5)}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-5'>

          <img className='rounded-[5px] w-[400px] h-[500px] object-cover' src="./images/banner_nuocngot.png" alt="" />

          <div className='bg-[#f2f2f29e] px-3 pb-5 rounded-[5px] col-span-2'>
            <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
              <p className='text-[20px] w-full text-center capitalize'>nước uống</p>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              {getProductsByCategory("nước uống", 3)}
            </div>

            <div className='mt-5 flex place-content-center'>
              <a href="" className='text-[18px]'>Xem thêm</a>
            </div>
          </div>
        </div>

      </div>
    </main >
  );
};

export default HomePage;
