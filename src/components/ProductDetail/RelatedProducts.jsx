import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Product from '../Product';
import 'swiper/css';

const RelatedProducts = ({ 
    relatedProductsByCategory, 
    loadingRelatedProducts, 
    productData,
    relatedProducts 
}) => {
    return (
        <>
            {/* Related Products by Category */}
            {relatedProductsByCategory && relatedProductsByCategory.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Sản phẩm cùng danh mục</h2>
                        <Link
                            to={`/product?category=${productData.category_id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                        >
                            Xem tất cả
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loadingRelatedProducts ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                                    <div className="bg-gray-200 h-4 rounded mb-1"></div>
                                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                            }}
                            loop={relatedProductsByCategory.length > 5}
                            autoplay={{ delay: 2000, disableOnInteraction: false }}
                            modules={[Autoplay]}
                            className="w-full"
                        >
                            {relatedProductsByCategory.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <Product data={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            )}

            {/* Original Related Products (if any) */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={5}
                        loop={true}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="w-full"
                    >
                        {relatedProducts.map((item) => (
                            <SwiperSlide key={item._id}>
                                <Product data={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </>
    );
};

export default RelatedProducts;