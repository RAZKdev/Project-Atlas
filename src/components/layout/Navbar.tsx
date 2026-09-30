import React from 'react';
import { Compass, BookOpen, Globe, Archive, Sparkles, Plus, Printer, Shield, Camera, Film, Landmark } from 'lucide-react';
import { Button } from '../ui/Button';

export type NavTab = 'home' | 'atlas' | 'journal' | 'videos' | 'memories' | 'countries' | 'souvenirs' | 'about' | 'museum';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewMemory: () => void;
  onOpenPassport: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewMemory,
  onOpenPassport,
  onOpenBackup,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda', icon: <Compass className="w-4 h-4" /> },
    { id: 'atlas', label: 'Atlas Dunia', icon: <Globe className="w-4 h-4" /> },
    { id: 'journal', label: 'Jurnal Perjalanan', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'videos', label: 'Sinema Video', icon: <Film className="w-4 h-4" /> },
    { id: 'memories', label: 'Memori', icon: <Camera className="w-4 h-4" /> },
    { id: 'countries', label: 'Negara', icon: <Globe className="w-4 h-4" /> },
    { id: 'souvenirs', label: 'Suvenir', icon: <Archive className="w-4 h-4" /> },
    { id: 'about', label: 'Tentang', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'museum', label: 'Museum Mini', icon: <Landmark className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-museum-border bg-museum-base/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full border border-earth-500/40 bg-museum-surface flex items-center justify-center text-earth-300 group-hover:border-earth-400 group-hover:text-earth-200 transition-colors">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-lg tracking-wide text-parchment-100 group-hover:text-white transition-colors">
              Project Atlas
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-earth-400/80 ml-2 tracking-widest uppercase">
              Arsip Pribadi
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-parchment-100 bg-museum-card border border-earth-500/30 shadow-sm'
                    : 'text-parchment-400 hover:text-parchment-200 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right action button group */}
        <div className="flex items-center gap-2">

          <button
            onClick={onOpenPassport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 hover:text-parchment-100 transition-colors cursor-pointer"
            title="Dossier Paspor & Jurnal Lapangan (Cetak / PDF)"
          >
            <Printer className="w-3.5 h-3.5 text-earth-400" />
            <span>Paspor PDF</span>
          </button>

          <button
            onClick={onOpenBackup}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 hover:text-parchment-100 transition-colors cursor-pointer"
            title="Cadangkan & Ekspor / Impor Data Arsip"
          >
            <Shield className="w-3.5 h-3.5 text-earth-400" />
            <span>Cadangan</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenNewMemory}
            className="shadow-sm"
          >
            <span>Catat Memori</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-museum-border py-2 px-2 bg-museum-surface/95 overflow-x-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
                isActive ? 'text-earth-300 font-semibold' : 'text-parchment-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
