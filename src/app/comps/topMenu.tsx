import Menu from './menu'
import Link from 'next/link'
import React from 'react'
import MobileMenu from './mobileMenu'
import FloatingActions from '../components/FloatingActions'

const TopMenu = () => {
    return (
        <div className='flex items-center justify-between gap-3 p-4 sm:p-5 sm:pl-10 sm:pr-10'>
            <Link href='/' className='text-[22px] font-medium text-[#EEEEEE] sm:text-[30px]'>Asif Bhuiyan Shawon</Link>
            <div className="flex items-center gap-3 sm:gap-5">
                <div className="top-menu__links lg:block hidden">
                    <Menu className="pt-0" withBlogMenu />
                </div>
                <FloatingActions placement="navbar" />
                <div className="lg:hidden block">
                    <MobileMenu />
                </div>
            </div>

        </div>
    )
}

export default TopMenu
