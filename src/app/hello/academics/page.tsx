import CustomBreadcrumb from '@/app/comps/breadCrumb'
import React from 'react'

export default function Academics() {
    return (
        <div>
            <div className='pl-10 opacity-70 font-mono pt-10'>
                <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "Academics", href: "/academics" }]} />
            </div>
            <div>
                <div className="flex justify-center items-center pt-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl">
                        <div className="text-[#76ABAE]">Academics</div>
                    </h1>
                </div>
            </div>
        </div>
    )
}
