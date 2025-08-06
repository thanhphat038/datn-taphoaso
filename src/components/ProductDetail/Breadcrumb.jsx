import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ productData }) => {
    return (
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/" className="text-gray-700 hover:text-blue-600">
                        Trang chủ
                    </Link>
                </li>
                <li>
                    <div className="flex items-center">
                        <svg key="breadcrumb-chevron-1" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <Link to="/product" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                            Sản phẩm
                        </Link>
                    </div>
                </li>
                <li aria-current="page">
                    <div className="flex items-center">
                        <svg key="breadcrumb-chevron-2" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 text-gray-500 md:ml-2">{productData.name}</span>
                    </div>
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumb;