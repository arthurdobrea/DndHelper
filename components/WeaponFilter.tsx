'use client';

import { useState, useMemo, useEffect } from 'react';
import { Weapon } from '@/types';

export interface WeaponFilterParams {
    searchTerm: string;
    selectedDamageType: string;
    selectedWeaponType: string;
    rangeType: string;
}

interface WeaponFilterProps {
    weapons: Weapon[];
    onFilter: (params: WeaponFilterParams) => void;
    isOpen?: boolean;
    onToggle?: () => void;
    filteredCount: number;
}

export default function WeaponFilter({ weapons, onFilter, isOpen: externalIsOpen, onToggle, filteredCount }: WeaponFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDamageType, setSelectedDamageType] = useState<string>('all');
    const [selectedWeaponType, setSelectedWeaponType] = useState<string>('all');
    const [rangeType, setRangeType] = useState<string>('all');
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
    const uniqueDamageTypes = useMemo(() => {
        const types = new Set(weapons.map(w => w.damage_type?.name).filter(Boolean));
        return Array.from(types).sort();
    }, [weapons]);

    // Создаем объект параметров фильтрации
    const filterParams = useMemo<WeaponFilterParams>(() => ({
        searchTerm,
        selectedDamageType,
        selectedWeaponType,
        rangeType
    }), [searchTerm, selectedDamageType, selectedWeaponType, rangeType]);

    // Передаем параметры фильтрации родителю при их изменении
    useEffect(() => {
        onFilter(filterParams);
    }, [filterParams, onFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedDamageType('all');
        setSelectedWeaponType('all');
        setRangeType('all');
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
                        absolute top-6 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center 
                        hover:bg-red-600 transition-all shadow-lg
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
                            <span>⚔️</span>
                            Фильтры оружия
                        </h2>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-red-500 hover:text-red-400 transition-colors underline"
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
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    {/* Фильтр по типу урона */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Тип урона
                        </label>
                        <select
                            value={selectedDamageType}
                            onChange={(e) => setSelectedDamageType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors capitalize"
                        >
                            <option value="all">Все типы</option>
                            {uniqueDamageTypes.map(type => (
                                <option key={type} value={type} className="capitalize">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по типу оружия */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Тип оружия
                        </label>
                        <select
                            value={selectedWeaponType}
                            onChange={(e) => setSelectedWeaponType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="all">Все</option>
                            <option value="simple">Простое</option>
                            <option value="martial">Воинское</option>
                        </select>
                    </div>

                    {/* Фильтр по дальности */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Дальность
                        </label>
                        <select
                            value={rangeType}
                            onChange={(e) => setRangeType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="all">Все</option>
                            <option value="melee">Ближний бой</option>
                            <option value="ranged">Дальний бой</option>
                        </select>
                    </div>

                    {/* Счетчик результатов */}
                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-center text-slate-400 text-sm">
                            Найдено оружия: <span className="text-red-500 font-bold">{filteredCount}</span>
                        </p>
                    </div>
                </div>
            )}
        </aside>
        </>
    );
}

