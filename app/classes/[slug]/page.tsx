import { fetchService, CLASSES_API } from "@/services/fetchService";
import { Class } from "@/types";

interface ClassDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
    const { slug } = await params;

    // Получаем все классы и находим нужный по slug
    const classes = await fetchService.getData<Class>(CLASSES_API);
    const classData = classes.find((c) => c.slug === slug);

    if (!classData) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Class Not Found</h1>
                    <p className="text-slate-400">The class &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-5xl font-serif font-bold text-amber-400 mb-2">
                        {classData.name}
                    </h1>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">
                        {classData.subtypes_name || "Archetypes"}
                    </p>
                </div>

                {/* Основная информация */}
                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-amber-400">Class Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Hit Dice</h3>
                            <p className="text-white font-mono">{classData.hit_dice}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">HP at 1st Level</h3>
                            <p className="text-white">{classData.hp_at_1st_level}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">HP at Higher Levels</h3>
                            <p className="text-white">{classData.hp_at_higher_levels}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Spellcasting Ability</h3>
                            <p className="text-white">{classData.spellcasting_ability || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Профессии */}
                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-amber-400">Proficiencies</h2>

                    <div className="space-y-3">
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Armor</h3>
                            <p className="text-white">{classData.prof_armor}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Weapons</h3>
                            <p className="text-white">{classData.prof_weapons}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Tools</h3>
                            <p className="text-white">{classData.prof_tools}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Saving Throws</h3>
                            <p className="text-white">{classData.prof_saving_throws}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 uppercase font-bold mb-1">Skills</h3>
                            <p className="text-white">{classData.prof_skills}</p>
                        </div>
                    </div>
                </div>

                {/* Начальное снаряжение */}
                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-amber-400">Starting Equipment</h2>
                    <p className="text-white whitespace-pre-line">{classData.equipment}</p>
                </div>

                {/* Описание */}
                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-amber-400">Description</h2>
                    <div className="text-white prose prose-invert max-w-none">
                        <p className="whitespace-pre-line">{classData.desc}</p>
                    </div>
                </div>

                {/* Архетипы */}
                {classData.archetypes && classData.archetypes.length > 0 && (
                    <div className="bg-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-amber-400">
                            {classData.subtypes_name || "Archetypes"} ({classData.archetypes.length})
                        </h2>
                        <div className="space-y-6">
                            {classData.archetypes.map((archetype) => (
                                <div key={archetype.slug} className="border-l-4 border-indigo-500 pl-4">
                                    <h3 className="text-xl font-bold text-indigo-300 mb-2">
                                        {archetype.name}
                                    </h3>
                                    <p className="text-slate-300 whitespace-pre-line">{archetype.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

