'use client'
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import CustomTyped from '@/app/comps/customTyped';
import { Itim as ItimFont } from 'next/font/google';

const itim = ItimFont({ weight: '400', subsets: ['latin'] });
const intro_text = "<div className={itim.className}>Hello, Myself <span class='text-[#76ABAE]'>Asif Bhuiyan Shawon</span></div>"

// "<div>Studying at North South University</div>"

export default function Page() {
  
  
  return (
    <div>
      <div className='pl-10 opacity-70 font-mono pt-10'>
        <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "About Me", href: "/aboutme" }]} />
      </div>
      <div>
        <div className="flex justify-center items-center pt-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">
            <CustomTyped text={intro_text}/>
          </h1>
          {/* <h3>
            <CustomTyped text="<div>Studying at North South University</div>"/>
          </h3> */}
        </div>
      </div>
    </div>
  );
}
