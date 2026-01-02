'use client';

import { useState, useMemo, useEffect } from 'react';
import { MagicItem } from '@/types';

export interface MagicItemFilterParams {
    searchTerm: string;
    selectedCategory: string;
    selectedRarity: string;
    requiresAttunement: string;
    armorCategory: string;
    acRange: { min: number; max: number };
    weaponDamageType: string;
    weaponType: string;
}

interface MagicItemFilterProps {
    items: MagicItem[];
    onFilter: (params: MagicItemFilterParams) => void;
    isOpen?: boolean;
    onToggle?: () => void;
    filteredCount: number;
}

export default function MagicItemFilter({ items, onFilter, isOpen: externalIsOpen, onToggle, filteredCount }: MagicItemFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [requiresAttunement, setRequiresAttunement] = useState<string>('all');
    const [armorCategory, setArmorCategory] = useState<string>('all');
    const [acRange, setAcRange] = useState<{ min: number; max: number }>({ min: 10, max: 20 });
    const [weaponDamageType, setWeaponDamageType] = useState<string>('all');
    const [weaponType, setWeaponType] = useState<string>('all');
    const [internalIsExpanded, setInternalIsExpanded] = useState(true);

    const isExpanded = externalIsOpen !== undefined ? externalIsOpen : internalIsExpanded;
    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalIsExpanded(!internalIsExpanded);
        }
    };

    // Получаем уникальные значения для фильтров
    const uniqueCategories = useMemo(() => {
        const categories = new Set(items.map(i => i.category?.name).filter(Boolean));
        return Array.from(categories).sort();
    }, [items]);

    const uniqueRarities = useMemo(() => {
        const rarities = items.map(i => i.rarity).filter(Boolean);
        // Сортируем по рангу
        rarities.sort((a, b) => a.rank - b.rank);
        // Удаляем дубликаты по ключу
        return rarities.filter((r, index, self) =>
            index === self.findIndex(t => t.key === r.key)
        );
    }, [items]);

    const uniqueArmorCategories = useMemo(() => {
        const categories = new Set(
            items
                .filter(i => i.armor)
                .map(i => i.armor!.category)
                .filter(Boolean)
        );
        return Array.from(categories).sort();
    }, [items]);

    const uniqueWeaponDamageTypes = useMemo(() => {
        const types = new Set(
            items
                .filter(i => i.weapon)
                .map(i => i.weapon!.damage_type?.name)
                .filter(Boolean)
        );
        return Array.from(types).sort();
    }, [items]);

    // Создаем объект параметров фильтрации
    const filterParams = useMemo<MagicItemFilterParams>(() => ({
        searchTerm,
        selectedCategory,
        selectedRarity,
        requiresAttunement,
        armorCategory,
        acRange,
        weaponDamageType,
        weaponType
    }), [searchTerm, selectedCategory, selectedRarity, requiresAttunement, armorCategory, acRange, weaponDamageType, weaponType]);

    // Передаем параметры фильтрации родителю при их изменении
    useEffect(() => {
        onFilter(filterParams);
    }, [filterParams, onFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedRarity('all');
        setRequiresAttunement('all');
        setArmorCategory('all');
        setAcRange({ min: 10, max: 20 });
        setWeaponDamageType('all');
        setWeaponType('all');
    };

    return (
        <>
            {/* Оверлей для мобильных устройств */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={handleToggle}
                />
            )}

            <aside className={`
                fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900/95 backdrop-blur-md border-r border-slate-700
                transition-all duration-300 z-40 overflow-y-auto
                ${isExpanded ? 'w-80' : 'w-0 lg:w-12'}
            `}>
                {/* Кнопка свернуть/развернуть */}
                <button
                    onClick={handleToggle}
                    className={`
                        absolute top-6 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center 
                        hover:bg-purple-600 transition-all shadow-lg
                        ${isExpanded ? '-right-3' : 'left-3'}
                    `}
                >
                    <span className="text-slate-900 font-bold text-sm">
                        {isExpanded ? '←' : '→'}
                    </span>
                </button>

            {isExpanded && (
                <div className="p-6 space-y-6">
                    {/* Заголовок */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>✨</span>
                            Фильтры предметов
                        </h2>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-purple-500 hover:text-purple-400 transition-colors underline"
                        >
                            Сбросить
                        </button>
                    </div>

                    {/* Поиск по имени */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Поиск по названию
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Введите название..."
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Фильтр по категории */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Категория
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors capitalize"
                        >
                            <option value="all">Все категории</option>
                            {uniqueCategories.map(category => (
                                <option key={category} value={category} className="capitalize">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по редкости */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Редкость
                        </label>
                        <select
                            value={selectedRarity}
                            onChange={(e) => setSelectedRarity(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors capitalize"
                        >
                            <option value="all">Все редкости</option>
                            {uniqueRarities.map(rarity => (
                                <option key={rarity.key} value={rarity.key} className="capitalize">
                                    {rarity.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по настройке */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Требует настройки
                        </label>
                        <select
                            value={requiresAttunement}
                            onChange={(e) => setRequiresAttunement(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="all">Все</option>
                            <option value="yes">Требует</option>
                            <option value="no">Не требует</option>
                        </select>
                    </div>

                    {/* Фильтр по категории брони */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            🛡️ Категория брони
                        </label>
                        <select
                            value={armorCategory}
                            onChange={(e) => setArmorCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors capitalize"
                        >
                            <option value="all">Все категории</option>
                            {uniqueArmorCategories.map(category => (
                                <option key={category} value={category} className="capitalize">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по AC (Armor Class) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            🛡️ AC (Armor Class): {acRange.min} - {acRange.max}
                        </label>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Мин</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="20"
                                    step="1"
                                    value={acRange.min}
                                    onChange={(e) => setAcRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                    className="w-full accent-purple-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Макс</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="20"
                                    step="1"
                                    value={acRange.max}
                                    onChange={(e) => setAcRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                    className="w-full accent-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Фильтр по типу урона оружия */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            ⚔️ Тип урона оружия
                        </label>
                        <select
                            value={weaponDamageType}
                            onChange={(e) => setWeaponDamageType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors capitalize"
                        >
                            <option value="all">Все типы</option>
                            {uniqueWeaponDamageTypes.map(type => (
                                <option key={type} value={type} className="capitalize">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по типу оружия */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            ⚔️ Тип оружия
                        </label>
                        <select
                            value={weaponType}
                            onChange={(e) => setWeaponType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="all">Все</option>
                            <option value="simple">Простое</option>
                            <option value="martial">Воинское</option>
                        </select>
                    </div>

                    {/* Счетчик результатов */}
                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-center text-slate-400 text-sm">
                            Найдено предметов: <span className="text-purple-500 font-bold">{filteredCount}</span>
                        </p>
                    </div>
                </div>
            )}
        </aside>
        </>
    );
}

