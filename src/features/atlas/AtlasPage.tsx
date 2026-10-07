import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Globe, MapPin, BookOpen, ArrowRight, Compass, Layers, Orbit, Sparkles, X } from 'lucide-react';
import { Country, CountryStatus, Memory } from '../../core/contracts';
import { countryRegistry, SearchMatch } from '../../atlas/countries/countryRegistry';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Globe3D } from './Globe3D';

interface AtlasPageProps {
  countries: Country[];
  memories: Memory[];
  onSelectCountry: (code: string) => void;
  onSelectMemory: (id: string) => void;
  onUpdateCountryStatus: (code: string, status: CountryStatus) => void;
}

export const AtlasPage: React.FC<AtlasPageProps> = ({
  countries,
  memories,
  onSelectCountry,
  onSelectMemory,
  onUpdateCountryStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<CountryStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'globe' | 'map' | 'grid'>('globe');
  const [inspectedCountryCode, setInspectedCountryCode] = useState<string>('ID');

  const continentMap: Record<string, string> = {
    'Semua': 'All',
    'Asia': 'Asia',
    'Eropa': 'Europe',
    'Afrika': 'Africa',
    'Amerika Utara': 'North America',
    'Amerika Selatan': 'South America',
    'Oseania': 'Oceania',
  };

  const continents = ['Semua', 'Asia', 'Eropa', 'Afrika', 'Amerika Utara', 'Amerika Selatan', 'Oseania'];

  // Search matches using countryRegistry engine
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return countryRegistry.search(searchQuery, 195);
  }, [searchQuery]);

  const searchResultsMap = useMemo(() => {
    if (!searchResults) return null;
    const map = new Map<string, SearchMatch>();
    searchResults.forEach(m => map.set(m.country.id.toUpperCase(), m));
    return map;
  }, [searchResults]);

  // Filter countries while strictly preserving search relevance rank
  const filteredCountries = useMemo(() => {
    const englishContinent = continentMap[selectedContinent];

    if (!searchResults) {
      return countries.filter(c => {
        const matchesContinent = selectedContinent === 'Semua' || c.continent === englishContinent;
        const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
        return matchesContinent && matchesStatus;
      });
    }

    const countryByCode = new Map(countries.map(c => [c.code.toUpperCase(), c]));
    const matchedList: Country[] = [];

    for (const match of searchResults) {
      const c = countryByCode.get(match.country.id.toUpperCase());
      if (!c) continue;
      const matchesContinent = selectedContinent === 'Semua' || c.continent === englishContinent;
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      if (matchesContinent && matchesStatus) {
        matchedList.push({
          ...c,
          capital: c.capital || match.country.capital,
          officialName: c.officialName || match.country.officialName,
        });
      }
    }
    return matchedList;
  }, [countries, searchResults, selectedContinent, selectedStatus]);

  // Auto-inspect the top search result when searching so the 3D globe / map focuses on the match
  useEffect(() => {
    if (searchQuery.trim() && filteredCountries.length > 0) {
      const topMatch = filteredCountries[0];
      if (topMatch.code !== inspectedCountryCode) {
        setInspectedCountryCode(topMatch.code);
      }
    }
  }, [searchQuery, filteredCountries]);

  const inspectedCountry = useMemo(() => {
    return countries.find(c => c.code === inspectedCountryCode) || filteredCountries[0] || countries[0];
  }, [countries, filteredCountries, inspectedCountryCode]);

  const inspectedMemories = useMemo(() => {
    if (!inspectedCountry) return [];
    return memories.filter(m => m.countryCode === inspectedCountry.code);
  }, [memories, inspectedCountry]);

  // Coordinates mapping for SVG interactive 2D map pins
  const countryMapPins: Record<string, { x: number; y: number }> = {
    'ID': { x: 740, y: 310 },
    'JP': { x: 785, y: 195 },
    'VN': { x: 715, y: 245 },
    'TH': { x: 700, y: 250 },
    'SG': { x: 710, y: 295 },
    'MY': { x: 710, y: 290 },
    'KR': { x: 760, y: 195 },
    'NP': { x: 675, y: 215 },
    'IN': { x: 660, y: 235 },
    'TR': { x: 535, y: 185 },
    'JO': { x: 545, y: 205 },
    'CN': { x: 720, y: 195 },
    'IS': { x: 440, y: 105 },
    'CH': { x: 485, y: 165 },
    'NO': { x: 490, y: 115 },
    'IT': { x: 495, y: 175 },
    'FR': { x: 470, y: 165 },
    'ES': { x: 450, y: 185 },
    'DE': { x: 485, y: 150 },
    'GR': { x: 520, y: 190 },
    'PT': { x: 440, y: 185 },
    'GB': { x: 455, y: 140 },
    'AT': { x: 495, y: 160 },
    'NL': { x: 475, y: 145 },
    'MA': { x: 440, y: 215 },
    'EG': { x: 535, y: 220 },
    'KE': { x: 560, y: 295 },
    'ZA': { x: 525, y: 390 },
    'TZ': { x: 560, y: 315 },
    'NA': { x: 505, y: 365 },
    'CA': { x: 230, y: 130 },
    'US': { x: 230, y: 180 },
    'MX': { x: 220, y: 230 },
    'CR': { x: 260, y: 265 },
    'PE': { x: 290, y: 320 },
    'CL': { x: 295, y: 390 },
    'AR': { x: 315, y: 400 },
    'BR': { x: 350, y: 330 },
    'NZ': { x: 865, y: 425 },
    'AU': { x: 800, y: 375 },
    'FJ': { x: 915, y: 350 }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-museum-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>KARTOGRAFI DUNIA</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100">
            Eksplorasi Atlas Dunia
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Jelajahi bola dunia 3D, periksa wilayah yang terdokumentasi, dan lihat foto yang telah Anda rekam.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-museum-surface border border-museum-border">
          <button
            onClick={() => setViewMode('globe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'globe'
                ? 'bg-earth-500 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-parchment-200'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Bola Dunia 3D</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-earth-500 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-parchment-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Peta Datar</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-earth-500 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-parchment-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Daftar Negara</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-museum-surface/80 p-4 rounded-xl border border-museum-border">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari negara, ibu kota (misal: Bandar Seri Begawan, New Delhi), atau kode ISO..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-museum-card border border-museum-border rounded-md pl-9 pr-8 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-parchment-100 p-0.5 rounded cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Continent Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {continents.map(cont => (
            <button
              key={cont}
              onClick={() => setSelectedContinent(cont)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedContinent === cont
                  ? 'bg-earth-500 text-white font-medium'
                  : 'text-stone-400 hover:text-parchment-200 hover:bg-white/5'
              }`}
            >
              {cont}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as CountryStatus | 'all')}
            className="bg-museum-card border border-museum-border rounded-md px-3 py-1.5 text-xs text-parchment-200 focus:outline-none focus:border-earth-500/50 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="documented">Terdokumentasi</option>
            <option value="visited">Sudah Dikunjungi</option>
            <option value="planned">Direncanakan</option>
            <option value="interested">Diminati</option>
            <option value="unknown">Belum Dijelajahi</option>
          </select>
        </div>

      </div>

      {/* Active Search Context / Matches Badge */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between text-xs font-mono px-1 text-stone-400">
          <span>
            Hasil pencarian untuk <span className="text-earth-300 font-semibold">"{searchQuery}"</span>: {filteredCountries.length} negara ditemukan
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-earth-400 hover:text-earth-300 underline cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Main Content Area based on ViewMode / Empty Search State */}
      {searchQuery.trim() && filteredCountries.length === 0 ? (
        /* NO RESULTS STATE */
        <div className="bg-museum-surface/90 border border-museum-border rounded-xl p-12 text-center max-w-2xl mx-auto space-y-4 my-8 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-museum-card border border-museum-border flex items-center justify-center mx-auto text-stone-500">
            <Search className="w-6 h-6 text-earth-400" />
          </div>
          <h3 className="font-serif text-2xl text-parchment-100">
            Tidak ada negara atau ibu kota yang cocok
          </h3>
          <p className="text-sm text-stone-300 font-sans leading-relaxed">
            Pencarian untuk <span className="font-mono text-parchment-100 bg-white/5 px-2 py-0.5 rounded border border-museum-border">"{searchQuery}"</span> tidak menemukan negara atau ibu kota manapun.
          </p>
          <div className="pt-2 text-xs font-mono text-earth-300/90 bg-earth-500/10 border border-earth-500/30 rounded-lg p-3.5 inline-block text-left max-w-lg">
            <span className="font-bold block mb-1">💡 Tips Pencarian:</span>
            • Cari nama negara lengkap atau parsial (misal: <span className="text-parchment-200">Indonesia, South Korea, Papua New Guinea</span>)<br />
            • Cari nama ibu kota multi-kata (misal: <span className="text-parchment-200">Bandar Seri Begawan, New Delhi, Buenos Aires, San José</span>)<br />
            • Gunakan kode ISO 2 atau 3 huruf (misal: <span className="text-parchment-200">ID, BN, CHE, USA</span>)
          </div>
          <div className="pt-4">
            <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
              Bersihkan Filter & Pencarian
            </Button>
          </div>
        </div>
      ) : viewMode === 'globe' ? (
        /* MODE 1: GLOBE 3D INTERACTIVE */
        <Globe3D
          countries={filteredCountries}
          memories={memories}
          onSelectCountry={onSelectCountry}
          onSelectMemory={onSelectMemory}
        />
      ) : viewMode === 'map' ? (
        /* MODE 2: FLAT 2D SVG CARTOGRAPHY */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 rounded-xl border border-museum-border bg-museum-surface/90 p-4 sm:p-6 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-earth-400" />
                <span>PILIH PIN UNTUK MEMERIKSA REKAMAN</span>
              </span>
              <span>PROYEKSI KARTOGRAFI 2D</span>
            </div>

            <div className="relative w-full aspect-[2/1] bg-[#161514] rounded-lg border border-museum-border/70 overflow-hidden">
              <svg viewBox="0 0 1000 500" className="w-full h-full select-none">
                <defs>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#252220" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="1000" height="500" fill="url(#grid)" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#332E2A" strokeDasharray="4 4" strokeWidth="0.75" />
                <line x1="500" y1="0" x2="500" y2="500" stroke="#332E2A" strokeDasharray="4 4" strokeWidth="0.75" />

                <g fill="#201E1C" stroke="#2D2926" strokeWidth="0.75">
                  <path d="M 120,60 Q 200,40 280,70 Q 320,120 270,190 Q 230,220 200,260 Q 180,240 150,180 Q 110,130 120,60 Z" />
                  <path d="M 270,270 Q 350,290 380,340 Q 350,420 310,460 Q 270,410 260,330 Z" />
                  <path d="M 430,90 Q 520,70 560,110 Q 540,180 480,200 Q 420,190 430,120 Z" />
                  <path d="M 430,210 Q 530,200 580,260 Q 580,350 520,430 Q 460,360 430,270 Z" />
                  <path d="M 570,80 Q 750,60 840,110 Q 820,240 730,270 Q 640,240 570,160 Z" />
                  <path d="M 760,340 Q 850,330 870,380 Q 830,440 760,410 Z" />
                </g>

                {countries.map(c => {
                  const pin = countryMapPins[c.code];
                  if (!pin) return null;
                  const isInspected = c.code === inspectedCountry?.code;
                  
                  let pinColor = '#78716C';
                  if (c.status === 'documented') pinColor = '#4ADE80';
                  else if (c.status === 'visited') pinColor = '#F59E0B';
                  else if (c.status === 'planned') pinColor = '#60A5FA';
                  else if (c.status === 'interested') pinColor = '#FBBF24';

                  return (
                    <g
                      key={c.code}
                      onClick={() => setInspectedCountryCode(c.code)}
                      className="cursor-pointer group"
                    >
                      {isInspected && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r="10"
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="1.5"
                          className="animate-ping opacity-60"
                        />
                      )}
                      
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={isInspected ? "6" : "3.5"}
                        fill={pinColor}
                        stroke="#141312"
                        strokeWidth="1"
                        className="transition-all duration-200 group-hover:scale-125"
                      />

                      {(isInspected || c.status === 'documented') && (
                        <text
                          x={pin.x}
                          y={pin.y - 8}
                          textAnchor="middle"
                          fill="#EAE2D7"
                          fontSize="9"
                          fontFamily="monospace"
                          className="pointer-events-none drop-shadow"
                        >
                          {c.code}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-museum-border/40 text-xs font-mono text-stone-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span> Terdokumentasi</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Dikunjungi</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#60A5FA]"></span> Direncanakan</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#78716C]"></span> Belum Dijelajahi</span>
              </div>
              <span>Klik marker negara untuk memeriksa</span>
            </div>
          </div>

          {/* Inspected Country Detail Panel */}
          <div className="lg:col-span-4 bg-museum-surface rounded-xl border border-museum-border p-6 space-y-6">
            {inspectedCountry ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={inspectedCountry.status} />
                    <span className="font-mono text-xs text-stone-400">{inspectedCountry.continent}</span>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl text-parchment-100 flex items-center gap-2">
                      <span>{inspectedCountry.name}</span>
                      {inspectedCountry.nativeName && (
                        <span className="text-sm font-sans font-light text-stone-400">({inspectedCountry.nativeName})</span>
                      )}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400 mt-1">
                      <span className="text-earth-400 font-semibold">ISO: {inspectedCountry.code}</span>
                      {inspectedCountry.capital && (
                        <>
                          <span>•</span>
                          <span className="text-parchment-200">Ibu Kota: <strong className="text-earth-300 font-medium">{inspectedCountry.capital}</strong></span>
                        </>
                      )}
                    </div>
                    {searchResultsMap?.get(inspectedCountry.code)?.highlightDetail && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-earth-500/15 border border-earth-500/30 text-xs font-mono text-earth-300 mt-2">
                        <Sparkles className="w-3.5 h-3.5 text-earth-400 shrink-0" />
                        <span>{searchResultsMap.get(inspectedCountry.code)!.highlightDetail}</span>
                      </div>
                    )}
                  </div>

                  {inspectedCountry.coverImage && (
                    <div className="aspect-[16/9] rounded-lg overflow-hidden border border-museum-border">
                      <img
                        src={inspectedCountry.coverImage}
                        alt={inspectedCountry.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {inspectedCountry.summary || 'Belum ada catatan arsip untuk negara ini.'}
                  </p>
                </div>

                {/* Status Updater */}
                <div className="pt-2 border-t border-museum-border/60">
                  <label className="text-[11px] font-mono text-stone-400 block mb-1.5">Ubah Status Perjalanan</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['documented', 'visited', 'planned', 'interested', 'unknown'] as CountryStatus[]).map(st => {
                      const labels: Record<CountryStatus, string> = {
                        documented: 'Terdokumentasi',
                        visited: 'Dikunjungi',
                        planned: 'Direncanakan',
                        interested: 'Diminati',
                        unknown: 'Belum Dijelajahi'
                      };
                      return (
                        <button
                          key={st}
                          onClick={() => onUpdateCountryStatus(inspectedCountry.code, st)}
                          className={`px-2 py-1 text-xs font-mono rounded border transition-colors cursor-pointer text-left ${
                            inspectedCountry.status === st
                              ? 'bg-earth-500/20 border-earth-400 text-earth-300 font-medium'
                              : 'bg-museum-card border-museum-border text-stone-400 hover:text-parchment-200'
                          }`}
                        >
                          {labels[st]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Linked Memories */}
                <div className="pt-2 border-t border-museum-border/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-400 uppercase">Rekaman Terarsip ({inspectedMemories.length})</span>
                    <button
                      onClick={() => onSelectCountry(inspectedCountry.code)}
                      className="text-earth-400 hover:text-earth-300 font-mono inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Halaman Lengkap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {inspectedMemories.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-2">
                      Belum ada memori yang dicatat untuk negara ini.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {inspectedMemories.map(mem => (
                        <div
                          key={mem.id}
                          onClick={() => onSelectMemory(mem.id)}
                          className="p-2.5 rounded bg-museum-card hover:bg-museum-hover border border-museum-border transition-colors cursor-pointer"
                        >
                          <div className="font-serif text-sm text-parchment-200 line-clamp-1">{mem.title}</div>
                          <div className="text-[11px] font-mono text-stone-400 flex items-center justify-between mt-1">
                            <span>{mem.placeName}</span>
                            <span>{mem.dateStart}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => onSelectCountry(inspectedCountry.code)}
                  >
                    Buka Halaman Negara
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-sm text-stone-400">
                Pilih negara pada peta untuk memeriksa rekamannya.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* MODE 3: NON-MAP CATALOG GRID */
        <div className="space-y-4">
          <div className="text-xs font-mono text-stone-400">
            MENAMPILKAN {filteredCountries.length} DARI {countries.length} NEGARA
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCountries.map(country => (
              <div
                key={country.code}
                onClick={() => onSelectCountry(country.code)}
                className="p-4 rounded-lg bg-museum-surface border border-museum-border hover:border-earth-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-earth-400 font-semibold">{country.code}</span>
                    <StatusBadge status={country.status} size="sm" />
                  </div>
                  <h3 className="font-serif text-base text-parchment-100">{country.name}</h3>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <span className="text-xs text-stone-400 font-mono">{country.continent}</span>
                    {country.capital && (
                      <span className="text-[11px] font-mono text-stone-300">
                        Ibu kota: <strong className="text-earth-300 font-normal">{country.capital}</strong>
                      </span>
                    )}
                  </div>
                  {searchResultsMap?.get(country.code)?.highlightDetail && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono text-earth-300 bg-earth-500/15 border border-earth-500/30 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-earth-400 shrink-0" />
                      <span className="line-clamp-1">{searchResultsMap.get(country.code)!.highlightDetail}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-museum-border/40 text-[11px] font-mono text-stone-400">
                  <span>{memories.filter(m => m.countryCode === country.code).length} Memori</span>
                  <span className="text-earth-400">Lihat →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
