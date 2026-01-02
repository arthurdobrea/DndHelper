import {Weapon} from "@/types";
import {fetchService, WEAPON_API} from "@/services/fetchService";

interface WeaponDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function WeaponDetailPage({ params }: WeaponDetailPageProps) {
    const { slug } = await params;
    const weapons = await fetchService.getData<Weapon>(WEAPON_API);
    const data = weapons.find((w) => (w.slug === slug || w.key === slug));

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Weapon Not Found</h1>
                    <p className="text-slate-400">The weapon &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div
                    className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-amber-500 transition-all duration-300">

                    {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                    <div
                        className="h-64 bg-gradient-to-br from-red-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                        <span className="text-9xl">⚔️</span>
                        <div
                            className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                    </div>

                    {/* КОНТЕНТ */}
                    <div className="p-8">
                        {/* Заголовок и тип */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                                <p className="text-slate-400 text-lg italic capitalize">
                                    {data.is_simple ? 'Simple' : 'Martial'} Weapon
                                </p>
                            </div>

                            {/* Бейдж для типа урона */}
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-slate-400 uppercase font-bold tracking-wider">Damage Type</span>
                                <span className="text-amber-400 font-bold text-2xl">
                                    {data.damage_type?.name || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {/* ОСНОВНЫЕ ХАРАКТЕРИСТИКИ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Урон */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">🎲</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Damage</span>
                                </div>
                                <p className="text-3xl font-mono font-bold text-white">{data.damage_dice}</p>
                            </div>

                            {/* Дальность */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">🎯</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Range</span>
                                </div>
                                <p className="text-3xl font-mono font-bold text-white">
                                    {data.range ? `${data.range}${data.distance_unit || ''}` : data.range_melee}
                                </p>
                                {data.long_range && (
                                    <p className="text-sm text-slate-400 mt-1">
                                        Long: {data.long_range}{data.distance_unit || ''}
                                    </p>
                                )}
                            </div>

                            {/* Тип атаки */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{data.ranged_attack_possible === 'yes' ? '🏹' : '⚔️'}</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Attack Type</span>
                                </div>
                                <p className="text-lg font-bold text-white capitalize">{data.range_melee}</p>
                                {data.ranged_attack_possible === 'yes' && (
                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30 inline-block mt-2">
                                        Ranged Capable
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* СВОЙСТВА ОРУЖИЯ */}
                        {data.properties && (
                            <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 mb-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <span>⚙️</span>
                                    Weapon Properties
                                </h2>
                                {typeof data.properties === 'string' ? (
                                    <p className="text-slate-300 leading-relaxed">{data.properties}</p>
                                ) : Array.isArray(data.properties) ? (
                                    <div className="flex flex-wrap gap-2">
                                        {data.properties.map((prop, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-3"
                                            >
                                                <p className="text-white font-bold">{prop.property?.name || 'Unknown'}</p>
                                                {prop.detail && (
                                                    <p className="text-slate-400 text-sm mt-1">{prop.detail}</p>
                                                )}
                                                {prop.property?.desc && (
                                                    <p className="text-slate-300 text-sm mt-2">{prop.property.desc}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Key</p>
                                <p className="text-slate-300 font-mono">{data.key}</p>
                            </div>

                            {data.is_improvised && (
                                <div className="bg-slate-900/30 p-4 rounded-lg border border-amber-700/50">
                                    <p className="text-xs text-amber-500 font-bold uppercase mb-1">Special</p>
                                    <p className="text-amber-300">Improvised Weapon</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

