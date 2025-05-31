import React from 'react'
import { Link } from 'react-router-dom';

const Product = (data) => {

    const product = data.data;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value).replace('₫', '₫');
    };

    return (
        <div className='drop-shadow-lg bg-white p-4 rounded-[15px] grid gap-5 place-content-between'>
            <div className='w-full mt-2'>
                <img className='w-[155px] h-[155px] m-auto' src={product.image} alt="" />
            </div>
            <div>
                <Link to={`/product/${product.id}`}><span className='text-[18px]'> {product.title} </span></Link>
                <p>
                    <span className='text-[18px] text-[#FF0000]'> {formatCurrency(product.price)} </span>
                    <del className='text-[14px] text-[#B2B2B2]'> {formatCurrency(product.price)} </del>
                </p>
                <p className='flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EAB308" className="size-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    <span className='text-[14px]'> {product.rating.count} </span>
                </p>
            </div>
            <div className='flex gap-4'>
                <button className='h-[40px] text-[18px] border-1 border-[#06AEF4] rounded-[10px] p-1 w-full hover:bg-[#06AEF4] hover:text-white cursor-pointer'>Mua ngay</button>
                <button className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Product