import {Open5eResponse} from "@/types";

const API_URL = "https://api.open5e.com";
export const monsterService = {
    getMonsters: async () => {
        const res = await fetch(`https://api.open5e.com/monsters`);
        const data: Open5eResponse = await res.json();
        return data.results;
    }
}