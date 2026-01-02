'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import MagicItemCard from "@/components/MagicItemCard";
import AnimatedCard from "@/components/AnimatedCard";
import MagicItemFilter, { MagicItemFilterParams } from "@/components/MagicItemFilter";
import { fetchService, MAGIC_ITEMS_API } from "@/services/fetchService";
import { MagicItem } from "@/types";

export default function Page() {
    const [allItems, setAllItems] = useState<MagicItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Состояние фильтров
    const [filterParams, setFilterParams] = useState<MagicItemFilterParams>({
        searchTerm: '',
        selectedCategory: 'all',
        selectedRarity: 'all',
        requiresAttunement: 'all',
        armorCategory: 'all',
        acRange: { min: 10, max: 20 },
        weaponDamageType: 'all',
        weaponType: 'all'
    });

    const observerTarget = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Применяем фильтры к списку предметов
    const filteredItems = useMemo(() => {
        let filtered = allItems;

        // Поиск по имени
        if (filterParams.searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(filterParams.searchTerm.toLowerCase())
            );
        }

        // Фильтр по категории
        if (filterParams.selectedCategory !== 'all') {
            filtered = filtered.filter(item =>
                item.category?.name === filterParams.selectedCategory
            );
        }

        // Фильтр по редкости
        if (filterParams.selectedRarity !== 'all') {
            filtered = filtered.filter(item =>
                item.rarity?.key === filterParams.selectedRarity
            );
        }

        // Фильтр по настройке
        if (filterParams.requiresAttunement !== 'all') {
            if (filterParams.requiresAttunement === 'yes') {
                filtered = filtered.filter(item => item.requires_attunement);
            } else if (filterParams.requiresAttunement === 'no') {
                filtered = filtered.filter(item => !item.requires_attunement);
            }
        }

        // Фильтр по категории брони
        if (filterParams.armorCategory !== 'all') {
            filtered = filtered.filter(item =>
                item.armor?.category === filterParams.armorCategory
            );
        }

        // Фильтр по AC (Armor Class)
        filtered = filtered.filter(item => {
            if (!item.armor) return true; // Если нет брони, пропускаем фильтр
            const ac = item.armor.ac_base;
            return ac >= filterParams.acRange.min && ac <= filterParams.acRange.max;
        });

        // Фильтр по типу урона оружия
        if (filterParams.weaponDamageType !== 'all') {
            filtered = filtered.filter(item =>
                item.weapon?.damage_type?.name === filterParams.weaponDamageType
            );
        }

        // Фильтр по типу оружия (простое/воинское)
        if (filterParams.weaponType !== 'all') {
            if (filterParams.weaponType === 'simple') {
                filtered = filtered.filter(item => item.weapon?.is_simple);
            } else if (filterParams.weaponType === 'martial') {
                filtered = filtered.filter(item => item.weapon?.is_martial);
            }
        }

        return filtered;
    }, [allItems, filterParams]);

    // Загружаем следующую страницу
    const loadMoreItems = useCallback(async () => {
        if (!nextUrl || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setLoadingMore(true);

        try {
            const response = await fetchService.getDataWithPagination<MagicItem>(nextUrl);

            setAllItems(prev => [...prev, ...response.results]);
            setNextUrl(response.next);
            setHasMore(!!response.next);

            console.log(`[Pagination] Загружено ${response.results.length} предметов. Следующая страница: ${response.next}`);
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            setLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [nextUrl]);

    // Автоматическая подгрузка при недостаточном количестве отфильтрованных предметов
    useEffect(() => {
        const autoLoadMore = async () => {
            if (filteredItems.length < 50 && nextUrl && !isLoadingRef.current && !loading) {
                console.log(`[Auto-load] Отфильтрованных предметов: ${filteredItems.length}. Подгружаем еще...`);
                await loadMoreItems();
            }
        };

        autoLoadMore();
    }, [filteredItems.length, nextUrl, loading, loadMoreItems]);

    // Инициализация - загружаем первую страницу
    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await fetchService.getDataWithPagination<MagicItem>(MAGIC_ITEMS_API);
                setAllItems(response.results);
                setNextUrl(response.next);
                setHasMore(!!response.next);
            } catch (error) {
                console.error('Error loading magic items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    // Intersection Observer для infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    console.log('[Scroll] Достигнут конец списка, загружаем еще...');
                    loadMoreItems();
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
    }, [hasMore, loadingMore, loading, loadMoreItems]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Красивый градиентный фон с анимацией */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Фильтр */}
            <MagicItemFilter
                items={allItems}
                onFilter={setFilterParams}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filteredCount={filteredItems.length}
            />

            {/* Кнопка фильтра для мобильных */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-500 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
            >
                <span className="text-2xl">🔍</span>
            </button>

            {/* Контент с отступом слева для фильтра */}
            <section className="lg:ml-80 max-w-7xl mx-auto px-4 py-12 relative z-10 transition-all duration-300">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-purple-500"></div>
                        <p className="text-slate-400 mt-4">Загрузка магических предметов...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((item, index) => (
                                <AnimatedCard key={`${item.key}-${index}`} index={index}>
                                    <MagicItemCard data={item} />
                                </AnimatedCard>
                            ))}
                        </div>

                        {/* Observer target для infinite scroll */}
                        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                            {loadingMore && (
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-700 border-t-purple-500"></div>
                                    <span>Загрузка еще предметов...</span>
                                </div>
                            )}
                            {!hasMore && !loadingMore && filteredItems.length > 50 && (
                                <p className="text-slate-500 text-sm">Все предметы загружены</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 backdrop-blur-sm">
                        <p className="text-slate-500 text-lg">Магические предметы не найдены...</p>
                        <p className="text-slate-600 text-sm mt-2">Попробуйте изменить фильтры</p>
                    </div>
                )}
            </section>
        </main>
    );
}

