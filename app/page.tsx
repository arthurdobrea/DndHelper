import MonsterCard from "@/components/MonsterCard";
import {fetchService, MONSTER_API} from "@/services/fetchService";

export default async function Home() {
    const monsters = await fetchService.getData(MONSTER_API);
    return (
        <main className="min-h-screen bg-slate-50">

        </main>
    );
}
