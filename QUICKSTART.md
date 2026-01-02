# 🚀 Быстрый старт - DnD App

## Структура проекта

```
dnd-app/
├── app/
│   ├── monsters/          👹 Монстры (индиго)
│   │   ├── page.tsx       - список
│   │   └── [slug]/page.tsx - детали
│   ├── weapons/           ⚔️ Оружие (красный)
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── races/             🧙 Расы (изумрудный) ✨ NEW
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── magic-items/       ✨ Магические предметы (фиолетовый) ✨ NEW
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── classes/           🎭 Классы
│       ├── page.tsx
│       └── [slug]/page.tsx
│
├── components/
│   ├── MonsterCard.tsx    - карточка монстра
│   ├── WeaponCard.tsx     - карточка оружия
│   ├── RaceCard.tsx       - карточка расы ✨ NEW
│   ├── MagicItemCard.tsx  - карточка магического предмета ✨ NEW
│   ├── ClassCard.tsx      - карточка класса
│   ├── NavigationBar.tsx  - навигация
│   └── CacheDebugger.tsx  - отладчик кэша ✨ NEW
│
├── services/
│   └── fetchService.ts    - API с кэшированием ✨ UPDATED
│
├── types/
│   └── index.ts           - TypeScript интерфейсы ✨ UPDATED
│
└── Документация/
    ├── README.md                          - основная документация
    ├── CACHE_README.md                    - кэширование ✨ NEW
    └── RACES_AND_MAGICITEMS_README.md     - расы и магические предметы ✨ NEW
```

## 🎯 API Endpoints

```typescript
MONSTER_API      = 'v1/monsters/'
CLASSES_API      = 'v1/classes/'
RACE_API         = 'v1/races/'        ✨ ИСПОЛЬЗУЕТСЯ
WEAPON_API       = 'v2/weapons/'
MAGIC_ITEMS_API  = 'v2/magicitems/'   ✨ ИСПОЛЬЗУЕТСЯ
```

## ⚡ Кэширование

Все API запросы автоматически кэшируются на **5 минут**.

### Использование:
```typescript
// С кэшем (по умолчанию)
const data = await fetchService.getData<Type>(API_ENDPOINT);

// Без кэша
const data = await fetchService.getData<Type>(API_ENDPOINT, false);

// Кастомный TTL (10 минут)
const data = await fetchService.getData<Type>(API_ENDPOINT, true, 600000);
```

### Управление кэшем:
```typescript
// Очистить весь кэш
fetchService.clearCache();

// Очистить кэш для конкретного API
fetchService.clearCacheFor(RACE_API);

// Получить статистику
const stats = fetchService.getCacheStats();
```

## 🎨 Цветовая схема

| Раздел | Цвет | Градиент | Hover |
|--------|------|----------|-------|
| Monsters | Индиго | from-indigo-900 | border-amber-500 |
| Weapons | Красный | from-red-900 | border-amber-500 |
| Races | Изумрудный | from-emerald-900 | border-emerald-500 |
| Magic Items | Фиолетовый | from-purple-900 | border-purple-500 |
| Classes | - | - | - |

## 📝 Как добавить новый раздел

### 1. Создать интерфейс в `types/index.ts`:
```typescript
export interface NewEntity {
    name: string;
    slug: string;
    // ... другие поля
}

export interface NewEntityCardProps {
    data: NewEntity;
}
```

### 2. Добавить константу API в `services/fetchService.ts`:
```typescript
export const NEW_ENTITY_API = 'v1/newentities/'
```

### 3. Создать компонент карточки `components/NewEntityCard.tsx`:
```typescript
import {NewEntityCardProps} from "@/types";
import Link from "next/link";

export default function NewEntityCard({data}: NewEntityCardProps) {
    return (
        <Link href={`/new-entities/${data.slug}`} className="block group h-full">
            <div className="bg-slate-800 rounded-xl...">
                {/* Ваш дизайн */}
            </div>
        </Link>
    );
}
```

### 4. Создать страницу списка `app/new-entities/page.tsx`:
```typescript
import {fetchService, NEW_ENTITY_API} from "@/services/fetchService";
import NewEntityCard from "@/components/NewEntityCard";
import {NewEntity} from "@/types";

export default async function Page() {
    const entities = await fetchService.getData<NewEntity>(NEW_ENTITY_API);
    return (
        <main>
            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {entities.map((entity) => (
                        <NewEntityCard key={entity.slug} data={entity} />
                    ))}
                </div>
            </section>
        </main>
    );
}
```

### 5. Создать детальную страницу `app/new-entities/[slug]/page.tsx`:
```typescript
import {NewEntity} from "@/types";
import {fetchService, NEW_ENTITY_API} from "@/services/fetchService";

interface DetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
    const { slug } = await params;
    const entities = await fetchService.getData<NewEntity>(NEW_ENTITY_API);
    const data = entities.find((e) => e.slug === slug);

    if (!data) {
        return <div>Not Found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
            {/* Ваш контент */}
        </div>
    );
}
```

## 🔍 Отладка

### Console Logs:
```
[Cache MISS] Загрузка данных с API: v1/races/
[Cache SET] Данные сохранены в кэш: v1/races/
[Cache HIT] Данные загружены из кэша: v1/races/
[Cache EXPIRED] Кэш устарел для: v1/races/
```

### Cache Debugger:
Кнопка **🔍 Cache** в правом нижнем углу страницы.

## 📦 Установка зависимостей

```bash
npm install
```

## 🚀 Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 🛠 Полезные команды

```bash
# Сборка проекта
npm run build

# Запуск production сборки
npm start

# Проверка линтера
npm run lint
```

---

**Готово к использованию!** 🎉

