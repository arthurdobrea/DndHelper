export interface Monster {
    slug: string;
    name: string;
    challenge_rating: string;
    type: string;
    size: string;
    hit_points: number;
    armor_class: number;
    alignment: string;
    speed: Speed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    perception: number;
    actions: Actions[];
    special_abilities: SpecialAbilities[];
}

export const STAT_ICONS = {
    speed: '💨',
    strength: '💪',
    dexterity: '🏹',
    constitution: '🩸',
    intelligence: '🧠',
    wisdom: '🦉',
    charisma: '🎭',
    perception: '👁️',
    actions: '⚔️',
    special_abilities: '✨',
} as const; // as const делает поля read-only

export interface MonsterCardProps {
    data: Monster;
}

export interface ClassCardProps {
    data: Class;
}

interface Speed {
    hover: number;
    fly: number;
    climb: number;
    walk: number;
    burrow: number;
}

export interface Actions {
    name: string;
    desc: string;
}

export interface SpecialAbilities {
    name: string;
    desc: string;
}

export interface Open5eResponse<T = Monster> {
    count: number;
    results: T[];
}

// Class interfaces
export interface Archetype {
    name: string;
    slug: string;
    desc: string;
}

export interface Class {
    name: string;
    slug: string;
    desc: string;
    hit_dice: string;
    hp_at_1st_level: string;
    hp_at_higher_levels: string;
    prof_armor: string;
    prof_weapons: string;
    prof_tools: string;
    prof_saving_throws: string;
    prof_skills: string;
    equipment: string;
    table: string;
    spellcasting_ability: string;
    subtypes_name: string;
    archetypes: Archetype[];
}

// Race interfaces
export interface AbilityScoreIncrease {
    attributes: string[];
    value: number;
}

export interface RaceSpeed {
    walk: number;
}

export interface Subrace {
    name: string;
    slug: string;
    desc: string;
    asi_desc?: string;
    asi?: AbilityScoreIncrease[];
    traits?: string;
}

export interface Race {
    name: string;
    slug: string;
    desc: string;
    asi_desc: string;
    asi: AbilityScoreIncrease[];
    age: string;
    alignment: string;
    size: string;
    size_raw: string;
    speed: RaceSpeed;
    speed_desc: string;
    languages: string;
    vision: string;
    traits: string;
    subraces: Subrace[];
}