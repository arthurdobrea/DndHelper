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
    next: string | null;
    previous: string | null;
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

export interface RaceCardProps {
    data: Race;
}

// Weapon interfaces
export interface DamageType {
    name: string;
    key: string;
    url?: string;
}

export interface WeaponProperty {
    name: string;
    type: string | null;
    url?: string;
    desc: string;
}

export interface WeaponPropertyAssignment {
    property: WeaponProperty;
    detail: string | null;
}

export interface Weapon {
    key: string;
    name: string;
    slug?: string;
    damage_dice: string;
    damage_type: DamageType;
    range: number | null;
    long_range: number | null;
    is_simple: boolean;
    is_martial?: boolean;
    is_improvised: boolean;
    properties: string | WeaponPropertyAssignment[];
    ranged_attack_possible?: string;
    range_melee?: string;
    distance_unit: string;
}

export interface WeaponCardProps {
    data: Weapon;
}

// Magic Item interfaces
export interface ItemCategory {
    name: string;
    key: string;
}

export interface ItemRarity {
    name: string;
    key: string;
    rank: number;
}

export interface Armor {
    name: string;
    key: string;
    url: string;
    category: string;
    ac_base: number;
    ac_display: string;
    ac_add_dexmod: boolean;
    ac_cap_dexmod: number | null;
    grants_stealth_disadvantage: boolean;
    strength_score_required: number | null;
}

export interface MagicItem {
    key: string;
    name: string;
    slug?: string;
    desc: string;
    category: ItemCategory;
    rarity: ItemRarity;
    is_magic_item: boolean;
    weight?: string;
    weight_unit: string;
    cost?: string;
    requires_attunement: boolean;
    attunement_detail?: string | null;
    armor?: Armor | null;
    weapon?: Weapon | null;
}

export interface MagicItemCardProps {
    data: MagicItem;
}

