'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import WeaponCard from "@/components/WeaponCard";
import AnimatedCard from "@/components/AnimatedCard";
import WeaponFilter, { WeaponFilterParams } from "@/components/WeaponFilter";
import { fetchService, WEAPON_API } from "@/services/fetchService";
import { Weapon } from "@/types";

export default function Page() {
    const [allWeapons, setAllWeapons] = useState<Weapon[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Состояние фильтров
    const [filterParams, setFilterParams] = useState<WeaponFilterParams>({
        searchTerm: '',
        selectedDamageType: 'all',
        selectedWeaponType: 'all',
        rangeType: 'all'
    });

    const observerTarget = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Применяем фильтры к списку оружия
    const filteredWeapons = useMemo(() => {
        let filtered = allWeapons;

        // Поиск по имени
        if (filterParams.searchTerm) {
            filtered = filtered.filter(weapon =>
                weapon.name.toLowerCase().includes(filterParams.searchTerm.toLowerCase())
            );
        }

        // Фильтр по типу урона
        if (filterParams.selectedDamageType !== 'all') {
            filtered = filtered.filter(weapon =>
                weapon.damage_type?.name === filterParams.selectedDamageType
            );
        }

        // Фильтр по типу оружия (простое/воинское)
        if (filterParams.selectedWeaponType !== 'all') {
            if (filterParams.selectedWeaponType === 'simple') {
                filtered = filtered.filter(weapon => weapon.is_simple);
            } else if (filterParams.selectedWeaponType === 'martial') {
                filtered = filtered.filter(weapon => !weapon.is_simple);
            }
        }

        // Фильтр по дальности
        if (filterParams.rangeType !== 'all') {
            if (filterParams.rangeType === 'melee') {
                filtered = filtered.filter(weapon => !weapon.range || weapon.range === 0);
            } else if (filterParams.rangeType === 'ranged') {
                filtered = filtered.filter(weapon => weapon.range && weapon.range > 0);
            }
        }

        return filtered;
    }, [allWeapons, filterParams]);

    // Загружаем следующую страницу
    const loadMoreWeapons = useCallback(async () => {
        if (!nextUrl || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setLoadingMore(true);

        try {
            const response = await fetchService.getDataWithPagination<Weapon>(nextUrl);

            setAllWeapons(prev => [...prev, ...response.results]);
            setNextUrl(response.next);
            setHasMore(!!response.next);

            console.log(`[Pagination] Загружено ${response.results.length} оружия. Следующая страница: ${response.next}`);
        } catch (error) {
            console.error('Error loading more weapons:', error);
        } finally {
            setLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [nextUrl]);

    // Автоматическая подгрузка при недостаточном количестве отфильтрованного оружия
    useEffect(() => {
        const autoLoadMore = async () => {
            if (filteredWeapons.length < 50 && nextUrl && !isLoadingRef.current && !loading) {
                console.log(`[Auto-load] Отфильтрованного оружия: ${filteredWeapons.length}. Подгружаем еще...`);
                await loadMoreWeapons();
            }
        };

        autoLoadMore();
    }, [filteredWeapons.length, nextUrl, loading, loadMoreWeapons]);

    // Инициализация - загружаем первую страницу
    useEffect(() => {
        const loadWeapons = async () => {
            try {
                const response = await fetchService.getDataWithPagination<Weapon>(WEAPON_API);
                setAllWeapons(response.results);
                setNextUrl(response.next);
                setHasMore(!!response.next);
            } catch (error) {
                console.error('Error loading weapons:', error);
            } finally {
                setLoading(false);
            }
        };

        loadWeapons();
    }, []);

    // Intersection Observer для infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    console.log('[Scroll] Достигнут конец списка, загружаем еще...');
                    loadMoreWeapons();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadingMore, loading, loadMoreWeapons]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Красивый градиентный фон с анимацией */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-red-950 to-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Фильтр */}
            <WeaponFilter
                weapons={allWeapons}
                onFilter={setFilterParams}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filteredCount={filteredWeapons.length}
            />

            {/* Кнопка фильтра для мобильных */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
            >
                <span className="text-2xl">🔍</span>
            </button>

            {/* Контент с отступом слева для фильтра */}
            <section className="lg:ml-80 max-w-7xl mx-auto px-4 py-12 relative z-10 transition-all duration-300">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-red-500"></div>
                        <p className="text-slate-400 mt-4">Загрузка оружия...</p>
                    </div>
                ) : filteredWeapons.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredWeapons.map((weapon, index) => (
                                <AnimatedCard key={`${weapon.key}-${index}`} index={index}>
                                    <WeaponCard data={weapon} />
                                </AnimatedCard>
                            ))}
                        </div>

                        {/* Observer target для infinite scroll */}
                        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                            {loadingMore && (
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-700 border-t-red-500"></div>
                                    <span>Загрузка еще оружия...</span>
                                </div>
                            )}
                            {!hasMore && !loadingMore && filteredWeapons.length > 50 && (
                                <p className="text-slate-500 text-sm">Все оружие загружено</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 backdrop-blur-sm">
                        <p className="text-slate-500 text-lg">Оружие не найдено...</p>
                        <p className="text-slate-600 text-sm mt-2">Попробуйте изменить фильтры</p>
                    </div>
                )}
            </section>
        </main>
    );
}

