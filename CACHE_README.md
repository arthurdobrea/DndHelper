# 🚀 Механизм кэширования для fetchService

## 📋 Описание

Реализован двухуровневый механизм кэширования для оптимизации запросов к API:

1. **In-Memory Cache** - кэширование в памяти приложения
2. **Next.js Cache** - встроенное кэширование Next.js с `revalidate`

## ✨ Возможности

### Автоматическое кэширование
Все запросы к API автоматически кэшируются на **5 минут** (настраивается).

### Избежание повторных запросов
При переходах между страницами данные берутся из кэша, а не загружаются заново.

### Консольные логи
В консоли браузера/терминала видны события кэша:
- `[Cache HIT]` - данные взяты из кэша
- `[Cache MISS]` - данные загружены с API
- `[Cache EXPIRED]` - кэш устарел
- `[Cache SET]` - данные сохранены в кэш

## 🔧 Использование

### Базовое использование (с кэшем)
```typescript
import {fetchService, WEAPON_API} from "@/services/fetchService";
import {Weapon} from "@/types";

const weapons = await fetchService.getData<Weapon>(WEAPON_API);
```

### Отключение кэша для конкретного запроса
```typescript
const weapons = await fetchService.getData<Weapon>(WEAPON_API, false);
```

### Настройка времени жизни кэша
```typescript
// Кэш на 10 минут (600000 мс)
const weapons = await fetchService.getData<Weapon>(WEAPON_API, true, 600000);
```

## 🛠 Дополнительные методы

### Очистка всего кэша
```typescript
fetchService.clearCache();
```

### Очистка кэша для конкретного endpoint
```typescript
fetchService.clearCacheFor(WEAPON_API);
```

### Получение статистики кэша
```typescript
const stats = fetchService.getCacheStats();
console.log(stats);
// {
//   totalCached: 3,
//   entries: [
//     { endpoint: 'v2/weapons/', age: 45, itemsCount: 37 },
//     { endpoint: 'v1/monsters/', age: 120, itemsCount: 100 },
//     ...
//   ]
// }
```

## ⚙️ Настройки

### Изменение времени жизни кэша по умолчанию

В файле `services/fetchService.ts`:

```typescript
// Время жизни кэша в миллисекундах (по умолчанию 5 минут)
const CACHE_TTL = 5 * 60 * 1000;
```

Можно изменить на:
- 1 минута: `1 * 60 * 1000`
- 10 минут: `10 * 60 * 1000`
- 1 час: `60 * 60 * 1000`

### Next.js revalidate

В `fetchService.getData()`:

```typescript
next: { revalidate: 300 } // 5 минут
```

## 📊 Преимущества

✅ **Производительность**: Быстрая загрузка данных при повторных посещениях  
✅ **Экономия трафика**: Меньше запросов к API  
✅ **UX**: Мгновенные переходы между страницами  
✅ **Гибкость**: Настраиваемое время жизни кэша  
✅ **Отладка**: Логирование всех операций кэша  

## 🔄 Жизненный цикл кэша

1. Первый запрос → загрузка с API → сохранение в кэш
2. Повторный запрос (в течение TTL) → возврат из кэша
3. Запрос после истечения TTL → загрузка с API → обновление кэша

## 🎯 Примеры использования

### Monsters
```typescript
// app/monsters/page.tsx
const monsters = await fetchService.getData<Monster>(MONSTER_API);
```

### Weapons
```typescript
// app/weapons/page.tsx
const weapons = await fetchService.getData<Weapon>(WEAPON_API);
```

### Classes
```typescript
// app/classes/page.tsx
const classes = await fetchService.getData<Class>(CLASSES_API);
```

## 🐛 Отладка

Откройте консоль браузера (F12) и наблюдайте за логами:

```
[Cache MISS] Загрузка данных с API: v2/weapons/
[Cache SET] Данные сохранены в кэш: v2/weapons/
...
[Cache HIT] Данные загружены из кэша: v2/weapons/
```

---

**Автор**: Система кэширования для DnD App  
**Дата**: 2026-01-02

