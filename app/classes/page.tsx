import {CLASSES_API, fetchService} from "@/services/fetchService";
import {ClassCard} from "@/components/ClassCard";
import {Class} from "@/types";

export default async function ClassesPage() {
    const classes = await fetchService.getData<Class>(CLASSES_API);
    return (

        <main className="min-h-screen bg-slate-50">
            <section className="mx-auto">
                {classes.length > 0 ? (

                    // CSS Grid: 1 колонка на телефоне, 2 на планшете, 3 на десктопе, 4 на больших экранах
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {/* Самое важное место: .map() */}
                        {classes.map((classe) => (
                            <ClassCard
                                key={classe.slug} // Обязательно уникальный ключ!
                                data={classe}     // Передаем всего монстра внутрь карточки
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
}