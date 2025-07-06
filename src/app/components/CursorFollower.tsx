'use client';
import { useEffect, useState } from 'react';

export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorPosition = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    window.addEventListener('mousemove', updateMousePosition);
    const interval = setInterval(updateCursorPosition, 16);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearInterval(interval);
    };
  }, [mousePosition]);

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      <div
        className="custom-cursor-follower"
        style={{
          left: cursorPosition.x - 20,
          top: cursorPosition.y - 20,
        }}
      />
      <div
        className="floating-gradient"
        style={{
          left: cursorPosition.x - 150,
          top: cursorPosition.y - 150,
        }}
      />
    </>
  );
}