
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Character, Gender, GENDER_DEFAULTS, Trait, Difficulty } from '../types';
import { User, UserRound, Check, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface CharacterCustomizationProps {
  characters: Character[];
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onComplete: (updatedCharacters: Character[]) => void;
}

export const CharacterCustomization: React.FC<CharacterCustomizationProps> = ({
  characters,
  difficulty,
  onDifficultyChange,
  onComplete
}) => {
  const [localCharacters, setLocalCharacters] = useState<Character[]>(characters);

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setLocalCharacters(prev => prev.map(c => {
      if (c.id === id) {
        const newChar = { ...c, ...updates };
        // If gender changed, update default name and portrait if they weren't customized
        if (updates.gender) {
          const defaults = GENDER_DEFAULTS[c.trait][updates.gender];
          newChar.name = defaults.name;
          newChar.portrait = defaults.portrait;
        }
        return newChar;
      }
      return c;
    }));
  };

  const difficultyOptions = [
    { id: Difficulty.Easy, icon: ShieldCheck, label: "Легкий", color: "text-green-500", active: "bg-green-900/40 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" },
    { id: Difficulty.Medium, icon: Shield, label: "Средний", color: "text-yellow-500", active: "bg-yellow-900/40 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" },
    { id: Difficulty.Hard, icon: ShieldAlert, label: "Высокий", color: "text-red-500", active: "bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" }
  ];

  const getImagePath = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = (import.meta as any).env.BASE_URL || "/";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return base + cleanPath;
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] p-8 flex flex-col items-center overflow-y-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl text-amber-500 mb-8 tracking-widest"
      >
        НАСТРОЙКА ПУТЕШЕСТВИЯ
      </motion.h1>

      {/* Difficulty Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#2a2a2a] border-2 border-amber-900/30 rounded-lg p-6 mb-12 shadow-2xl"
      >
        <h2 className="font-display text-xl text-amber-200 mb-6 text-center uppercase tracking-wider">Уровень сложности</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onDifficultyChange(opt.id)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 group ${
                difficulty === opt.id 
                  ? opt.active
                  : 'bg-black/20 border-amber-900/20 hover:border-amber-700'
              }`}
            >
              <opt.icon className={`w-8 h-8 ${difficulty === opt.id ? opt.color : 'text-amber-900 group-hover:text-amber-700'}`} />
              <span className={`font-display text-lg ${difficulty === opt.id ? 'text-white' : 'text-amber-900/60'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <h2 className="font-display text-xl text-amber-200 mb-6 uppercase tracking-wider">Ваши герои</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {localCharacters.map((char) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2a2a2a] border-2 border-amber-900/50 rounded-lg p-3 flex flex-col gap-3 shadow-2xl"
          >
            <div className="relative aspect-[4/5] w-full max-w-[200px] mx-auto overflow-hidden rounded border border-amber-900/30">
              <img 
                src={getImagePath(char.portrait)} 
                alt={char.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center font-display text-[10px] text-amber-200 uppercase tracking-tighter">
                {char.race}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={char.name}
                onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                className="bg-black/40 border border-amber-900/30 rounded px-2 py-1 font-serif text-base text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Имя персонажа"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => updateCharacter(char.id, { gender: Gender.Male })}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded border text-sm transition-all ${
                    char.gender === Gender.Male 
                      ? 'bg-amber-700 border-amber-500 text-white' 
                      : 'bg-black/20 border-amber-900/30 text-amber-700 hover:border-amber-700'
                  }`}
                >
                  <User size={14} />
                  М
                </button>
                <button
                  onClick={() => updateCharacter(char.id, { gender: Gender.Female })}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded border text-sm transition-all ${
                    char.gender === Gender.Female 
                      ? 'bg-amber-700 border-amber-500 text-white' 
                      : 'bg-black/20 border-amber-900/30 text-amber-700 hover:border-amber-700'
                  }`}
                >
                  <UserRound size={14} />
                  Ж
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onComplete(localCharacters)}
        className="mt-16 px-12 py-4 bg-amber-700 hover:bg-amber-600 text-white font-display text-2xl rounded-full shadow-lg flex items-center gap-3 transition-all"
      >
        <Check size={28} />
        НАЧАТЬ ПУТЕШЕСТВИЕ
      </motion.button>
    </div>
  );
};
