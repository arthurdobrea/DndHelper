import {Open5eResponse, Monster} from "@/types";

const API_URL = "https://api.open5e.com";

export const MONSTER_API ='v1/monsters/'
export const CLASSES_API ='v1/classes/'
export const RACE_API ='v1/races/'
export const WEAPON_API ='v2/weapons/'
export const MAGIC_ITEMS_API ='v1/magicitems/'

export const fetchService = {
    getData: async <T = Monster>(api: string) => {
        const res = await fetch(`${API_URL}/${api}`);
        const data: Open5eResponse<T> = await res.json();
        return data.results;
    }
}