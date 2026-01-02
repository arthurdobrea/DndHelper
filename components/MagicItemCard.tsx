import {MagicItemCardProps, WeaponPropertyAssignment} from "@/types";
import Link from "next/link";

export default function MagicItemCard({data}: MagicItemCardProps) {
    // Создаем slug из key, если slug не существует
    const itemSlug = data.slug || data.key;

    // Функция для определения цвета редкости
    const getRarityColor = (rank: number) => {
        if (rank <= 1) return 'text-gray-400'; // Common
        if (rank <= 2) return 'text-green-400'; // Uncommon
        if (rank <= 3) return 'text-blue-400'; // Rare
        if (rank <= 4) return 'text-purple-400'; // Very Rare
        return 'text-orange-400'; // Legendary
    };

    const rarityColor = getRarityColor(data.rarity.rank);

    return (
        <Link
            href={`/magic-items/${itemSlug}`}
            className="block group h-full"
        >
            <div
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                <div
                    className="h-32 bg-gradient-to-br from-purple-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <span
                        className="text-5xl transform group-hover:scale-110 transition-transform duration-300">✨</span>
                    {/* Декоративная полоска снизу картинки */}
                    <div
                        className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                </div>

                {/* КОНТЕНТ (НИЖНЯЯ ЧАСТЬ) */}
                <div className="p-5">
                    {/* Заголовок и редкость */}
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-white leading-tight truncate pr-2" title={data.name}>
                            {data.name}
                        </h2>

                        {/* Бейдж для редкости */}
                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rarity</span>
                            <span
                                className={`${rarityColor} font-mono font-bold text-sm leading-none capitalize`}>
                                {data.rarity.name}
                            </span>
                        </div>
                    </div>

                    {/* Описание (Категория) */}
                    <p className="text-slate-400 text-sm mb-4 italic capitalize border-b border-slate-700/50 pb-3">
                        {data.category.name}
                    </p>

                    {/* СЕТКА ХАРАКТЕРИСТИК */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Блок веса */}
                        {data.weight && (
                            <div
                                className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                                <span className="text-xs text-slate-500 font-bold uppercase mb-1">Weight</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400 text-sm">⚖️</span>
                                    <span className="text-white font-mono font-bold text-xs">
                                        {data.weight} {data.weight_unit}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Блок стоимости */}
                        {data.cost && (
                            <div
                                className="bg-slate-900/50 p-2 rounded-lg flex flex-col items-center border border-slate-700/50">
                                <span className="text-xs text-slate-500 font-bold uppercase mb-1">Cost</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400 text-sm">💰</span>
                                    <span className="text-white font-mono font-bold text-xs">{data.cost} gp</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Информация о броне */}
                    {data.armor && (
                        <div className="mb-3 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🛡️</span>
                                <span className="text-indigo-400 font-bold text-xs uppercase">Armor Details</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Type:</span>
                                    <span className="text-white font-semibold capitalize">{data.armor.category}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">AC:</span>
                                    <span className="text-amber-400 font-bold">{data.armor.ac_display}</span>
                                </div>
                                {data.armor.grants_stealth_disadvantage && (
                                    <div className="text-xs text-red-400 mt-1">
                                        ⚠️ Stealth Disadvantage
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Информация об оружии */}
                    {data.weapon && (
                        <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">⚔️</span>
                                <span className="text-red-400 font-bold text-xs uppercase">Weapon Details</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Type:</span>
                                    <span className="text-white font-semibold">
                                        {data.weapon.is_simple ? 'Simple' : data.weapon.is_martial ? 'Martial' : 'Other'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Damage:</span>
                                    <span className="text-amber-400 font-bold">
                                        {data.weapon.damage_dice} {data.weapon.damage_type?.name}
                                    </span>
                                </div>
                                {Array.isArray(data.weapon.properties) && data.weapon.properties.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-red-500/20">
                                        <div className="text-xs text-slate-400 mb-1">Properties:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {data.weapon.properties.slice(0, 3).map((prop: WeaponPropertyAssignment, idx: number) => (
                                                <span key={idx}
                                                    className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30"
                                                    title={prop.property?.desc}>
                                                    {prop.property?.name}
                                                    {prop.detail && ` (${prop.detail})`}
                                                </span>
                                            ))}
                                            {data.weapon.properties.length > 3 && (
                                                <span className="text-[10px] text-slate-500">
                                                    +{data.weapon.properties.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Описание предмета (краткое) */}
                    {data.desc && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <p className="text-slate-300 text-sm line-clamp-2">{data.desc}</p>
                        </div>
                    )}

                    {/* Индикатор настройки */}
                    {data.requires_attunement && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">
                                🔮 Requires Attunement
                                {data.attunement_detail && ` (${data.attunement_detail})`}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

