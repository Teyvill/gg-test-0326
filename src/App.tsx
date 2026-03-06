/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  GameStep, 
  GameState, 
  INITIAL_CHARACTERS, 
  Character, 
  Trait,
  Gender,
  Difficulty,
  GENDER_DEFAULTS
} from './types';
import { SCENARIO } from './data';
import { CharacterCustomization } from './components/CharacterCustomization';
import { BookLayout } from './components/BookLayout';
import { DiceRoller } from './components/DiceRoller';
import { CharacterSelection, SelectionTarget } from './components/CharacterSelection';
import { motion } from 'motion/react';

const GENDER_MAP: Record<string, string> = {
  "был": "была",
  "пленен": "пленена",
  "вынужден": "вынуждена",
  "оказался": "оказалась",
  "решил": "решила",
  "пошел": "пошла",
  "увидел": "увидела",
  "принял": "приняла",
  "слыхал": "слыхала",
  "наблюдал": "наблюдала",
  "запоминал": "запоминала",
  "подбирался": "подбиралась",
  "проскальзывал": "проскальзывала",
  "подскальзывался": "подскальзывалась",
  "спускался": "спускалась",
  "шел": "шла",
  "дождался": "дождалась",
  "бросился": "бросилась",
  "успел": "успела",
  "сжимал": "сжимала",
  "добрался": "добралась",
  "атаковал": "атаковала",
  "велел": "велела",
  "остался": "осталась",
  "вышел": "вышла",
  "размахивал": "размахивала",
  "говорил": "говорила",
  "заявлял": "заявляла",
  "поддерживал": "поддерживала",
  "кивал": "кивала",
  "поддакивал": "поддакивала",
  "следовал": "следовала",
  "замечал": "замечала",
  "готовил": "готовила",
  "выливал": "выливала",
  "скрывался": "скрывалась",
  "чувствовал": "чувствовала",
  "обернулся": "обернулась",
  "видел": "видела",
  "тянулся": "тянулась",
  "ударил его": "ударила ее",
  "его": "ее",
  "него": "нее",
  "ему": "ей",
  "им": "ей",
  "самому себе": "самой себе",
  "пленник": "пленница",
  "чужак": "чужачка",
  "герой": "героиня",
  "плененный": "плененная",
  "загнанная добыча": "загнанная добыча", // stays same
  "оглушен": "оглушена",
  "выбитым": "выбитой",
  "связанного": "связанную",
  "проводника": "проводницу",
  "тюремщиков": "тюремщиц",
  "лишившись": "лишившись",
  "взбирается": "взбирается",
  "хватает": "хватает",
  "удерживает": "удерживает",
  "поворачивается": "поворачивается",
  "заносит": "заносит",
  "спрыгивает": "спрыгивает",
  "отбиваться": "отбиваться",
  "отступать": "отступать",
  "покидает": "покидает",
  "уставшей": "уставшей",
  "измотанной": "измотанной",
  "разозлившись": "разозлившись",
  "изгоняет": "изгоняет",
  "потеряв": "потеряв",
  "одного соратника": "одну соратницу"
};

