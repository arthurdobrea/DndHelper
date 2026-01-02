'use client'

import Link from 'next/link'

const navigation = [
    {name:'Monsters',href: '/monsters'},
    {name:'Classes',href: '/classes'},
    {name:'Races',href: '/races'},
    {name:'Magic-items',href: '/magic-items'},
    {name:'Weapons',href: '/weapons'},
]
export default function NavigationBar() {
    return (
        // absolute top-0 left-0 w-full z-50 — делает меню прозрачным поверх фона
        <nav className="absolute top-0 left-0 w-full z-50 py-6 px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Логотип */}
                <div className="flex-shrink-0">
                    <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wider drop-shadow-md">
                        D&D Helper
                    </Link>
                </div>

                {/* Ссылки */}
                <div className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors drop-shadow-sm"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Иконка профиля (заглушка) */}
                    <button className="text-white/90 hover:text-amber-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}