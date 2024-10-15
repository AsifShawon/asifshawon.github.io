'use client'
import React, { useEffect, useRef } from 'react';
import { Typed } from 'react-typed'; // Regular import from the library
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import { Itim as ItimFont } from 'next/font/google';

const itim = ItimFont({ weight: '400', subsets: ['latin'] });

export default function Page() {
  const typedElementRef = useRef(null); // Create a ref to attach the Typed.js instance

  useEffect(() => {
    const typed = new Typed(typedElementRef.current, {
      strings: [
        "Hello, Myself <span class='text-[#76ABAE]'>Asif Bhuiyan Shawon</span>"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: false,
      showCursor: false,
    });

    // Clean up the Typed instance on unmount
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <div className='pl-10 opacity-70 font-mono pt-10'>
        <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "About Me", href: "/aboutme" }]} />
      </div>
      <div>
        <div className="flex justify-center items-center pt-20 text-4xl sm:text-5xl lg:text-6xl">
          {/* Typed.js will replace the content inside this h1 */}
          <h1 ref={typedElementRef} className={itim.className}></h1>
        </div>
      </div>
    </div>
  );
}