export default function App() {
  const [state, setState] = useState<GameState>({
    step: GameStep.CharacterCustomization,
    difficulty: Difficulty.Easy,
    characters: INITIAL_CHARACTERS,
    firstChoiceId: null,
    secondChoiceId: null,
    encounter1Success: null,
    encounter2Success: null,
    currentParagraphIndex: 0,
    lastDiceRoll: null,
    isRolling: false
  });

  const successThreshold = useMemo(() => {
    if (state.difficulty === Difficulty.Easy) return 7;
    if (state.difficulty === Difficulty.Medium) return 10;
    return 13;
  }, [state.difficulty]);

  const currentCharacter = useMemo(() => {
    const id = state.step <= GameStep.Encounter1Result ? state.firstChoiceId : state.secondChoiceId;
    return state.characters.find(c => c.id === id);
  }, [state.characters, state.firstChoiceId, state.secondChoiceId, state.step]);

  const firstChoiceCharacter = useMemo(() => 
    state.characters.find(c => c.id === state.firstChoiceId),
    [state.characters, state.firstChoiceId]
  );

  const secondChoiceCharacter = useMemo(() => 
    state.characters.find(c => c.id === state.secondChoiceId),
    [state.characters, state.secondChoiceId]
  );

  const processGenderText = (text: string, char: Character | undefined) => {
    if (!char) return text;
    
    let processed = text;
    
    // Handle {male|female} syntax
    // This handles cases like {сделал|сделала}, {его|её}, {герой|героиня}
    processed = processed.replace(/\{([^|]*)\|([^}]*)\}/g, (_, male, female) => {
      return char.gender === Gender.Male ? male : female;
    });

    // Handle {|a} syntax (common for Russian verb endings)
    processed = processed.replace(/\{\|([^}]*)\}/g, (_, femalePart) => {
      return char.gender === Gender.Male ? "" : femalePart;
    });

    if (char.gender === Gender.Male) return processed;
    
    // Apply GENDER_MAP for female characters for any remaining words
    const keys = Object.keys(GENDER_MAP).sort((a, b) => b.length - a.length);
    
    for (const key of keys) {
      // Use word boundary for simple words, but some are phrases
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processed = processed.replace(regex, GENDER_MAP[key]);
    }
    return processed;
  };

  const getParagraphs = (text: string) => {
    if (!text) return [];
    let processed = text;
    
    // Replace placeholders first
    if (currentCharacter) {
      const defaults = GENDER_DEFAULTS[currentCharacter.trait][currentCharacter.gender];
      processed = processed.replace(/%Character_CowardGenitive/g, defaults.genitiveName);
      processed = processed.replace(/%Character_BraveGenitive/g, defaults.genitiveName);
      processed = processed.replace(/%Character_CharismaticGenitive/g, defaults.genitiveName);
      processed = processed.replace(/%Character_InfamousGenitive/g, defaults.genitiveName);
      
      processed = processed.replace(/%Character_CowardAccusative/g, defaults.accusativeName);
      processed = processed.replace(/%Character_BraveAccusative/g, defaults.accusativeName);
      processed = processed.replace(/%Character_CharismaticAccusative/g, defaults.accusativeName);
      processed = processed.replace(/%Character_InfamousAccusative/g, defaults.accusativeName);

      processed = processed.replace(/%NAME%/g, currentCharacter.name);
      processed = processed.replace(/%Character_Coward/g, currentCharacter.name);
      processed = processed.replace(/%Character_Brave/g, currentCharacter.name);
      processed = processed.replace(/%Character_Charismatic/g, currentCharacter.name);
      processed = processed.replace(/%Character_Infamous/g, currentCharacter.name);
    }
    if (firstChoiceCharacter) {
      const defaults = GENDER_DEFAULTS[firstChoiceCharacter.trait][firstChoiceCharacter.gender];
      processed = processed.replace(/%FirstChoiceGenitive/g, defaults.genitiveName);
      processed = processed.replace(/%FirstChoiceAccusative/g, defaults.accusativeName);
      processed = processed.replace(/%FirstChoice/g, firstChoiceCharacter.name);
      processed = processed.replace(/%FIRST_CHOICE_NAME%/g, firstChoiceCharacter.name);
    }
    if (secondChoiceCharacter) {
      const defaults = GENDER_DEFAULTS[secondChoiceCharacter.trait][secondChoiceCharacter.gender];
      processed = processed.replace(/%SecondChoiceGenitive/g, defaults.genitiveName);
      processed = processed.replace(/%SecondChoiceAccusative/g, defaults.accusativeName);
      processed = processed.replace(/%SecondChoice/g, secondChoiceCharacter.name);
      processed = processed.replace(/%SECOND_CHOICE_NAME%/g, secondChoiceCharacter.name);
    }

    // Add gender markers for specific choices
    if (firstChoiceCharacter) {
      const isFemale = firstChoiceCharacter.gender === Gender.Female;
      processed = processed.replace(/\{f1:([^|]*)\|([^}]*)\}/g, (_, m, f) => isFemale ? f : m);
      processed = processed.replace(/\{f1:\|([^}]*)\}/g, (_, f) => isFemale ? f : "");
    }
    if (secondChoiceCharacter) {
      const isFemale = secondChoiceCharacter.gender === Gender.Female;
      processed = processed.replace(/\{f2:([^|]*)\|([^}]*)\}/g, (_, m, f) => isFemale ? f : m);
      processed = processed.replace(/\{f2:\|([^}]*)\}/g, (_, f) => isFemale ? f : "");
    }

    // Apply gender processing based on the character currently in focus
    if (state.step === GameStep.CompanionText) {
      // In companionSuccess, gendered text refers to FirstChoice (the one rescued)
      // In companionFailure, gendered text refers to SecondChoice (the one who failed to rescue)
      const charForGender = state.encounter2Success ? firstChoiceCharacter : secondChoiceCharacter;
      processed = processGenderText(processed, charForGender);
    } else if (state.step === GameStep.Ending) {
      // Endings are mostly about the party, but we'll use the second character as a default reference
      processed = processGenderText(processed, secondChoiceCharacter);
    } else {
      processed = processGenderText(processed, currentCharacter);
    }
    
    // Split into paragraphs first
    const rawParagraphs = processed.split('\n\n').filter(p => p.trim().length > 0);
    const finalParagraphs: string[] = [];

    // Further split long paragraphs by sentences to avoid scrolling
    rawParagraphs.forEach(p => {
      if (p.length > 500) {
        // Split by sentence boundaries (approximate)
        const sentences = p.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [p];
        let currentChunk = "";
        sentences.forEach(s => {
          if ((currentChunk + s).length > 500 && currentChunk.length > 0) {
            finalParagraphs.push(currentChunk.trim());
            currentChunk = s;
          } else {
            currentChunk += s;
          }
        });
        if (currentChunk) finalParagraphs.push(currentChunk.trim());
      } else {
        finalParagraphs.push(p.trim());
      }
    });
    
    return finalParagraphs;
  };

  const calculateEndingId = () => {
    const isGroupA = (trait: Trait) => trait === Trait.Coward || trait === Trait.Charismatic;
    const char1 = firstChoiceCharacter;
    const char2 = secondChoiceCharacter;
    
    if (!char1 || !char2) return 9; // Fallback to worst ending if data missing

    const s1 = state.encounter1Success;
    const s2 = state.encounter2Success;

    if (s1) {
      if (s2) {
        if (isGroupA(char1.trait)) {
          return isGroupA(char2.trait) ? 1 : 2;
        } else {
          return isGroupA(char2.trait) ? 4 : 5;
        }
      } else {
        return isGroupA(char1.trait) ? 3 : 6;
      }
    } else {
      if (s2) {
        return isGroupA(char2.trait) ? 7 : 8;
      } else {
        return 9;
      }
    }
  };

  const currentStoryData = useMemo(() => {
    switch (state.step) {
      case GameStep.Prologue:
        return { title: SCENARIO.prologue.title, text: SCENARIO.prologue.fullText, image: SCENARIO.prologue.image };
      case GameStep.Encounter1Story:
        if (!currentCharacter) return null;
        return { 
          title: SCENARIO.encounter1.title, 
          text: SCENARIO.encounter1[currentCharacter.trait].story,
          image: SCENARIO.encounter1.image
        };
      case GameStep.Encounter1Result:
        if (!currentCharacter) return null;
        return {
          title: state.encounter1Success ? "Успех" : "Провал",
          text: state.encounter1Success 
            ? SCENARIO.encounter1[currentCharacter.trait].success 
            : SCENARIO.encounter1[currentCharacter.trait].failure,
          image: SCENARIO.encounter1.image
        };
      case GameStep.Interlude:
        return { title: SCENARIO.interlude.title, text: SCENARIO.interlude.fullText, image: SCENARIO.interlude.image };
      case GameStep.Encounter2Story:
        if (!currentCharacter) return null;
        return { 
          title: SCENARIO.encounter2.title, 
          text: SCENARIO.encounter2[currentCharacter.trait].story,
          image: SCENARIO.encounter2.image
        };
      case GameStep.Encounter2Result:
        if (!currentCharacter) return null;
        return {
          title: state.encounter2Success ? "Успех" : "Провал",
          text: state.encounter2Success 
            ? SCENARIO.encounter2[currentCharacter.trait].success 
            : SCENARIO.encounter2[currentCharacter.trait].failure,
          image: SCENARIO.encounter2.image
        };
      case GameStep.CompanionText:
        return {
          title: "Судьба соратников",
          text: state.encounter2Success ? SCENARIO.companionSuccess : SCENARIO.companionFailure,
          image: SCENARIO.encounter1.image
        };
      case GameStep.Ending:
        const endingId = calculateEndingId();
        const endingText = (SCENARIO.endings as any)[endingId] || "Концовка не найдена.";
        return {
          title: "Итог квеста",
          text: endingText,
          image: SCENARIO.endings.image
        };
      default:
        return null;
    }
  }, [state.step, currentCharacter, state.encounter1Success, state.encounter2Success, firstChoiceCharacter, secondChoiceCharacter]);

  const handleNext = () => {
    const paragraphs = currentStoryData ? getParagraphs(currentStoryData.text) : [];
    
    if (state.currentParagraphIndex < paragraphs.length - 1) {
      setState(prev => ({ ...prev, currentParagraphIndex: prev.currentParagraphIndex + 1 }));
      return;
    }

    // Move to next step
    setState(prev => {
      let nextStep = GameStep.Thanks;
      
      const nextStepMap: Partial<Record<GameStep, GameStep>> = {
        [GameStep.CharacterCustomization]: GameStep.Prologue,
        [GameStep.Prologue]: GameStep.Encounter1Selection,
        [GameStep.Encounter1Selection]: GameStep.Encounter1Story,
        [GameStep.Encounter1Story]: GameStep.Encounter1Roll,
        [GameStep.Encounter1Roll]: GameStep.Encounter1Result,
        [GameStep.Encounter1Result]: GameStep.Interlude,
        [GameStep.Interlude]: GameStep.Encounter2Selection,
        [GameStep.Encounter2Selection]: GameStep.Encounter2Story,
        [GameStep.Encounter2Story]: GameStep.Encounter2Roll,
        [GameStep.Encounter2Roll]: GameStep.Encounter2Result,
        [GameStep.Encounter2Result]: prev.encounter1Success ? GameStep.Ending : GameStep.CompanionText,
        [GameStep.CompanionText]: GameStep.Ending,
        [GameStep.Ending]: GameStep.Thanks
      };

      nextStep = nextStepMap[prev.step] || GameStep.Thanks;

      return {
        ...prev,
        step: nextStep,
        currentParagraphIndex: 0
      };
    });
  };

  const handleCharacterSelect = (char: Character) => {
    if (state.step === GameStep.Encounter1Selection) {
      setState(prev => ({
        ...prev,
        firstChoiceId: char.id,
        step: GameStep.Encounter1Story
      }));
    } else if (state.step === GameStep.Encounter2Selection) {
      setState(prev => ({
        ...prev,
        secondChoiceId: char.id,
        step: GameStep.Encounter2Story
      }));
    }
  };

  const handleRollComplete = (result: number) => {
    if (state.step === GameStep.Encounter1Roll) {
      setState(prev => {
        const success = result >= successThreshold;
        // If E1 failed, the first character becomes unavailable for E2
        const updatedCharacters = prev.characters.map(c => 
          c.id === prev.firstChoiceId ? { ...c, isAvailable: success } : c
        );
        return {
          ...prev,
          lastDiceRoll: result,
          encounter1Success: success,
          characters: updatedCharacters,
          step: GameStep.Encounter1Result
        };
      });
    } else if (state.step === GameStep.Encounter2Roll) {
      setState(prev => ({
        ...prev,
        lastDiceRoll: result,
        encounter2Success: result >= successThreshold,
        step: GameStep.Encounter2Result
      }));
    }
  };

  if (state.step === GameStep.CharacterCustomization) {
    return (
      <CharacterCustomization 
        characters={state.characters} 
        difficulty={state.difficulty}
        onDifficultyChange={(diff) => setState(prev => ({ ...prev, difficulty: diff }))}
        onComplete={(chars) => setState(prev => ({ ...prev, characters: chars, step: GameStep.Prologue }))} 
      />
    );
  }

  if (state.step === GameStep.Encounter1Selection || state.step === GameStep.Encounter2Selection) {
    return (
      <BookLayout
        showNext={false}
        leftContent={
          <CharacterSelection 
            characters={state.characters} 
            onSelect={handleCharacterSelect}
            title={state.step === GameStep.Encounter1Selection ? SCENARIO.encounter1.title : SCENARIO.encounter2.title}
          />
        }
        rightContent={
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="font-display text-2xl text-black/60 mb-8">ВЫБЕРИТЕ ПЕРСОНАЖА:</h3>
            <SelectionTarget onDrop={(id) => {
              const char = state.characters.find(c => c.id === id);
              if (char && char.isAvailable) handleCharacterSelect(char);
            }} />
          </div>
        }
      />
    );
  }

  if (state.step === GameStep.Encounter1Roll || state.step === GameStep.Encounter2Roll) {
    return (
      <BookLayout
        showNext={false}
        leftContent={
          <div className="flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl text-black/80 text-center uppercase">Испытание</h2>
            <div className="w-64 aspect-[4/5] rounded-lg border-4 border-amber-900/20 overflow-hidden shadow-2xl">
              <img src={currentCharacter?.portrait} alt={currentCharacter?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="font-display text-xl text-amber-900">{currentCharacter?.name}</p>
          </div>
        }
        rightContent={<DiceRoller onComplete={handleRollComplete} threshold={successThreshold} />}
      />
    );
  }

  if (state.step === GameStep.Thanks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a1a] p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl parchment p-16 rounded-lg text-center shadow-2xl relative"
        >
          <div className="absolute inset-0 border-[24px] border-double border-black/5 pointer-events-none" />
          <h1 className="font-display text-4xl text-black mb-8">КВЕСТ ЗАВЕРШЕН</h1>
          <p className="font-serif text-2xl text-black/80 mb-12 italic">
            Благодарим за прохождение квеста!
          </p>
          <div className="w-24 h-px bg-black/20 mx-auto mb-8" />
          <p className="font-display text-lg text-black/60 uppercase tracking-widest">
            Андрей Беленький для Game Garden
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-12 px-8 py-3 bg-amber-800 text-white font-display rounded hover:bg-amber-700 transition-colors"
          >
            ИГРАТЬ СНОВА
          </button>
        </motion.div>
      </div>
    );
  }

  const paragraphs = currentStoryData ? getParagraphs(currentStoryData.text) : [];
  const currentParagraph = paragraphs[state.currentParagraphIndex];

  return (
    <BookLayout
      onNext={handleNext}
      nextLabel={state.step === GameStep.Ending && state.currentParagraphIndex === paragraphs.length - 1 ? "Завершить квест" : "Далее"}
      leftContent={
        <div className="w-full h-full flex flex-col items-center">
          <div className="w-full aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border-4 border-amber-900/10 mb-4">
            <img 
              src={currentStoryData?.image} 
              alt="Story" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="font-display text-2xl text-black/80 text-center uppercase tracking-widest">
            {currentStoryData?.title}
          </h2>
        </div>
      }
      rightContent={
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <motion.p
              key={`${state.step}-${state.currentParagraphIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-book text-2xl leading-relaxed text-black/90 first-letter:text-5xl first-letter:font-display first-letter:mr-1 first-letter:float-left"
            >
              {currentParagraph}
            </motion.p>
          </div>
          <div className="mt-4 text-center font-serif text-sm text-black/40 italic">
            Страница {state.currentParagraphIndex + 1} из {paragraphs.length}
          </div>
        </div>
      }
    />
  );
}
