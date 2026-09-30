import React, { useState, useMemo } from 'react';
import { Search, Globe, Filter } from 'lucide-react';
import { Country, CountryStatus, Memory } from '../../core/contracts';
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

  const filtered = useMemo(() => {
    return countries.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.code.toLowerCase().includes(search.toLowerCase());
      const matchContinent = continent === 'All' || c.continent === continent;
      const matchStatus = status === 'all' || c.status === status;
      return matchSearch && matchContinent && matchStatus;
    });
  }, [countries, search, continent, status]);

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
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama negara atau kode ISO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-museum-card border border-museum-border rounded-md pl-9 pr-4 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
          />
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(c => {
          const memCount = memories.filter(m => m.countryCode === c.code).length;
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
                <span className="text-[11px] font-mono text-stone-500 mt-1 block">{c.continent}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-museum-border/40 text-xs font-mono text-stone-400">
                <span>{memCount} Memori</span>
                <span className="text-earth-400 group-hover:translate-x-0.5 transition-transform">Dosir →</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
