import React from 'react';
import Navbar from './Navbar';

const Header = () => {
    return (
        <>
            <header className='bg-[#ea9e9e] h-[100px] w-[1240px] m-auto flex place-content-between place-items-center'>
                <div>
                    <img src="./images/logo_ngang.png" alt="Logo" />
                </div>

                <Navbar />

                <div>
                    <input className='border-2' type="text" />
                    <button>Find</button>
                </div>
            </header>
        </>
    );
};

export default Header;