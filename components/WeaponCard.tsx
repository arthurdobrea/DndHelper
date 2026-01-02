import {WeaponCardProps} from "@/types";
import Link from "next/link";

export default function WeaponCard({data}: WeaponCardProps) {
    // Создаем slug из key, если slug не существует
    const weaponSlug = data.slug || data.key;

    return (
        <Link
            href={`/weapons/${weaponSlug}`}
            className="block group h-full"
        >
            <div
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                <div
                    className="h-32 bg-gradient-to-br from-red-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <span
                        className="text-5xl transform group-hover:scale-110 transition-transform duration-300">⚔️</span>
                    {/* Декоративная полоска снизу картинки */}
                    <div
                        className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                </div>

                {/* КОНТЕНТ (НИЖНЯЯ ЧАСТЬ) */}
                <div className="p-5">
                    {/* Заголовок и тип оружия */}
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-white leading-tight truncate pr-2" title={data.name}>
                            {data.name}
                        </h2>

                        {/* Бейдж для типа оружия */}
                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Type</span>
                            <span
                                className="text-amber-400 font-mono font-bold text-sm leading-none">
                                {data.is_simple ? 'Simple' : 'Martial'}
                            </span>
                        </div>
                    </div>

                    {/* Описание (Тип урона) */}
                    <p className="text-slate-400 text-sm mb-4 italic capitalize border-b border-slate-700/50 pb-3">
                        {data.damage_type?.name || 'Unknown'} damage
                    </p>

                    {/* СЕТКА ХАРАКТЕРИСТИК */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Блок урона */}
                        <div
                            className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                            <span className="text-xs text-slate-500 font-bold uppercase mb-1">Damage</span>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">🎲</span>
                                <span className="text-white font-mono font-bold">{data.damage_dice}</span>
                            </div>
                        </div>

                        {/* Блок дальности */}
                        <div
                            className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                            <span className="text-xs text-slate-500 font-bold uppercase mb-1">Range</span>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">🎯</span>
                                <span className="text-white font-mono font-bold">
                                    {data.range ? `${data.range}${data.distance_unit || ''}` : data.range_melee}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Свойства оружия */}
                    {data.properties && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Properties</p>
                            {typeof data.properties === 'string' ? (
                                <p className="text-slate-300 text-sm line-clamp-2">{data.properties}</p>
                            ) : Array.isArray(data.properties) ? (
                                <div className="flex flex-wrap gap-1">
                                    {data.properties.map((prop, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded"
                                        >
                                            {prop.property?.name || 'Unknown'}
                                            {prop.detail && ` (${prop.detail})`}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Индикатор дальнобойности */}
                    {data.ranged_attack_possible === 'yes' && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                                🏹 Ranged
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

