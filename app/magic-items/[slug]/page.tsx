import {MagicItem} from "@/types";
import {fetchService, MAGIC_ITEMS_API} from "@/services/fetchService";

interface MagicItemDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function MagicItemDetailPage({ params }: MagicItemDetailPageProps) {
    const { slug } = await params;
    const magicItems = await fetchService.getData<MagicItem>(MAGIC_ITEMS_API);
    const data = magicItems.find((item) => (item.slug === slug || item.key === slug));

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Magic Item Not Found</h1>
                    <p className="text-slate-400">The magic item &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }

    // Функция для определения цвета редкости
    const getRarityColor = (rank: number) => {
        if (rank <= 1) return 'text-gray-400 border-gray-600'; // Common
        if (rank <= 2) return 'text-green-400 border-green-600'; // Uncommon
        if (rank <= 3) return 'text-blue-400 border-blue-600'; // Rare
        if (rank <= 4) return 'text-purple-400 border-purple-600'; // Very Rare
        return 'text-orange-400 border-orange-600'; // Legendary
    };

    const rarityColor = getRarityColor(data.rarity.rank);

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div
                    className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300">

                    {/* ЗАГЛУШКА ДЛЯ КАРТИНКИ (ВЕРХНЯЯ ЧАСТЬ) */}
                    <div
                        className="h-64 bg-gradient-to-br from-purple-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                        <span className="text-9xl">✨</span>
                        <div
                            className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    </div>

                    {/* КОНТЕНТ */}
                    <div className="p-8">
                        {/* Заголовок и редкость */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                                <p className="text-slate-400 text-lg italic capitalize">
                                    {data.category.name}
                                </p>
                            </div>

                            {/* Бейдж для редкости */}
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-slate-400 uppercase font-bold tracking-wider">Rarity</span>
                                <span className={`${rarityColor.split(' ')[0]} font-bold text-2xl capitalize`}>
                                    {data.rarity.name}
                                </span>
                            </div>
                        </div>

                        {/* ОСНОВНОЕ ОПИСАНИЕ */}
                        {data.desc && (
                            <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 mb-6">
                                <div dangerouslySetInnerHTML={{ __html: data.desc }} className="text-slate-300 leading-relaxed prose prose-invert max-w-none"/>
                            </div>
                        )}

                        {/* ОСНОВНЫЕ ХАРАКТЕРИСТИКИ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Вес */}
                            {data.weight && (
                                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">⚖️</span>
                                        <span className="text-sm text-slate-500 font-bold uppercase">Weight</span>
                                    </div>
                                    <p className="text-3xl font-mono font-bold text-white">
                                        {data.weight}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">{data.weight_unit}</p>
                                </div>
                            )}

                            {/* Стоимость */}
                            {data.cost && (
                                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">💰</span>
                                        <span className="text-sm text-slate-500 font-bold uppercase">Cost</span>
                                    </div>
                                    <p className="text-3xl font-mono font-bold text-white">
                                        {data.cost}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">gold pieces</p>
                                </div>
                            )}

                            {/* Редкость рейтинг */}
                            <div className={`bg-slate-900/50 p-6 rounded-lg border ${rarityColor.split(' ')[1] || 'border-slate-700/50'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">⭐</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase">Rarity Rank</span>
                                </div>
                                <p className={`text-3xl font-mono font-bold ${rarityColor.split(' ')[0]}`}>
                                    {data.rarity.rank}
                                </p>
                                <p className="text-sm text-slate-400 mt-1 capitalize">{data.rarity.name}</p>
                            </div>
                        </div>

                        {/* ATTUNEMENT */}
                        {data.requires_attunement && (
                            <div className="bg-amber-900/20 border border-amber-600/50 p-6 rounded-lg mb-6">
                                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                                    <span>🔮</span>
                                    Requires Attunement
                                </h2>
                                {data.attunement_detail && (
                                    <p className="text-amber-200">{data.attunement_detail}</p>
                                )}
                            </div>
                        )}

                        {/* ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Key</p>
                                <p className="text-slate-300 font-mono">{data.key}</p>
                            </div>

                            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Type</p>
                                <p className="text-slate-300">{data.is_magic_item ? 'Magic Item' : 'Regular Item'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

