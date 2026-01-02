import {Open5eResponse, Monster} from "@/types";

const API_URL = "https://api.open5e.com";

export const MONSTER_API = 'v1/monsters/'
export const CLASSES_API = 'v1/classes/'
export const RACE_API = 'v1/races/'
export const WEAPON_API = 'v2/weapons/'
export const MAGIC_ITEMS_API = 'v2/magicitems/'

// In-memory кэш для данных
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Время жизни кэша в миллисекундах (5 минут)
const CACHE_TTL = 5 * 60 * 1000;

export const fetchService = {
    /**
     * Получает данные из API с кэшированием
     * @param api - endpoint API
     * @param useCache - использовать ли кэширование (по умолчанию true)
     * @param cacheTTL - время жизни кэша в миллисекундах (по умолчанию 5 минут)
     */
    getData: async <T = Monster>(
        api: string,
        useCache: boolean = true,
        cacheTTL: number = CACHE_TTL
    ): Promise<T[]> => {
        const cacheKey = api;
        const now = Date.now();

        // Проверяем кэш
        if (useCache && cache.has(cacheKey)) {
            const cached = cache.get(cacheKey)!;

            // Если кэш еще валиден, возвращаем данные из кэша
            if (now - cached.timestamp < cacheTTL) {
                console.log(`[Cache HIT] Данные загружены из кэша: ${api}`);
                return cached.data as T[];
            } else {
                // Кэш устарел, удаляем его
                console.log(`[Cache EXPIRED] Кэш устарел для: ${api}`);
                cache.delete(cacheKey);
            }
        }

        // Загружаем данные из API
        console.log(`[Cache MISS] Загрузка данных с API: ${api}`);

        const res = await fetch(`${API_URL}/${api}`, {
            // Next.js кэширование: данные будут кэшироваться на 5 минут
            next: { revalidate: 3000 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data from ${api}: ${res.statusText}`);
        }

        const data: Open5eResponse<T> = await res.json();
        const results = data.results;

        // Сохраняем в кэш
        if (useCache) {
            cache.set(cacheKey, {
                data: results,
                timestamp: now
            });
            console.log(`[Cache SET] Данные сохранены в кэш: ${api}`);
        }

        return results;
    },

    /**
     * Получает данные с полной информацией о пагинации
     * @param apiOrUrl - endpoint API или полный URL для следующей страницы
     * @param useCache - использовать ли кэширование (по умолчанию true)
     * @param cacheTTL - время жизни кэша в миллисекундах (по умолчанию 5 минут)
     */
    getDataWithPagination: async <T = Monster>(
        apiOrUrl: string,
        useCache: boolean = true,
        cacheTTL: number = CACHE_TTL
    ): Promise<Open5eResponse<T>> => {
        const cacheKey = apiOrUrl;
        const now = Date.now();

        // Проверяем кэш
        if (useCache && cache.has(cacheKey)) {
            const cached = cache.get(cacheKey)!;

            // Если кэш еще валиден, возвращаем данные из кэша
            if (now - cached.timestamp < cacheTTL) {
                console.log(`[Cache HIT] Данные загружены из кэша: ${apiOrUrl}`);
                return cached.data as Open5eResponse<T>;
            } else {
                // Кэш устарел, удаляем его
                console.log(`[Cache EXPIRED] Кэш устарел для: ${apiOrUrl}`);
                cache.delete(cacheKey);
            }
        }

        // Загружаем данные из API
        console.log(`[Cache MISS] Загрузка данных с API: ${apiOrUrl}`);

        // Определяем, это полный URL или endpoint
        const url = apiOrUrl.startsWith('http') ? apiOrUrl : `${API_URL}/${apiOrUrl}`;

        const res = await fetch(url, {
            // Next.js кэширование: данные будут кэшироваться на 5 минут
            next: { revalidate: 3000 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data from ${apiOrUrl}: ${res.statusText}`);
        }

        const data: Open5eResponse<T> = await res.json();

        // Сохраняем в кэш полный ответ
        if (useCache) {
            cache.set(cacheKey, {
                data: data,
                timestamp: now
            });
            console.log(`[Cache SET] Данные сохранены в кэш: ${apiOrUrl}`);
        }

        return data;
    },

    /**
     * Очищает весь кэш
     */
    clearCache: () => {
        cache.clear();
        console.log('[Cache] Весь кэш очищен');
    },

    /**
     * Очищает кэш для конкретного endpoint
     */
    clearCacheFor: (api: string) => {
        cache.delete(api);
        console.log(`[Cache] Кэш очищен для: ${api}`);
    },

    /**
     * Получает статистику кэша
     */
    getCacheStats: () => {
        const now = Date.now();
        const stats = Array.from(cache.entries()).map(([key, value]) => ({
            endpoint: key,
            age: Math.round((now - value.timestamp) / 1000), // в секундах
            itemsCount: Array.isArray(value.data) ? value.data.length : 0
        }));

        return {
            totalCached: cache.size,
            entries: stats
        };
    }
}