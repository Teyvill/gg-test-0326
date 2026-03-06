
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DiceRollerProps {
  onComplete: (result: number) => void;
  threshold?: number;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onComplete, threshold = 7 }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setResult(null);

    // Simulate rolling animation
    setTimeout(() => {
      // Use crypto for better randomness
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const finalResult = (array[0] % 20) + 1;
      
      setResult(finalResult);
      setIsRolling(false);
      
      // Wait a bit before calling onComplete so user sees the result
      setTimeout(() => {
        onComplete(finalResult);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12">
      <h2 className="font-display text-3xl text-black/80 text-center">
        БРОСИТЬ ЖРЕБИЙ
      </h2>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!result && !isRolling ? (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={rollDice}
              className="cursor-pointer group"
            >
              <div className="w-32 h-32 bg-amber-600 rounded-lg rotate-45 flex items-center justify-center shadow-2xl group-hover:bg-amber-500 transition-colors">
                <span className="font-display text-4xl text-white -rotate-45">d20</span>
              </div>
              <div className="absolute inset-0 border-4 border-amber-900/20 rounded-full animate-pulse" />
            </motion.div>
          ) : isRolling ? (
            <motion.div
              key="rolling"
              className="w-32 h-32 bg-amber-600 rounded-lg animate-roll flex items-center justify-center shadow-2xl"
            >
              <span className="font-display text-4xl text-white">?</span>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0 }}
              className="w-32 h-32 bg-amber-700 rounded-lg rotate-45 flex items-center justify-center shadow-2xl dice-glow"
            >
              <span className={`font-display text-5xl text-white -rotate-45 ${result! >= threshold ? 'text-green-300' : 'text-red-300'}`}>
                {result}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-12 flex items-center justify-center">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-display text-4xl uppercase tracking-widest ${result >= threshold ? 'text-green-800' : 'text-red-800'}`}
          >
            {result >= threshold ? 'Успех!' : 'Провал!'}
          </motion.div>
        )}
      </div>

      {!result && !isRolling && (
        <button
          onClick={rollDice}
          className="px-8 py-3 bg-black text-white font-display text-xl rounded hover:bg-black/80 transition-colors"
        >
          Бросить кубик
        </button>
      )}
    </div>
  );
};
