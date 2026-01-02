'use client';

import { useState, useMemo, useEffect } from 'react';
import { Monster } from '@/types';

export interface FilterParams {
    searchTerm: string;
    selectedType: string;
    selectedSize: string;
    selectedAlignment: string;
    crRange: { min: number; max: number };
}

interface MonsterFilterProps {
    monsters: Monster[];
    onFilter: (params: FilterParams) => void;
    isOpen?: boolean;
    onToggle?: () => void;
    filteredCount: number;
}

export default function MonsterFilter({ monsters, onFilter, isOpen: externalIsOpen, onToggle, filteredCount }: MonsterFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedSize, setSelectedSize] = useState<string>('all');
    const [selectedAlignment, setSelectedAlignment] = useState<string>('all');
    const [crRange, setCrRange] = useState<{ min: number; max: number }>({ min: 0, max: 30 });
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
    const uniqueTypes = useMemo(() => {
        const types = new Set(monsters.map(m => m.type));
        return Array.from(types).sort();
    }, [monsters]);

    const uniqueSizes = useMemo(() => {
        const sizes = new Set(monsters.map(m => m.size));
        return Array.from(sizes).sort();
    }, [monsters]);

    const uniqueAlignments = useMemo(() => {
        const alignments = new Set(monsters.map(m => m.alignment));
        return Array.from(alignments).sort();
    }, [monsters]);

    // Создаем объект параметров фильтрации
    const filterParams = useMemo<FilterParams>(() => ({
        searchTerm,
        selectedType,
        selectedSize,
        selectedAlignment,
        crRange
    }), [searchTerm, selectedType, selectedSize, selectedAlignment, crRange]);

    // Передаем параметры фильтрации родителю при их изменении
    useEffect(() => {
        onFilter(filterParams);
    }, [filterParams, onFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedType('all');
        setSelectedSize('all');
        setSelectedAlignment('all');
        setCrRange({ min: 0, max: 30 });
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
                        absolute top-6 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center 
                        hover:bg-amber-600 transition-all shadow-lg
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
                            <span>🔍</span>
                            Фильтры
                        </h2>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-amber-500 hover:text-amber-400 transition-colors underline"
                        >
                            Сбросить
                        </button>
                    </div>

                    {/* Поиск по имени */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Поиск по имени
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Введите имя..."
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>

                    {/* Фильтр по типу */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Тип существа
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors capitalize"
                        >
                            <option value="all">Все типы</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type} className="capitalize">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по размеру */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Размер
                        </label>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors capitalize"
                        >
                            <option value="all">Все размеры</option>
                            {uniqueSizes.map(size => (
                                <option key={size} value={size} className="capitalize">
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по мировоззрению */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Мировоззрение
                        </label>
                        <select
                            value={selectedAlignment}
                            onChange={(e) => setSelectedAlignment(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors capitalize"
                        >
                            <option value="all">Все мировоззрения</option>
                            {uniqueAlignments.map(alignment => (
                                <option key={alignment} value={alignment} className="capitalize">
                                    {alignment}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Фильтр по CR */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            CR: {crRange.min} - {crRange.max}
                        </label>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Мин</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="0.5"
                                    value={crRange.min}
                                    onChange={(e) => setCrRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                                    className="w-full accent-amber-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Макс</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="0.5"
                                    value={crRange.max}
                                    onChange={(e) => setCrRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                                    className="w-full accent-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Счетчик результатов */}
                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-center text-slate-400 text-sm">
                            Найдено монстров: <span className="text-amber-500 font-bold">{filteredCount}</span>
                        </p>
                    </div>
                </div>
            )}
        </aside>
        </>
    );
}

