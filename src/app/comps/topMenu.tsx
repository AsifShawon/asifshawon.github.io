import Menu from './menu'
import Link from 'next/link'
import React from 'react'

const TopMenu = () => {
    return (
        <div className='flex justify-between p-5 pl-10 pr-10'>
            <Link href='/' className='text-[30px] font-medium text-[#EEEEEE]'>Asif Bhuiyan Shawon</Link>
            <Menu />
        </div>
    )
}

export default TopMenu
