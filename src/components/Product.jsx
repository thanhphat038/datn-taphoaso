 import React from 'react';
import { Link } from 'react-router-dom';

export const formatCurrency = (value) => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const Product = ({ data: product }) => {

    return (
        <div className='drop-shadow-lg bg-white p-4 rounded-[15px] flex flex-col justify-between gap-5 items-center'>
            <div className='mt-2'>
                <img className='w-[155px] h-[155px] m-auto' src={product.images[0]} alt="" />
            </div>
            <div>
                <Link to={`/product/${product.id}`}><span className='text-[18px]'> {product.name} </span></Link>
                <p>
                    <span className='text-[18px] text-[#FF0000]'> {formatCurrency(product.price)} </span>
                    <del className='text-[14px] text-[#B2B2B2]'> {formatCurrency(product.price)} </del>
                </p>
                <p className='flex'>
                    {[...Array(Math.floor(product.rating.rate || 0))].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    {[...Array(5 - Math.floor(product.rating.rate || 0))].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className='text-[14px] ml-2'> {product.rating.rate}/5</span>
                </p>
                <p className='text-[14px]'> {product.rating.count} đánh giá</p>
            </div>
            <div className='flex gap-4 items-center justify-center'>
          
           <Link to={`/checkout`}><button className='h-[40px] text-[18px] border-2 border-[#06AEF4] rounded-[10px] p-1 hover:bg-[#06AEF4] hover:text-white cursor-pointer'>Mua ngay</button></Link>
                <button className='cursor-pointer text-[#06AEF4] hover:text-[#055a8c]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#06AEF4" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>
    </div>
  );
};

const StarIcon = ({ filled = false }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill='currentColor'
    viewBox='0 0 20 20'
  >
    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z' />
  </svg>
);
const HeartIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='w-6 h-6 text-gray-600 hover:text-red-500 transition-colors'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
    />
  </svg>
);

export default Product;