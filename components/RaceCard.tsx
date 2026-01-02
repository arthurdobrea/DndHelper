import {RaceCardProps} from "@/types";
import Link from "next/link";

export default function RaceCard({data}: RaceCardProps) {
    // Создаем slug из имени, если slug не существует
    const raceSlug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <Link
            href={`/races/${raceSlug}`}
            className="block group h-full"
        >
            <div
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-emerald-500 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                <div
                    className="h-32 bg-gradient-to-br from-emerald-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <span
                        className="text-5xl transform group-hover:scale-110 transition-transform duration-300">🧙</span>
                    {/* Декоративная полоска снизу картинки */}
                    <div
                        className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                </div>

                {/* КОНТЕНТ (НИЖНЯЯ ЧАСТЬ) */}
                <div className="p-5">
                    {/* Заголовок и размер */}
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-white leading-tight truncate pr-2" title={data.name}>
                            {data.name}
                        </h2>

                        {/* Бейдж для размера */}
                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Size</span>
                            <span
                                className="text-emerald-400 font-mono font-bold text-sm leading-none capitalize">
                                {data.size}
                            </span>
                        </div>
                    </div>

                    {/* Описание (Vision) */}
                    <p className="text-slate-400 text-sm mb-4 italic border-b border-slate-700/50 pb-3">
                        {data.vision || 'Normal Vision'}
                    </p>

                    {/* СЕТКА ХАРАКТЕРИСТИК */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Блок скорости */}
                        <div
                            className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                            <span className="text-xs text-slate-500 font-bold uppercase mb-1">Speed</span>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">🏃</span>
                                <span className="text-white font-mono font-bold">{data.speed.walk} ft</span>
                            </div>
                        </div>

                        {/* Блок языков */}
                        <div
                            className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                            <span className="text-xs text-slate-500 font-bold uppercase mb-1">Languages</span>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">💬</span>
                                <span className="text-white font-mono font-bold text-xs truncate max-w-[80px]" title={data.languages}>
                                    {data.languages.split(',')[0]}
                                    {data.languages.includes(',') && '...'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ASI информация */}
                    {data.asi && data.asi.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ability Score Increase</p>
                            <div className="flex flex-wrap gap-1">
                                {data.asi.map((increase, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-emerald-700/50 text-emerald-300 px-2 py-1 rounded"
                                    >
                                        {increase.attributes.join(', ')} +{increase.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Индикатор подрас */}
                    {data.subraces && data.subraces.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
                                👥 {data.subraces.length} Subrace{data.subraces.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

