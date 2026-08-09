'use client';
import React, { useState, useEffect } from 'react';

const WORDS = [
  'Ecommerce Executive',
  'Freelance Full-Stack Developer',
  'AI Feature Developer',
];

const TypingEffect = () => {
  const words = WORDS;
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  // Read after mount so the server and first client render agree.
  const [reduceMotion, setReduceMotion] = useState(false);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 1200; // pause time between each word

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    // Reduced motion: no cycling timer at all — the roles are shown as a
    // static line instead.
    if (reduceMotion) return;

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
  }, [text, isDeleting, index, words, reduceMotion]);

  // "a" vs "an" depends on the word currently being typed
  const article = /^[aeiou]/i.test(words[index]) ? "an" : "a";

  if (reduceMotion) {
    return (
      <p className="type-h3 font-semibold text-[#EEEEEE]">
        <span className="text-[#76ABAE]">{words.join(' · ')}</span>
      </p>
    );
  }

  return (
    // The character-by-character churn is noise for a screen reader, so the
    // animated line is hidden and the full list of roles announced instead.
    <div className="type-h3 font-semibold text-[#EEEEEE]">
      <p className="flex flex-wrap items-baseline gap-x-1.5" aria-hidden="true">
        I&apos;m {article} <span className="text-[#76ABAE]">{text}</span>
        <span className="animate-pulse">|</span>
      </p>
      <span className="sr-only">{`I'm ${words.join(', ')}.`}</span>
    </div>
  );
};

export default TypingEffect;
