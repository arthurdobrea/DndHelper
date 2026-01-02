import {Race} from "@/types";
import {fetchService, RACE_API} from "@/services/fetchService";

interface RaceDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
    const { slug } = await params;
    const races = await fetchService.getData<Race>(RACE_API);
    const data = races.find((r) => r.slug === slug);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Race Not Found</h1>
                    <p className="text-slate-400">The race &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div
                    className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-emerald-500 transition-all duration-300">

                    {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                    <div
                        className="h-64 bg-gradient-to-br from-emerald-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                        <span className="text-9xl">🧙</span>
                        <div
                            className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                    </div>

                    {/* КОНТЕНТ */}
                    <div className="p-8">
                        {/* Заголовок и размер */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                                <p className="text-slate-400 text-lg italic capitalize">
                                    {data.size} Size
                                </p>
                            </div>

                            {/* Бейдж для скорости */}
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-slate-400 uppercase font-bold tracking-wider">Speed</span>
                                <span className="text-emerald-400 font-bold text-2xl">
                                    {data.speed.walk} ft
                                </span>
                            </div>
                        </div>

                        {/* ОСНОВНОЕ ОПИСАНИЕ */}
                        <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 mb-6">
                            <div dangerouslySetInnerHTML={{ __html: data.desc }} className="text-slate-300 leading-relaxed prose prose-invert max-w-none"/>
                        </div>

                        {/* ОСНОВНЫЕ ХАРАКТЕРИСТИКИ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Скорость */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">🏃</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Movement</span>
                                </div>
                                <p className="text-slate-300">{data.speed_desc}</p>
                            </div>

                            {/* Зрение */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">👁️</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Vision</span>
                                </div>
                                <p className="text-slate-300">{data.vision}</p>
                            </div>

                            {/* Языки */}
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">💬</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Languages</span>
                                </div>
                                <p className="text-slate-300">{data.languages}</p>
                            </div>
                        </div>

                        {/* ABILITY SCORE INCREASE */}
                        {data.asi && data.asi.length > 0 && (
                            <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 mb-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <span>📊</span>
                                    Ability Score Increase
                                </h2>
                                {data.asi_desc && (
                                    <p className="text-slate-300 mb-3">{data.asi_desc}</p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    {data.asi.map((increase, index) => (
                                        <div
                                            key={index}
                                            className="bg-emerald-800/50 border border-emerald-600/50 rounded-lg p-3"
                                        >
                                            <p className="text-emerald-300 font-bold">
                                                {increase.attributes.join(', ')} +{increase.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AGE, ALIGNMENT, SIZE */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Age</p>
                                <p className="text-slate-300">{data.age}</p>
                            </div>

                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Alignment</p>
                                <p className="text-slate-300">{data.alignment}</p>
                            </div>

                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Size</p>
                                <p className="text-slate-300">{data.size_raw}</p>
                            </div>
                        </div>

                        {/* TRAITS */}
                        {data.traits && (
                            <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 mb-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <span>✨</span>
                                    Racial Traits
                                </h2>
                                <div dangerouslySetInnerHTML={{ __html: data.traits }} className="text-slate-300 leading-relaxed prose prose-invert max-w-none"/>
                            </div>
                        )}

                        {/* SUBRACES */}
                        {data.subraces && data.subraces.length > 0 && (
                            <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span>👥</span>
                                    Subraces ({data.subraces.length})
                                </h2>
                                <div className="space-y-4">
                                    {data.subraces.map((subrace, index) => (
                                        <div
                                            key={index}
                                            className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-2">{subrace.name}</h3>
                                            <div dangerouslySetInnerHTML={{ __html: subrace.desc }} className="text-slate-300 text-sm mb-2 prose prose-invert prose-sm max-w-none"/>
                                            {subrace.asi_desc && (
                                                <p className="text-emerald-400 text-sm mt-2">
                                                    <strong>ASI:</strong> {subrace.asi_desc}
                                                </p>
                                            )}
                                            {subrace.traits && (
                                                <div className="mt-2 pt-2 border-t border-slate-600/50">
                                                    <div dangerouslySetInnerHTML={{ __html: subrace.traits }} className="text-slate-300 text-sm prose prose-invert prose-sm max-w-none"/>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

