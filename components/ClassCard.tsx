import {ClassCardProps} from "@/types";
import Link from "next/link";

export const ClassCard = ({ data }: ClassCardProps) => {
    // Проверяем, является ли класс заклинателем (есть ли хар-ка заклинателя)
    const isSpellcaster = data.spellcasting_ability && data.spellcasting_ability.length > 0;

    return (
        <Link
            href={`/classes/${data.slug}`}
            className="block group h-full"
        >
            <div className={`
        relative h-full bg-slate-800 rounded-xl overflow-hidden border transition-all duration-300
        ${isSpellcaster
                ? 'border-indigo-900/50 hover:border-indigo-500 hover:shadow-indigo-500/20'
                : 'border-slate-700 hover:border-amber-500 hover:shadow-amber-500/20'
            }
        hover:-translate-y-1 shadow-lg
      `}>

                {/* --- ШАПКА КАРТОЧКИ --- */}
                <div className={`
          h-20 flex items-center px-6 relative overflow-hidden
          ${isSpellcaster
                    ? 'bg-gradient-to-r from-indigo-900 to-slate-900'
                    : 'bg-gradient-to-r from-amber-900/40 to-slate-900'}
        `}>
                    {/* Декоративная иконка на фоне */}
                    <span className="absolute -right-4 -bottom-4 text-8xl opacity-10 font-serif select-none">
            {data.name.charAt(0)}
          </span>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                            {data.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            {data.subtypes_name || "Archetypes"}
                        </p>
                    </div>
                </div>

                {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
                <div className="p-5 flex flex-col gap-4">

                    {/* Сетка характеристик */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Hit Dice */}
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Hit Die</span>
                            <div className="flex items-center gap-2 text-white font-mono font-bold">
                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                {data.hit_dice}
                            </div>
                        </div>

                        {/* Spellcasting (или прочерк) */}
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Spellcasting</span>
                            <div className="flex items-center gap-2 font-mono font-bold">
                                {isSpellcaster ? (
                                    <>
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        <span className="text-indigo-300 truncate text-sm">{data.spellcasting_ability}</span>
                                    </>
                                ) : (
                                    <span className="text-slate-600 text-sm">—</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Спасброски (Saving Throws) */}
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Saves</span>
                        <p className="text-sm text-slate-300 font-medium truncate" title={data.prof_saving_throws}>
                            {data.prof_saving_throws}
                        </p>
                    </div>

                    {/* Разделитель */}
                    <div className="h-px bg-slate-700/50 w-full my-1"></div>

                    {/* Подклассы (Archetypes count) */}
                    <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Available Subclasses:</span>
                        <span className="bg-slate-700 text-white px-2 py-0.5 rounded-full font-bold">
              {data.archetypes ? data.archetypes.length : 0}
            </span>
                    </div>

                </div>
            </div>
        </Link>
    );
};