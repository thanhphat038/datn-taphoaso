import React, { useState, useEffect } from 'react';
import { useProductData } from '../controller/Product.controller';
import { useParams } from 'react-router-dom';
import { dataProduct } from '../service/Product.service';
import Product from '../components/Product';

const ProductsSearch = () => {

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const productsPerPage = 16;

    const { value } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            const item = await dataProduct();
            setProducts(item.data.products || []);
        };
        fetchProduct();
    }, []);

    const filteredProductsSearch = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
    );

    const getCategoryCount = (categoryId) => {
        return filteredProductsSearch.filter(product => product.category_id === categoryId).length;
    };


    const getPriceRangeCount = (range) => {
        return filteredProductsSearch.filter(product => {
            const price = product.price;
            switch (range) {
                case 'under-200': return price < 200000;
                case '200-500': return price >= 200000 && price <= 500000;
                case '500-1000': return price > 500000 && price <= 1000000;
                case 'over-1000': return price > 1000000;
                default: return true;
            }
        }).length;
    };

    const filterProducts = (products) => {
        let result = products;

        if (selectedCategoryId !== null) {
            result = result.filter(product => product.category_id === selectedCategoryId);
        }

        if (selectedPriceRange) {
            result = result.filter(product => {
                const price = product.price;
                switch (selectedPriceRange) {
                    case 'under-200': return price < 200000;
                    case '200-500': return price >= 200000 && price <= 500000;
                    case '500-1000': return price > 500000 && price <= 1000000;
                    case 'over-1000': return price > 1000000;
                    default: return true;
                }
            });
        }

        return result;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPriceRange, selectedCategoryId]);

    const filteredProducts = filterProducts(filteredProductsSearch);

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex).map((element, index) => (
        <Product key={index} data={element} />
    ));


    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages)
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        else {
            if (currentPage <= 3)
                for (let i = 1; i <= 5; i++) pageNumbers.push(i);
            else if (currentPage >= totalPages - 2)
                for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
            else
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
        }

        return pageNumbers;
    };






    return (
        <main className='w-full'>
            <div className='w-[1240px] m-auto py-10'>
                <div className='flex gap-5'>

                    <div className='w-[350px] flex flex-col gap-4 sticky top-4 h-fit'>
                        <div className='bg-white drop-shadow-lg p-4 rounded-[15px]'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold'>Danh mục</h2>
                                {selectedCategoryId && (
                                    <button
                                        onClick={() => setSelectedCategoryId(null)}
                                        className='text-sm text-blue-500 hover:text-blue-700'
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedCategoryId === 1 ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId(1)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="1"
                                            className='w-4 h-4'
                                            name="category"
                                            checked={selectedCategoryId === 1}
                                            onChange={() => setSelectedCategoryId(1)}
                                        />
                                        <label htmlFor="1">Mì ăn liền</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getCategoryCount(1)})</span>
                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedCategoryId === 2 ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId(2)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="2"
                                            className='w-4 h-4'
                                            name="category"
                                            checked={selectedCategoryId === 2}
                                            onChange={() => setSelectedCategoryId(2)}
                                        />
                                        <label htmlFor="2">Nước uống</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getCategoryCount(2)})</span>
                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedCategoryId === null ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId(null)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="categoryAll"
                                            className='w-4 h-4'
                                            name="category"
                                            checked={selectedCategoryId === null}
                                            onChange={() => setSelectedCategoryId(null)}
                                        />
                                        <label htmlFor="categoryAll">Tất cả</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({filteredProducts.length})</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white drop-shadow-lg p-4 rounded-[15px]'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold'>Khoảng giá</h2>
                                {selectedPriceRange && (
                                    <button
                                        onClick={() => setSelectedPriceRange(null)}
                                        className='text-sm text-blue-500 hover:text-blue-700'
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedPriceRange === 'under-200' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('under-200')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="price1"
                                            className='w-4 h-4'
                                            name="price"
                                            checked={selectedPriceRange === 'under-200'}
                                            onChange={() => setSelectedPriceRange('under-200')}
                                        />
                                        <label htmlFor="price1">Dưới 200.000đ</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getPriceRangeCount('under-200')})</span>
                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedPriceRange === '200-500' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('200-500')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="price2"
                                            className='w-4 h-4'
                                            name="price"
                                            checked={selectedPriceRange === '200-500'}
                                            onChange={() => setSelectedPriceRange('200-500')}
                                        />
                                        <label htmlFor="price2">200.000đ - 500.000đ</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getPriceRangeCount('200-500')})</span>
                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedPriceRange === '500-1000' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('500-1000')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="price3"
                                            className='w-4 h-4'
                                            name="price"
                                            checked={selectedPriceRange === '500-1000'}
                                            onChange={() => setSelectedPriceRange('500-1000')}
                                        />
                                        <label htmlFor="price3">500.000đ - 1.000.000đ</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getPriceRangeCount('500-1000')})</span>
                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-2 px-2 rounded-lg transition-colors
                                    ${selectedPriceRange === 'over-1000' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('over-1000')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="radio"
                                            id="price4"
                                            className='w-4 h-4'
                                            name="price"
                                            checked={selectedPriceRange === 'over-1000'}
                                            onChange={() => setSelectedPriceRange('over-1000')}
                                        />
                                        <label htmlFor="price4">Trên 1.000.000đ</label>
                                    </div>
                                    <span className='text-sm text-gray-500'>({getPriceRangeCount('over-1000')})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full'>
                        <div className='px-3 pb-5 rounded-[5px]'>
                            {
                                currentProducts.length === 0 ?
                                    <p className='text-xl text-center'>Không tìm thấy sản phẩm!</p>
                                    :
                                    <div className='grid grid-cols-4 gap-3'>{currentProducts}</div>
                            }

                            <div className='flex justify-center items-center gap-2 mt-8'>
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

export default ProductsSearch;
