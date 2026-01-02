import {CLASSES_API, fetchService} from "@/services/fetchService";
import {ClassCard} from "@/components/ClassCard";
import {Class} from "@/types";
import AnimatedCard from "@/components/AnimatedCard";

export default async function ClassesPage() {
    const classes = await fetchService.getData<Class>(CLASSES_API);
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Красивый градиентный фон с анимацией */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <section className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {classes.map((classe, index) => (
                            <AnimatedCard key={classe.slug} index={index}>
                                <ClassCard data={classe} />
                            </AnimatedCard>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 backdrop-blur-sm">
                        <p className="text-slate-500 text-lg">Классы не найдены...</p>
                    </div>
                )}
            </section>
        </main>
    );
}