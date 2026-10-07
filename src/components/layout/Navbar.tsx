import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  BookOpen, 
  Globe, 
  Archive, 
  Sparkles, 
  Plus, 
  Printer, 
  Shield, 
  Camera, 
  Film, 
  Landmark, 
  Layers, 
  ChevronDown, 
  Menu, 
  X 
} from 'lucide-react';
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
  // Dropdown & Mobile drawer state
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCollectionsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Is active tab inside the "Koleksi" group?
  const isCollectionsActive = activeTab === 'videos' || activeTab === 'countries' || activeTab === 'souvenirs';

  // Is active tab inside the mobile "Menu Lainnya" drawer?
  const isDrawerActive = ['journal', 'videos', 'countries', 'souvenirs', 'about'].includes(activeTab);

  // Safe navigation handler with event isolation
  const handleNavigate = (tab: NavTab, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsCollectionsOpen(false);
    setIsMobileMenuOpen(false);
    onSelectTab(tab);
  };

  // Primary 5 navigation items on desktop
  const primaryNavItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Beranda', icon: <Compass className="w-4 h-4" /> },
    { id: 'atlas', label: 'Atlas Dunia', icon: <Globe className="w-4 h-4" /> },
    { 
      id: 'museum', 
      label: 'Museum Mini', 
      icon: <Landmark className="w-4 h-4 text-amber-300" />,
      badge: '3D'
    },
    { id: 'memories', label: 'Memori', icon: <Camera className="w-4 h-4" /> },
    { id: 'journal', label: 'Jurnal', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Secondary "Koleksi" dropdown items
  const collectionItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'videos', 
      label: 'Sinema Video', 
      icon: <Film className="w-4 h-4 text-earth-300" />,
      desc: 'Teater video & dokumentasi lapangan'
    },
    { 
      id: 'countries', 
      label: 'Katalog Negara', 
      icon: <Globe className="w-4 h-4 text-earth-300" />,
      desc: '195 negara terdaftar & status jelajah'
    },
    { 
      id: 'souvenirs', 
      label: 'Galeri Suvenir', 
      icon: <Archive className="w-4 h-4 text-earth-300" />,
      desc: 'Cenderamata, artefak & perangko fisik'
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-museum-border bg-museum-base/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand / Logo */}
          <div 
            onClick={(e) => handleNavigate('home', e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate('home'); }}
            className="flex items-center gap-3 cursor-pointer group select-none min-h-[44px]"
            title="Kembali ke Beranda Project Atlas"
          >
            <div className="w-8 h-8 rounded-full border border-earth-500/40 bg-museum-surface flex items-center justify-center text-earth-300 group-hover:border-earth-400 group-hover:text-earth-200 transition-colors shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wide text-parchment-100 group-hover:text-white transition-colors font-medium">
                Project Atlas
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-earth-400/80 ml-2 tracking-widest uppercase">
                Arsip Pribadi
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navigasi Utama">
            {primaryNavItems.map(item => {
              const isActive = activeTab === item.id;
              const isMuseum = item.id === 'museum';
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavigate(item.id, e)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[40px] ${
                    isActive
                      ? isMuseum
                        ? 'text-parchment-100 bg-amber-950/40 border border-amber-500/50 shadow-sm'
                        : 'text-parchment-100 bg-museum-card border border-earth-500/30 shadow-sm'
                      : isMuseum
                        ? 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/20'
                        : 'text-parchment-400 hover:text-parchment-200 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-tight font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Secondary "Koleksi" Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCollectionsOpen(prev => !prev);
                }}
                aria-expanded={isCollectionsOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[40px] ${
                  isCollectionsActive
                    ? 'text-parchment-100 bg-museum-card border border-earth-500/30 shadow-sm'
                    : 'text-parchment-400 hover:text-parchment-200 hover:bg-white/5'
                }`}
                title="Buka menu koleksi arsip (Video, Negara, Suvenir)"
              >
                <Layers className="w-4 h-4 text-earth-400" />
                <span>Koleksi</span>
                <ChevronDown className={`w-3.5 h-3.5 text-parchment-400 transition-transform duration-200 ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Container */}
              {isCollectionsOpen && (
                <div 
                  role="menu"
                  className="absolute left-0 mt-2 w-72 rounded-xl border border-museum-border bg-museum-surface/98 shadow-2xl p-1.5 z-50 backdrop-blur-md animate-fadeIn"
                >
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 border-b border-museum-border/60 mb-1">
                    Arsip & Temuan Lapangan
                  </div>
                  {collectionItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={(e) => handleNavigate(item.id, e)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-museum-card text-parchment-100 border border-earth-500/30'
                            : 'text-parchment-300 hover:bg-museum-hover hover:text-parchment-100'
                        }`}
                      >
                        <div className="mt-0.5 p-1 rounded bg-museum-base border border-museum-border text-earth-300">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-parchment-100">{item.label}</div>
                          <div className="text-[11px] font-sans text-stone-400 leading-snug">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right action button group */}
          <div className="flex items-center gap-2">
            
            {/* "Tentang" page button */}
            <button
              onClick={(e) => handleNavigate('about', e)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'about'
                  ? 'bg-museum-card text-parchment-100 border-earth-500/40 shadow-sm'
                  : 'bg-museum-card/60 hover:bg-museum-hover border-museum-border text-stone-300 hover:text-parchment-100'
              }`}
              title="Tentang Project Atlas & Filosofi Kurasi"
            >
              <Sparkles className="w-3.5 h-3.5 text-earth-400" />
              <span>Tentang</span>
            </button>

            {/* Passport Dossier Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenPassport();
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 hover:text-parchment-100 transition-colors cursor-pointer min-h-[36px]"
              title="Dossier Paspor & Jurnal Lapangan (Cetak / PDF)"
            >
              <Printer className="w-3.5 h-3.5 text-earth-400" />
              <span>Paspor PDF</span>
            </button>

            {/* Backup & Restore Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenBackup();
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 hover:text-parchment-100 transition-colors cursor-pointer min-h-[36px]"
              title="Cadangkan & Ekspor / Impor Data Arsip"
            >
              <Shield className="w-3.5 h-3.5 text-earth-400" />
              <span>Cadangan</span>
            </button>

            {/* Primary Action Button */}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                onOpenNewMemory();
              }}
              className="shadow-sm font-medium"
            >
              <span>Catat Memori</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── MOBILE TOUCH BOTTOM BAR (Fixed & Accessible) ────────────────────── */}
      <nav 
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-museum-border bg-museum-surface/95 backdrop-blur-md px-2 py-1 flex items-center justify-around shadow-2xl"
        aria-label="Navigasi Seluler"
      >
        {/* 1. Beranda */}
        <button
          onClick={(e) => handleNavigate('home', e)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-lg text-[11px] font-sans transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-parchment-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'text-earth-300' : 'text-stone-400'}`} />
          <span>Beranda</span>
        </button>

        {/* 2. Atlas Dunia */}
        <button
          onClick={(e) => handleNavigate('atlas', e)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-lg text-[11px] font-sans transition-colors cursor-pointer ${
            activeTab === 'atlas' ? 'text-parchment-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Globe className={`w-5 h-5 mb-0.5 ${activeTab === 'atlas' ? 'text-earth-300' : 'text-stone-400'}`} />
          <span>Atlas 3D</span>
        </button>

        {/* 3. Museum Mini (Prominent Center Anchor) */}
        <button
          onClick={(e) => handleNavigate('museum', e)}
          className={`flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-2 rounded-xl text-[11px] font-sans transition-all cursor-pointer ${
            activeTab === 'museum'
              ? 'text-amber-200 bg-amber-950/50 border border-amber-500/50 font-bold shadow-md'
              : 'text-amber-300/80 hover:text-amber-200'
          }`}
        >
          <div className="relative">
            <Landmark className="w-5 h-5 mb-0.5 text-amber-300" />
            <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded-full bg-amber-500 text-museum-dark font-extrabold">
              3D
            </span>
          </div>
          <span>Museum</span>
        </button>

        {/* 4. Memori */}
        <button
          onClick={(e) => handleNavigate('memories', e)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-lg text-[11px] font-sans transition-colors cursor-pointer ${
            activeTab === 'memories' ? 'text-parchment-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Camera className={`w-5 h-5 mb-0.5 ${activeTab === 'memories' ? 'text-earth-300' : 'text-stone-400'}`} />
          <span>Memori</span>
        </button>

        {/* 5. Menu Lainnya (Drawer Toggle) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileMenuOpen(prev => !prev);
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-lg text-[11px] font-sans transition-colors cursor-pointer relative ${
            isDrawerActive || isMobileMenuOpen ? 'text-earth-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-expanded={isMobileMenuOpen}
          aria-label="Buka menu navigasi dan koleksi arsip lainnya"
        >
          <div className="relative">
            <Menu className="w-5 h-5 mb-0.5" />
            {isDrawerActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-earth-400 ring-2 ring-museum-surface" />
            )}
          </div>
          <span>Menu</span>
        </button>
      </nav>

      {/* ── MOBILE SLIDE-UP DRAWER SHEET ───────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigasi & Koleksi Arsip"
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-museum-surface border-t border-museum-border rounded-t-2xl p-5 pb-8 space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-museum-border/60 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-parchment-100">Navigasi Arsip</h3>
                <p className="text-[11px] font-mono text-stone-400">Jelajahi seluruh bagian & utilitas Project Atlas</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 hover:text-parchment-100 cursor-pointer min-h-[40px] min-w-[40px]"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Collections & Sub-views */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-earth-400">
                Koleksi & Catatan
              </div>

              <button
                onClick={(e) => handleNavigate('journal', e)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors min-h-[48px] cursor-pointer ${
                  activeTab === 'journal' ? 'bg-museum-card text-parchment-100 border border-earth-500/30 font-semibold' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-5 h-5 text-earth-300" />
                <div>
                  <div>Jurnal Perjalanan</div>
                  <div className="text-[11px] text-stone-400 font-normal">Catatan kronologis & refleksi lapangan</div>
                </div>
              </button>

              <button
                onClick={(e) => handleNavigate('videos', e)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors min-h-[48px] cursor-pointer ${
                  activeTab === 'videos' ? 'bg-museum-card text-parchment-100 border border-earth-500/30 font-semibold' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Film className="w-5 h-5 text-earth-300" />
                <div>
                  <div>Sinema Video</div>
                  <div className="text-[11px] text-stone-400 font-normal">Teater cuplikan video dokumentasi</div>
                </div>
              </button>

              <button
                onClick={(e) => handleNavigate('countries', e)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors min-h-[48px] cursor-pointer ${
                  activeTab === 'countries' ? 'bg-museum-card text-parchment-100 border border-earth-500/30 font-semibold' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Globe className="w-5 h-5 text-earth-300" />
                <div>
                  <div>Katalog Negara</div>
                  <div className="text-[11px] text-stone-400 font-normal">195 negara terdaftar & status kunjungan</div>
                </div>
              </button>

              <button
                onClick={(e) => handleNavigate('souvenirs', e)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors min-h-[48px] cursor-pointer ${
                  activeTab === 'souvenirs' ? 'bg-museum-card text-parchment-100 border border-earth-500/30 font-semibold' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Archive className="w-5 h-5 text-earth-300" />
                <div>
                  <div>Galeri Suvenir</div>
                  <div className="text-[11px] text-stone-400 font-normal">Artefak, perangko & cenderamata fisik</div>
                </div>
              </button>

              <button
                onClick={(e) => handleNavigate('about', e)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors min-h-[48px] cursor-pointer ${
                  activeTab === 'about' ? 'bg-museum-card text-parchment-100 border border-earth-500/30 font-semibold' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-5 h-5 text-earth-300" />
                <div>
                  <div>Tentang Project Atlas</div>
                  <div className="text-[11px] text-stone-400 font-normal">Filosofi kurasi arsip & panduan sistem</div>
                </div>
              </button>
            </div>

            {/* Utility Actions */}
            <div className="pt-2 border-t border-museum-border/60 space-y-2">
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-earth-400">
                Utilitas & Ekspor
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                    onOpenPassport();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-200 text-xs font-mono min-h-[48px] cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-earth-400" />
                  <span>Paspor PDF</span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                    onOpenBackup();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-200 text-xs font-mono min-h-[48px] cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-earth-400" />
                  <span>Cadangan</span>
                </button>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={(e) => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    setIsMobileMenuOpen(false);
                    onOpenNewMemory();
                  }}
                  className="w-full justify-center min-h-[48px] text-sm font-medium"
                >
                  <span>Catat Memori Baru</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
