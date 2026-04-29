import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  // Handle syntax highlighting for Python keywords
  const highlightCode = (code: string) => {
    const keywords = ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'self', 'for', 'in'];
    let highlighted = code;
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-purple-400 font-bold">${kw}</span>`);
    });
    
    // Simple regex for strings
    highlighted = highlighted.replace(/(['"])(.*?)\1/g, '<span class="text-green-400">"$2"</span>');
    
    // Simple regex for numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="text-orange-400">$&</span>');

    return highlighted;
  };

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
      <div 
        dangerouslySetInnerHTML={{ __html: highlightCode(displayedText) }} 
        className="inline"
      />
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-2 h-5 bg-cyan-400 align-middle ml-1"
      />
    </div>
  );
}
