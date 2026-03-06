
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
    portrait: "/Images/COW_M.png",
    isAvailable: true
  },
  {
    id: "brave",
    trait: Trait.Brave,
    name: "Троггви",
    race: "Гном",
    gender: Gender.Male,
    portrait: "/Images/BRA_M.png",
    isAvailable: true
  },
  {
    id: "charismatic",
    trait: Trait.Charismatic,
    name: "Феофан",
    race: "Человек",
    gender: Gender.Male,
    portrait: "/Images/CH_M.png",
    isAvailable: true
  },
  {
    id: "infamous",
    trait: Trait.Infamous,
    name: "Кир",
    race: "Человек",
    gender: Gender.Male,
    portrait: "/Images/INF_M.png",
    isAvailable: true
  }
];

export const GENDER_DEFAULTS: Record<Trait, Record<Gender, { name: string; genitiveName: string; accusativeName: string; portrait: string }>> = {
  [Trait.Coward]: {
    [Gender.Male]: { name: "Вальдемар", genitiveName: "Вальдемара", accusativeName: "Вальдемара", portrait: "/Images/COW_M.png" },
    [Gender.Female]: { name: "Флоримель", genitiveName: "Флоримель", accusativeName: "Флоримель", portrait: "/Images/COW_F.png" }
  },
  [Trait.Brave]: {
    [Gender.Male]: { name: "Троггви", genitiveName: "Троггви", accusativeName: "Троггви", portrait: "/Images/BRA_M.png" },
    [Gender.Female]: { name: "Фрейя", genitiveName: "Фрейи", accusativeName: "Фрейю", portrait: "/Images/BRA_F.png" }
  },
  [Trait.Charismatic]: {
    [Gender.Male]: { name: "Феофан", genitiveName: "Феофана", accusativeName: "Феофана", portrait: "/Images/CH_M.png" },
    [Gender.Female]: { name: "Анна", genitiveName: "Анны", accusativeName: "Анну", portrait: "/Images/CH_F.png" }
  },
  [Trait.Infamous]: {
    [Gender.Male]: { name: "Кир", genitiveName: "Кира", accusativeName: "Кира", portrait: "/Images/INF_M.png" },
    [Gender.Female]: { name: "Аиса", genitiveName: "Аисы", accusativeName: "Аису", portrait: "/Images/INF_F.png" }
  }
};
