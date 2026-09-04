import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[90] h-1 bg-stone-900/40">
      <div
        className="h-full bg-gradient-to-r from-[#F26A2E] via-amber-400 to-[#F26A2E] transition-all duration-75 shadow-[0_0_10px_#F26A2E]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
