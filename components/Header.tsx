import React from 'react';

interface HeaderProps {
    currentTab: 'home' | 'gallery';
    setTab: (tab: 'home' | 'gallery') => void;
}

const NavLink: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`font-semibold transition-colors duration-200 pb-1 border-b-2 ${
            isActive ? 'text-brand-accent border-brand-accent' : 'text-brand-gray border-transparent hover:text-brand-light'
        }`}
    >
        {label}
    </button>
)

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
    return (
        <header className="container mx-auto flex justify-between items-center pb-4 border-b border-white/10">
            <div className="font-orbitron text-xl md:text-2xl font-bold text-brand-accent text-shadow-glow-accent flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>
                <span>NanoBanana AI</span>
            </div>
            <nav className="flex gap-4 md:gap-6">
                <NavLink label="Início" isActive={currentTab === 'home'} onClick={() => setTab('home')} />
                <NavLink label="Galería" isActive={currentTab === 'gallery'} onClick={() => setTab('gallery')} />
            </nav>
        </header>
    );
};