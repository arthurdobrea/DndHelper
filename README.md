This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎮 DnD App - Dungeons & Dragons Information Portal

Приложение для просмотра информации о монстрах, оружии, классах, расах и магических предметах D&D 5e через Open5e API.

## ✨ Особенности

- 👹 **Monsters** - база монстров с детальной информацией (индиго/синий дизайн)
- 🗡️ **Weapons** - каталог оружия с характеристиками (красный дизайн)
- 🧙 **Races** - информация о расах персонажей (изумрудно-зеленый дизайн)
- ✨ **Magic Items** - магические предметы с редкостью (фиолетовый дизайн)
- 🎭 **Classes** - информация о классах персонажей
- ⚡ **Кэширование** - автоматическое кэширование данных для быстрой загрузки
- 🎨 **Responsive Design** - адаптивный дизайн для всех устройств
- 🔍 **Cache Debugger** - визуальный отладчик кэша

## 📚 Документация

- 📖 [Кэширование](./CACHE_README.md) - подробное описание системы кэширования
- 📖 [Races & Magic Items](./RACES_AND_MAGICITEMS_README.md) - документация по расам и магическим предметам

## 🚀 Кэширование

Реализован двухуровневый механизм кэширования для оптимизации запросов к API:
- ✅ **In-Memory Cache** (5 минут)
- ✅ **Next.js Revalidation**
- ✅ Консольные логи для отладки
- ✅ Управление кэшем (clearCache, clearCacheFor, getCacheStats)

📖 Подробнее см. [CACHE_README.md](./CACHE_README.md)

## 🎯 Реализованные разделы

| Раздел | Карточки | Детальные страницы | Кэширование | Цветовая схема |
|--------|----------|-------------------|-------------|----------------|
| 👹 Monsters | ✅ | ✅ | ✅ | Индиго/Синий |
| 🗡️ Weapons | ✅ | ✅ | ✅ | Красный |
| 🧙 Races | ✅ | ✅ | ✅ | Изумрудный |
| ✨ Magic Items | ✅ | ✅ | ✅ | Фиолетовый |
| 🎭 Classes | ✅ | ✅ | ❌ | - |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
