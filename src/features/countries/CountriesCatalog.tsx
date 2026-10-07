import React, { useState, useMemo } from 'react';
import { Search, Globe, Filter, Sparkles, X } from 'lucide-react';
import { Country, CountryStatus, Memory } from '../../core/contracts';
import { countryRegistry, SearchMatch } from '../../atlas/countries/countryRegistry';
import { StatusBadge } from '../../components/ui/Badge';

interface CountriesCatalogProps {
  countries: Country[];
  memories: Memory[];
  onSelectCountry: (code: string) => void;
}

export const CountriesCatalog: React.FC<CountriesCatalogProps> = ({
  countries,
  memories,
  onSelectCountry,
}) => {
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('All');
  const [status, setStatus] = useState<CountryStatus | 'all'>('all');

  const continents = [
    { label: 'Semua', value: 'All' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Eropa', value: 'Europe' },
    { label: 'Afrika', value: 'Africa' },
    { label: 'Amerika Utara', value: 'North America' },
    { label: 'Amerika Selatan', value: 'South America' },
    { label: 'Oseania', value: 'Oceania' },
  ];

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    return countryRegistry.search(search, 195);
  }, [search]);

  const searchResultsMap = useMemo(() => {
    if (!searchResults) return null;
    const map = new Map<string, SearchMatch>();
    searchResults.forEach(m => map.set(m.country.id.toUpperCase(), m));
    return map;
  }, [searchResults]);

  const filtered = useMemo(() => {
    if (!searchResults) {
      return countries.filter(c => {
        const matchContinent = continent === 'All' || c.continent === continent;
        const matchStatus = status === 'all' || c.status === status;
        return matchContinent && matchStatus;
      });
    }

    const countryByCode = new Map(countries.map(c => [c.code.toUpperCase(), c]));
    const matchedList: Country[] = [];

    for (const match of searchResults) {
      const c = countryByCode.get(match.country.id.toUpperCase());
      if (!c) continue;
      const matchContinent = continent === 'All' || c.continent === continent;
      const matchStatus = status === 'all' || c.status === status;
      if (matchContinent && matchStatus) {
        matchedList.push({
          ...c,
          capital: c.capital || match.country.capital,
          officialName: c.officialName || match.country.officialName,
        });
      }
    }
    return matchedList;
  }, [countries, searchResults, continent, status]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="border-b border-museum-border pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
          <Globe className="w-3.5 h-3.5" />
          <span>KATALOG GLOBAL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100">
          Katalog Negara Dunia
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Jelajahi dan atur destinasi berdasarkan status perjalanan dan benua geografis.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-museum-surface/80 p-4 rounded-xl border border-museum-border">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari negara, ibu kota (misal: Bandar Seri Begawan), atau ISO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-museum-card border border-museum-border rounded-md pl-9 pr-8 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-parchment-100 p-0.5 rounded cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {continents.map(cont => (
            <button
              key={cont.value}
              onClick={() => setContinent(cont.value)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                continent === cont.value
                  ? 'bg-earth-500 text-white font-medium'
                  : 'text-stone-400 hover:text-parchment-200 hover:bg-white/5'
              }`}
            >
              {cont.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={status}
            onChange={e => setStatus(e.target.value as CountryStatus | 'all')}
            className="w-full sm:w-auto bg-museum-card border border-museum-border rounded-md px-3 py-1.5 text-xs text-parchment-200 focus:outline-none focus:border-earth-500/50 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="documented">Didokumentasikan</option>
            <option value="visited">Pernah Dikunjungi</option>
            <option value="planned">Direncanakan</option>
            <option value="interested">Diminati</option>
            <option value="unknown">Belum Dijelajahi</option>
          </select>
        </div>
      </div>

      {/* Search match stats */}
      {search.trim() && (
        <div className="flex items-center justify-between text-xs font-mono px-1 text-stone-400">
          <span>
            Hasil pencarian untuk <span className="text-earth-300 font-semibold">"{search}"</span>: {filtered.length} negara ditemukan
          </span>
          <button
            onClick={() => setSearch('')}
            className="text-earth-400 hover:text-earth-300 underline cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Grid or Empty State */}
      {search.trim() && filtered.length === 0 ? (
        <div className="bg-museum-surface/90 border border-museum-border rounded-xl p-12 text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-museum-card border border-museum-border flex items-center justify-center mx-auto text-stone-500">
            <Search className="w-6 h-6 text-earth-400" />
          </div>
          <h3 className="font-serif text-xl text-parchment-100">
            Tidak ada negara yang cocok
          </h3>
          <p className="text-sm text-stone-400 font-sans">
            Pencarian untuk <span className="font-mono text-parchment-200 bg-white/5 px-2 py-0.5 rounded">"{search}"</span> tidak menemukan hasil.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSearch('')}
              className="text-xs font-mono text-earth-400 hover:text-earth-300 underline cursor-pointer"
            >
              Bersihkan Filter & Pencarian
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(c => {
            const memCount = memories.filter(m => m.countryCode === c.code).length;
            const highlight = searchResultsMap?.get(c.code)?.highlightDetail;
            return (
              <div
                key={c.code}
                onClick={() => onSelectCountry(c.code)}
                className="p-5 rounded-xl bg-museum-surface border border-museum-border hover:border-earth-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-earth-400 font-semibold">{c.code}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h3 className="font-serif text-lg text-parchment-100 group-hover:text-earth-300 transition-colors">
                    {c.name}
                  </h3>
                  {c.nativeName && (
                    <span className="text-xs text-stone-400 font-light block">{c.nativeName}</span>
                  )}
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[11px] font-mono text-stone-500 block">{c.continent}</span>
                    {c.capital && (
                      <span className="text-[11px] font-mono text-stone-400">
                        Ibu kota: <strong className="text-earth-300 font-normal">{c.capital}</strong>
                      </span>
                    )}
                  </div>
                  {highlight && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono text-earth-300 bg-earth-500/15 border border-earth-500/30 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-earth-400 shrink-0" />
                      <span className="line-clamp-1">{highlight}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-museum-border/40 text-xs font-mono text-stone-400">
                  <span>{memCount} Memori</span>
                  <span className="text-earth-400 group-hover:translate-x-0.5 transition-transform">Dosir →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
