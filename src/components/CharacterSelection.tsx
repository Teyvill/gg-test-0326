
import React from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';

interface CharacterSelectionProps {
  characters: Character[];
  onSelect: (character: Character) => void;
  title: string;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  characters,
  onSelect,
  title
}) => {
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('characterId', id);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="font-display text-2xl text-black/80 mb-6 text-center uppercase tracking-widest">
        {title}
      </h2>
      
      <div className="flex-grow grid grid-cols-2 gap-3 p-2">
        {characters.map((char) => (
          <motion.div
            key={char.id}
            draggable={char.isAvailable}
            onDragStart={(e) => char.isAvailable && handleDragStart(e, char.id)}
            onClick={() => char.isAvailable && onSelect(char)}
            className={`relative aspect-[4/5] max-w-[140px] mx-auto w-full rounded border-2 overflow-hidden cursor-pointer transition-all ${
              char.isAvailable 
                ? 'border-amber-900/30 hover:border-amber-600 hover:shadow-xl' 
                : 'border-gray-400 grayscale opacity-50 cursor-not-allowed'
            }`}
            whileHover={char.isAvailable ? { scale: 1.02 } : {}}
          >
            <img 
              src={char.portrait} 
              alt={char.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
              <p className="font-display text-[10px] text-white uppercase truncate leading-tight">{char.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SelectionTarget: React.FC<{ onDrop: (id: string) => void }> = ({ onDrop }) => {
  const [isOver, setIsOver] = React.useState(false);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const id = e.dataTransfer.getData('characterId');
        if (id) onDrop(id);
      }}
      className={`w-full h-full border-4 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
        isOver ? 'border-amber-600 bg-amber-600/10' : 'border-black/10 bg-black/5'
      }`}
    >
      <p className="font-display text-2xl text-black/40 text-center px-8">
        ПЕРЕТАЩИТЕ ГЕРОЯ СЮДА
      </p>
      <p className="font-serif text-sm text-black/30 mt-2">
        или просто нажмите на портрет слева
      </p>
    </div>
  );
};
