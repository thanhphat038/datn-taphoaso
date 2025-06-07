import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { dataProduct } from '../service/Product.service';

const Header = () => {

    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const item = await dataProduct();
            setProducts(item.data);
        };
        fetchProduct();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search/${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <header className='h-[80px] w-full border-b-1 border-[#9F9F9F]'>
            <div className='w-[1240px] h-full m-auto flex place-content-between place-items-center gap-20'>

                <Link to="/">
                    <img className='w-[185px] hover:opacity-90 transition-opacity' src="/images/logo_ngang.png" alt="Logo" />
                </Link>

                <Navbar />

                <div className='flex place-content-end place-items-center gap-10'>




                    <div className='z-100'>

                        <div className='bg-white border-1 border-[#9F9F9F] rounded-full w-[265px] h-[40px] flex overflow-hidden'>

                            <input className='w-full px-4 outline-0' placeholder='Tìm kiếm...' type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)} />

                            <button className='px-3 cursor-pointer hover:bg-gray-100' onClick={handleSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>

                        {query === "" || !isFocused ? null :
                            <div className='absolute bg-white border-1 border-[#9F9F9F] rounded-b-[20px] w-[265px] pb-2 pt-5 top-[40px] -z-10 overflow-hidden'>

                                <ul>
                                    {filteredProducts.length === 0 ? (
                                        <li className='w-full'>
                                            <span className='w-full px-2'>Không tìm thấy sản phẩm</span>
                                        </li>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <li className='w-full hover:bg-gray-100'>
                                                <Link className='w-full px-2' to={`/product/${product.id}`}>
                                                    <span>
                                                        {product.name.length > 30
                                                            ? product.name.slice(0, 30) + "..."
                                                            : product.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))
                                    )}
                                </ul>

                            </div>
                        }

                    </div>







                    <Link to="/cart" className="relative group">
                        <div className="flex place-content-end place-items-center cursor-pointer hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                2
                            </span>
                        </div>
                    </Link>
                    <div>
                        <Link to="/profile" className="relative group">
                            <div className='flex place-content-end place-items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;
