
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  showNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
}

export const BookLayout: React.FC<BookLayoutProps> = ({
  leftContent,
  rightContent,
  onNext,
  onBack,
  showNext = true,
  showBack = false,
  nextLabel = "Далее"
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-6xl aspect-[16/10] flex book-shadow rounded-lg overflow-hidden"
      >
        {/* Left Page */}
        <div className="w-1/2 parchment border-r border-black/10 relative p-8 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 border-[16px] border-double border-black/5 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key="left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full flex items-center justify-center"
            >
              {leftContent}
            </motion.div>
          </AnimatePresence>
          
          {showBack && (
            <button
              onClick={onBack}
              className="absolute bottom-8 left-8 flex items-center gap-2 font-display text-black/60 hover:text-black transition-colors"
            >
              <ChevronLeft size={20} />
              Назад
            </button>
          )}
        </div>

        {/* Right Page */}
        <div className="w-1/2 parchment relative p-12 flex flex-col overflow-y-auto">
          <div className="absolute inset-0 border-[16px] border-double border-black/5 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key="right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-grow flex flex-col"
            >
              {rightContent}
            </motion.div>
          </AnimatePresence>

          {showNext && (
            <div className="mt-auto pt-8 flex justify-end">
              <button
                onClick={onNext}
                className="group flex items-center gap-2 font-display text-black/80 hover:text-black transition-colors text-xl"
              >
                {nextLabel}
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black/20 shadow-lg z-10" />
      </motion.div>
    </div>
  );
};
