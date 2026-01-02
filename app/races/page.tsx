import {fetchService, RACE_API} from "@/services/fetchService";
import RaceCard from "@/components/RaceCard";
import {Race} from "@/types";
import AnimatedCard from "@/components/AnimatedCard";

export default async function Page() {
    const races = await fetchService.getData<Race>(RACE_API);
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Красивый градиентный фон с анимацией */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <section className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {races.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {races.map((race, index) => (
                            <AnimatedCard key={race.slug} index={index}>
                                <RaceCard data={race} />
                            </AnimatedCard>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 backdrop-blur-sm">
                        <p className="text-slate-500 text-lg">Расы не найдены...</p>
                    </div>
                )}
            </section>
        </main>
    );
}

