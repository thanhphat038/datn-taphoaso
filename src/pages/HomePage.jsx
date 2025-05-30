import React from 'react';
import Product from '../components/Product';

const HomePage = () => {

  const items = [];

  for (let i = 0; i < 5; i++) {
    items.push(<Product></Product>);
  }

  return (
    <main className='w-full'>
      <div className='w-[1240px] m-auto py-10 grid gap-15'>

        <div className='bg-[#ffe283a1] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center'>Sản phẩm</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {items}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

        <div className='bg-[#05ac5ba5] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center'>Sản phẩm</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {items}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

        <div className='bg-[#f2f2f29e] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center'>Sản phẩm</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {items}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

        <div className='bg-[#f2f2f29e] px-3 pb-5 rounded-[5px]'>
          <div className='bg-[#D9D9D9] rounded-full w-[400px] h-[60px] -translate-y-[30px] m-auto flex place-items-center'>
            <p className='text-[20px] w-full text-center'>Sản phẩm</p>
          </div>

          <div className='grid grid-cols-5 gap-3'>
            {items}
          </div>

          <div className='mt-5 flex place-content-center'>
            <a href="" className='text-[18px]'>Xem thêm</a>
          </div>
        </div>

      </div>
    </main>
  );
};

export default HomePage;
