'use client';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js'; // Import Typed.js directly

interface CustomTypedProps {
  text: string;
}

const CustomTyped: React.FC<CustomTypedProps> = ({ text }) => {
  const typedElementRef = useRef<HTMLParagraphElement>(null); // Ref for the element

  useEffect(() => {
    if (!typedElementRef.current) return;

    // Initialize Typed.js
    const typed = new Typed(typedElementRef.current, {
      strings: [text], // Text to type
      typeSpeed: 50,
      backSpeed: 30,
      loop: false,
      showCursor: false, // Hides cursor
    });

    return () => {
      typed.destroy(); // Cleanup on unmount
    };
  }, [text]);

  return <p ref={typedElementRef}></p>; // Attach ref to element
};

export default CustomTyped;
