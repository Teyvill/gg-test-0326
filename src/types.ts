
export enum Trait {
  Coward = "Трусость",
  Brave = "Смелость",
  Charismatic = "Харизматичность",
  Infamous = "Одиозность"
}

export enum Gender {
  Male = "Мужской",
  Female = "Женский"
}

export interface Character {
  id: string;
  trait: Trait;
  name: string;
  race: string;
  gender: Gender;
  portrait: string;
  isAvailable: boolean;
}

export enum Difficulty {
  Easy = "Легкий",
  Medium = "Средний",
  Hard = "Высокий"
}

export interface GameState {
  step: GameStep;
  difficulty: Difficulty;
  characters: Character[];
  firstChoiceId: string | null;
  secondChoiceId: string | null;
  encounter1Success: boolean | null;
  encounter2Success: boolean | null;
  currentParagraphIndex: number;
  lastDiceRoll: number | null;
  isRolling: boolean;
}

export enum GameStep {
  CharacterCustomization,
  Prologue,
  Encounter1Selection,
  Encounter1Story,
  Encounter1Roll,
  Encounter1Result,
  Interlude,
  Encounter2Selection,
  Encounter2Story,
  Encounter2Roll,
  Encounter2Result,
  CompanionText,
  Ending,
  Thanks
}

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: "coward",
    trait: Trait.Coward,
    name: "Вальдемар",
    race: "Эльф",
    gender: Gender.Male,
    portrait: "/images/cow_m.png",
    isAvailable: true
  },
  {
    id: "brave",
    trait: Trait.Brave,
    name: "Троггви",
    race: "Гном",
    gender: Gender.Male,
    portrait: "/images/bra_m.png",
    isAvailable: true
  },
  {
    id: "charismatic",
    trait: Trait.Charismatic,
    name: "Феофан",
    race: "Человек",
    gender: Gender.Male,
    portrait: "/images/ch_m.png",
    isAvailable: true
  },
  {
    id: "infamous",
    trait: Trait.Infamous,
    name: "Кир",
    race: "Человек",
    gender: Gender.Male,
    portrait: "/images/inf_m.png",
    isAvailable: true
  }
];

export const GENDER_DEFAULTS: Record<Trait, Record<Gender, { name: string; genitiveName: string; accusativeName: string; portrait: string }>> = {
  [Trait.Coward]: {
    [Gender.Male]: { name: "Вальдемар", genitiveName: "Вальдемара", accusativeName: "Вальдемара", portrait: "/images/cow_m.png" },
    [Gender.Female]: { name: "Флоримель", genitiveName: "Флоримель", accusativeName: "Флоримель", portrait: "/images/cow_f.png" }
  },
  [Trait.Brave]: {
    [Gender.Male]: { name: "Троггви", genitiveName: "Троггви", accusativeName: "Троггви", portrait: "/images/bra_m.png" },
    [Gender.Female]: { name: "Фрейя", genitiveName: "Фрейи", accusativeName: "Фрейю", portrait: "/images/bra_f.png" }
  },
  [Trait.Charismatic]: {
    [Gender.Male]: { name: "Феофан", genitiveName: "Феофана", accusativeName: "Феофана", portrait: "/images/ch_m.png" },
    [Gender.Female]: { name: "Анна", genitiveName: "Анны", accusativeName: "Анну", portrait: "/images/ch_f.png" }
  },
  [Trait.Infamous]: {
    [Gender.Male]: { name: "Кир", genitiveName: "Кира", accusativeName: "Кира", portrait: "/images/inf_m.png" },
    [Gender.Female]: { name: "Аиса", genitiveName: "Аисы", accusativeName: "Аису", portrait: "/images/inf_f.png" }
  }
};
