import React, { useState } from 'react'
import { useProductData } from '../controller/Product.controller';

const ProductsPage = () => {
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const totalProducts = 100; // Giả sử có 100 sản phẩm
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Hàm xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Nếu tổng số trang <= 5, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Nếu tổng số trang > 5, hiển thị có logic
            if (currentPage <= 3) {
                // Nếu đang ở trang đầu
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                // Nếu đang ở trang cuối
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Nếu đang ở giữa
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }
        return pageNumbers;
    };

    return (
        <main className='w-full'>
            <div className='w-[1240px] m-auto py-10'>
                <div className='flex gap-5'>

                    <div className='w-[30%] flex flex-col gap-4 sticky top-4 h-fit'>
                        <div className='bg-white drop-shadow-lg p-4 rounded-[15px]'>
                            <h2 className='text-xl font-bold mb-4'>Danh mục</h2>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="ao" className='w-4 h-4' />
                                    <label htmlFor="ao">Áo</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="quan" className='w-4 h-4' />
                                    <label htmlFor="quan">Quần</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="vay" className='w-4 h-4' />
                                    <label htmlFor="vay">Váy</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="phukien" className='w-4 h-4' />
                                    <label htmlFor="phukien">Phụ kiện</label>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white drop-shadow-lg p-4 rounded-[15px]'>
                            <h2 className='text-xl font-bold mb-4'>Khoảng giá</h2>
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="price1" className='w-4 h-4' />
                                    <label htmlFor="price1">Dưới 200.000đ</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer py-2'>
                                    <input type="radio" id="price2" className='w-4 h-4' />
                                    <label htmlFor="price2">200.000đ - 500.000đ</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer  py-2'>
                                    <input type="radio" id="price3" className='w-4 h-4' />
                                    <label htmlFor="price3">500.000đ - 1.000.000đ</label>
                                </div>
                                <div className='flex items-center gap-2 cursor-pointer py-2'>
                                    <input type="radio" id="price4" className='w-4 h-4' />
                                    <label htmlFor="price4">Trên 1.000.000đ</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='w-[70%]'>
                        <div className='px-3 pb-5 rounded-[5px]'>
                            <div className='grid grid-cols-4 gap-3'>
                                {useProductData(productsPerPage)}
                            </div>
                            
                            {/* Phân trang */}
                            <div className='flex justify-center items-center gap-2 mt-8'>
                                {/* Nút Previous */}
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 
                                    ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Các số trang */}
                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border 
                                        ${currentPage === pageNum 
                                            ? 'bg-blue-500 text-white border-blue-500' 
                                            : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                {/* Nút Next */}
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 
                                    ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default ProductsPage;
