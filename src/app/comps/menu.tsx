import Link from 'next/link'
import React from 'react'

const Menu = () => {
    return (
        <div>
            <div className="flex gap-8 text-[#EEEEEE] pt-5 text-xl">
                <Link href="/hello/projects" className="relative group hover:text-blue-500">
                    <span className="group-hover:pr-8 transition-all duration-300 ease-in-out">
                        /Projects
                    </span>
                    <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-2px] transition-all duration-300 ease-in-out">
                        ➜
                    </span>
                </Link>
                <Link href="" className="relative group hover:text-blue-500">
                    <span className="group-hover:pr-8 transition-all duration-300 ease-in-out">
                        /About me
                    </span>
                    <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-2px] transition-all duration-300 ease-in-out">
                        ➜
                    </span>
                </Link>
                <Link href="" className="relative group hover:text-blue-500">
                    <span className="group-hover:pr-8 transition-all duration-300 ease-in-out">
                        /Blog
                    </span>
                    <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-2px] transition-all duration-300 ease-in-out">
                        ➜
                    </span>
                </Link>
                <Link href="" className="relative group hover:text-blue-500">
                    <span className="group-hover:pr-8 transition-all duration-300 ease-in-out">
                        /Contact
                    </span>
                    <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-2px] transition-all duration-300 ease-in-out">
                        ➜
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default Menu
