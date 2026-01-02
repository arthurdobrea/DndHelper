'use client';

import { useState } from 'react';

/**
 * Компонент для отображения статуса кэша
 * Добавьте этот компонент на любую страницу для отладки кэша
 */
export default function CacheDebugger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Кнопка для открытия/закрытия панели */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
                title="Отладчик кэша"
            >
                <span>🔍</span>
                <span className="text-sm font-bold">Cache</span>
            </button>

            {/* Панель отладки */}
            {isOpen && (
                <div className="absolute bottom-14 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white font-bold">Отладчик кэша</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="bg-slate-700/50 p-2 rounded">
                            <p className="text-slate-300">
                                💡 <strong>Совет:</strong> Откройте консоль браузера (F12) для просмотра логов кэша
                            </p>
                        </div>

                        <div className="bg-slate-700/50 p-2 rounded">
                            <p className="text-green-400 font-bold mb-1">[Cache HIT]</p>
                            <p className="text-slate-300 text-xs">Данные загружены из кэша</p>
                        </div>

                        <div className="bg-slate-700/50 p-2 rounded">
                            <p className="text-yellow-400 font-bold mb-1">[Cache MISS]</p>
                            <p className="text-slate-300 text-xs">Данные загружены с API</p>
                        </div>

                        <div className="bg-slate-700/50 p-2 rounded">
                            <p className="text-orange-400 font-bold mb-1">[Cache EXPIRED]</p>
                            <p className="text-slate-300 text-xs">Кэш устарел (TTL: 5 мин)</p>
                        </div>

                        <div className="bg-slate-700/50 p-2 rounded">
                            <p className="text-blue-400 font-bold mb-1">[Cache SET]</p>
                            <p className="text-slate-300 text-xs">Данные сохранены в кэш</p>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-400 text-center">
                            📖 См. CACHE_README.md для подробностей
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

