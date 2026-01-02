'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import MonsterCard from "@/components/MonsterCard";
import AnimatedCard from "@/components/AnimatedCard";
import MonsterFilter from "@/components/MonsterFilter";
import { fetchService, MONSTER_API } from "@/services/fetchService";
import { Monster } from "@/types";

export interface FilterParams {
    searchTerm: string;
    selectedType: string;
    selectedSize: string;
    selectedAlignment: string;
    crRange: { min: number; max: number };
}

export default function Page() {
    const [allMonsters, setAllMonsters] = useState<Monster[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Состояние фильтров
    const [filterParams, setFilterParams] = useState<FilterParams>({
        searchTerm: '',
        selectedType: 'all',
        selectedSize: 'all',
        selectedAlignment: 'all',
        crRange: { min: 0, max: 30 }
    });

    const observerTarget = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Применяем фильтры к списку монстров
    const filteredMonsters = useMemo(() => {
        let filtered = allMonsters;

        // Поиск по имени
        if (filterParams.searchTerm) {
            filtered = filtered.filter(monster =>
                monster.name.toLowerCase().includes(filterParams.searchTerm.toLowerCase())
            );
        }

        // Фильтр по типу
        if (filterParams.selectedType !== 'all') {
            filtered = filtered.filter(monster => monster.type === filterParams.selectedType);
        }

        // Фильтр по размеру
        if (filterParams.selectedSize !== 'all') {
            filtered = filtered.filter(monster => monster.size === filterParams.selectedSize);
        }

        // Фильтр по мировоззрению
        if (filterParams.selectedAlignment !== 'all') {
            filtered = filtered.filter(monster => monster.alignment === filterParams.selectedAlignment);
        }

        // Фильтр по CR
        filtered = filtered.filter(monster => {
            const cr = parseFloat(monster.challenge_rating);
            return cr >= filterParams.crRange.min && cr <= filterParams.crRange.max;
        });

        return filtered;
    }, [allMonsters, filterParams]);

    // Загружаем следующую страницу
    const loadMoreMonsters = useCallback(async () => {
        if (!nextUrl || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setLoadingMore(true);

        try {
            const response = await fetchService.getDataWithPagination<Monster>(nextUrl);

            setAllMonsters(prev => [...prev, ...response.results]);
            setNextUrl(response.next);
            setHasMore(!!response.next);

            console.log(`[Pagination] Загружено ${response.results.length} монстров. Следующая страница: ${response.next}`);
        } catch (error) {
            console.error('Error loading more monsters:', error);
        } finally {
            setLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [nextUrl]);

    // Автоматическая подгрузка при недостаточном количестве отфильтрованных монстров
    useEffect(() => {
        const autoLoadMore = async () => {
            if (filteredMonsters.length < 50 && nextUrl && !isLoadingRef.current && !loading) {
                console.log(`[Auto-load] Отфильтрованных монстров: ${filteredMonsters.length}. Подгружаем еще...`);
                await loadMoreMonsters();
            }
        };

        autoLoadMore();
    }, [filteredMonsters.length, nextUrl, loading, loadMoreMonsters]);

    // Инициализация - загружаем первую страницу
    useEffect(() => {
        const loadMonsters = async () => {
            try {
                const response = await fetchService.getDataWithPagination<Monster>(MONSTER_API);
                setAllMonsters(response.results);
                setNextUrl(response.next);
                setHasMore(!!response.next);
            } catch (error) {
                console.error('Error loading monsters:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMonsters();
    }, []);

    // Intersection Observer для infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    console.log('[Scroll] Достигнут конец списка, загружаем еще...');
                    loadMoreMonsters();
                }
            },
            { threshold: 0.1, rootMargin: '200px' } // Начинаем загрузку за 200px до конца
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
    }, [hasMore, loadingMore, loading, loadMoreMonsters]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Красивый градиентный фон с анимацией */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Фильтр */}
            <MonsterFilter
                monsters={allMonsters}
                onFilter={setFilterParams}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filteredCount={filteredMonsters.length}
            />

            {/* Кнопка фильтра для мобильных */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 rounded-full shadow-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
            >
                <span className="text-2xl">🔍</span>
            </button>

            {/* Контент с отступом слева для фильтра */}
            <section className="lg:ml-80 max-w-7xl mx-auto px-4 py-12 relative z-10 transition-all duration-300">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-amber-500"></div>
                        <p className="text-slate-400 mt-4">Загрузка монстров...</p>
                    </div>
                ) : filteredMonsters.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMonsters.map((monster, index) => (
                                <AnimatedCard key={`${monster.slug}-${index}`} index={index}>
                                    <MonsterCard data={monster} />
                                </AnimatedCard>
                            ))}
                        </div>

                        {/* Observer target для infinite scroll */}
                        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                            {loadingMore && (
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-700 border-t-amber-500"></div>
                                    <span>Загрузка еще монстров...</span>
                                </div>
                            )}
                            {!hasMore && !loadingMore && filteredMonsters.length > 50 && (
                                <p className="text-slate-500 text-sm">Все монстры загружены</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 backdrop-blur-sm">
                        <p className="text-slate-500 text-lg">В этих землях монстров не обнаружено...</p>
                        <p className="text-slate-600 text-sm mt-2">Попробуйте изменить фильтры</p>
                    </div>
                )}
            </section>
        </main>
    );
}

