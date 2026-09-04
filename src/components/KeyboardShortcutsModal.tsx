import React, { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md glass-card rounded-2xl p-6 border border-[#F26A2E]/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#F26A2E]/15 text-[#F26A2E]">
            <Keyboard className="w-5 h-5" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-white">Keyboard Shortcuts</h3>
        </div>

        <div className="space-y-3 font-mono text-xs text-stone-300">
          <div className="flex justify-between items-center py-2 border-b border-stone-800">
            <span>Toggle Shortcuts Modal</span>
            <kbd className="px-2 py-1 rounded bg-stone-800 border border-stone-700 text-amber-400">?</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-stone-800">
            <span>Close Modal / Drawer</span>
            <kbd className="px-2 py-1 rounded bg-stone-800 border border-stone-700 text-stone-300">Esc</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-stone-800">
            <span>Scroll To Top</span>
            <kbd className="px-2 py-1 rounded bg-stone-800 border border-stone-700 text-stone-300">Home</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
