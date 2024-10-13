'use client';
import React, { useState, useEffect } from 'react';

const TypingEffect = () => {
  const words = React.useMemo(() => ["Student", "Teacher", "Web Developer"], []);
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 1200; // pause time between each word

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (!isDeleting && text === words[index]) {
      // Start deleting after typing the word
      typingTimeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      // Move to next word after deleting
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    } else {
      typingTimeout = setTimeout(() => {
        // Typing or deleting characters
        const updatedText = isDeleting
          ? words[index].substring(0, text.length - 1)
          : words[index].substring(0, text.length + 1);
        setText(updatedText);
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(typingTimeout);
  }, [text, isDeleting, index, words]);

  return (
    <div className="text-2xl font-bold text-[#EEEEEE]">
      <p>I&apos;m a <span className="text-[#76ABAE]">{text}</span>|</p>
    </div>
  );
};

export default TypingEffect;
