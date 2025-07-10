import React, { useEffect, useState, useRef } from 'react';

export default function MotionCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const dotPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      mousePositionRef.current = newPosition;
      setMousePosition(newPosition);
      
      if (!isVisible) setIsVisible(true);
      
      // Update dot position immediately for super responsive feel
      if (cursorDotRef.current) {
        dotPositionRef.current = newPosition;
        cursorDotRef.current.style.transform = `translate(${newPosition.x - 17}px, ${newPosition.y - 17}px)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (target.classList.contains('cursor-hover') || target.tagName === 'BUTTON')) {
        setCursorVariant('hover');
      }
    };

    const handleElementLeave = () => {
      setCursorVariant('default');
    };

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .cursor-hover');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementHover);
      element.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [isVisible]);

  // Super smooth animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      if (cursorRef.current) {
        const cursor = cursorRef.current;
        const mouse = mousePositionRef.current;
        const current = cursorPositionRef.current;
        
        // Higher easing for super smooth following
        const easing = 0.25;
        const newX = current.x + (mouse.x - current.x) * easing;
        const newY = current.y + (mouse.y - current.y) * easing;
        
        cursorPositionRef.current = { x: newX, y: newY };
        cursor.style.transform = `translate(${newX - 32}px, ${newY - 32}px)`;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="cursor-none">
      {/* Custom Cursor Ring */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '64px',
          height: '64px',
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 border-white transition-all duration-300 ease-out ${
            cursorVariant === 'hover' 
              ? 'scale-125 bg-white/10 backdrop-blur-sm border-white/80' 
              : 'scale-100 bg-transparent border-white/60'
          }`}
          style={{
            mixBlendMode: 'difference',
          }}
        />
      </div>

      {/* Cursor Dot - Super Responsive */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-50 w-1 h-1 bg-white rounded-full transition-opacity duration-150 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${cursorVariant === 'hover' ? 'opacity-0' : 'opacity-100'}`}
        style={{
          width: cursorVariant === 'hover' ? '48px' : '34px',
          height: cursorVariant === 'hover' ? '48px' : '34px',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
}