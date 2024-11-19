'use client'
import React, { useEffect, useRef } from 'react'
import { Typed } from 'react-typed';

const CustomTyped: React.FC<{ text: string }> = ({ text }) => {
    const typedElementRef = useRef(null); // Create a ref to attach the Typed.js instance

    useEffect(() => {
        const typed = new Typed(typedElementRef.current, {
            strings: [
                text,
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: false,
            showCursor: false,
            html: true,
        });

        return () => {
            typed.destroy();
        };
    }, [text]);

    return (
        <p ref={typedElementRef}></p>
    )
}

export default CustomTyped
