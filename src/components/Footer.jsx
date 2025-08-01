import React from 'react'

const Footer = () => {
  return (
    <footer className='h-[300px] w-full border-t-1 border-[#9F9F9F]'>
      <div className='w-[1240px] h-full m-auto flex place-content-between place-items-center gap-20'>

        <div>
          <img className='w-[250px] h-[250px]' src="/images/logo_vuong.png" alt="Logo" />
        </div>

        <div className='h-[180px]'>
          <b className='text-[20px] font-bold text-gray-800'>Liên kết nhanh</b>

          <div className='mt-4 grid gap-2'>
            <p className='text-gray-600 font-medium hover:text-[#06AEF4] transition-colors cursor-pointer'>Sản phẩm</p>
            <p className='text-gray-600 font-medium hover:text-[#06AEF4] transition-colors cursor-pointer'>Liên hệ</p>
            <p className='text-gray-600 font-medium hover:text-[#06AEF4] transition-colors cursor-pointer'>Về chúng tôi</p>
          </div>
        </div>

        <div className='h-[180px]'>
          <b className='text-[20px] font-bold text-gray-800'>Thông tin liên hệ</b>

          <div className='my-4 grid gap-2'>
            <p className='flex place-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06AEF4" className="size-4">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              <span className='text-gray-600 font-medium'>123 Đường ABC, Quận XYZ TP. Hồ Chí Minh</span>
            </p>

            <p className='flex place-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06AEF4" className="size-4">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
              </svg>
              <span className='text-gray-600 font-medium'>0859499579</span>
            </p>

            <p className='flex place-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06AEF4" className="size-4">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              <span className='text-gray-600 font-medium'>taphoaso@gmail.com</span>
            </p>
          </div>

          <div className='flex gap-7'>
            <a href=""><img src="/images/image 20.png" alt="" /></a>
            <a href=""><img src="/images/image 17.png" alt="" /></a>
            <a href=""><img src="/images/image 18.png" alt="" /></a>
            <a href=""><img src="/images/image 19.png" alt="" /></a>
          </div>
        </div>

        <div className='h-[180px]'>
          <b className='text-[20px] font-bold text-gray-800'>Chính sách</b>

          <div className='my-4 grid gap-2'>
            <p className='flex place-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F6BA00" className="size-4">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
              <span className='text-gray-600 font-medium hover:text-[#06AEF4] transition-colors cursor-pointer'>Chính sách khách hàng</span>
            </p>

            <p className='flex place-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06AEF4" className="size-4">
                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
              </svg>
              <span className='text-gray-600 font-medium hover:text-[#06AEF4] transition-colors cursor-pointer'>Chính sách giao hàng</span>
            </p>
          </div>
          <div>
            <img className='w-[160px]' src="/images/image 16.png" alt="" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer