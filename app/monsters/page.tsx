import {fetchService, MONSTER_API} from "@/services/fetchService";
import MonsterCard from "@/components/MonsterCard";

export default async function Page() {
    const monsters = await fetchService.getData(MONSTER_API);
    return (
        <main>
            <section className="max-w-7xl mx-auto">
                {monsters.length > 0 ? (

                    // CSS Grid: 1 колонка на телефоне, 2 на планшете, 3 на десктопе, 4 на больших экранах
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {/* Самое важное место: .map() */}
                        {monsters.map((monster) => (
                            <MonsterCard
                                key={monster.slug} // Обязательно уникальный ключ!
                                data={monster}     // Передаем всего монстра внутрь карточки
                            />
                        ))}
                    </div>
                ) : (
                    // Если монстров нет
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-500 text-lg">В этих землях монстров не обнаружено...</p>
                    </div>
                )}
            </section>
        </main>
    );
};