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

export interface Open5eResponse {
    count: number;
    results: Monster[];
}