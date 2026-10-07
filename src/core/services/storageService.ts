import { Country, Memory, Souvenir, AtlasStats } from '../contracts';
import { INITIAL_COUNTRIES } from '../../data/countries';
import { SEED_MEMORIES, INITIAL_UPDATED_COUNTRIES } from '../../data/seedData';
import { CANONICAL_COUNTRIES } from '../../atlas/countries/canonicalCountries';
import { mediaStore } from './mediaStore';

const STORAGE_KEYS = {
  COUNTRIES: 'project_atlas_countries_v1',
  MEMORIES: 'project_atlas_memories_v1',
  SOUVENIRS: 'project_atlas_souvenirs_v1',
  INITIALIZED: 'project_atlas_initialized_v1',
};

class StorageService {
  private countries: Country[] = [];
  private memories: Memory[] = [];
  private souvenirs: Souvenir[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      
      if (!isInitialized) {
        // First boot: populate initial data
        this.resetToCuratedSeed();
      } else {
        // Load existing data
        const storedCountries = localStorage.getItem(STORAGE_KEYS.COUNTRIES);
        const storedMemories = localStorage.getItem(STORAGE_KEYS.MEMORIES);
        const storedSouvenirs = localStorage.getItem(STORAGE_KEYS.SOUVENIRS);

        const loadedCountries: Country[] = storedCountries ? JSON.parse(storedCountries) : [];
        const masterList = this.buildInitialCountries();
        
        // Merge so existing saved statuses & memories are preserved, but all 195 countries exist
        const countryMap = new Map<string, Country>();
        masterList.forEach(c => countryMap.set(c.code.toUpperCase(), c));
        loadedCountries.forEach(saved => {
          const base = countryMap.get(saved.code.toUpperCase());
          if (base) {
            countryMap.set(saved.code.toUpperCase(), {
              ...base,
              ...saved,
              capital: base.capital || saved.capital,
              officialName: base.officialName || saved.officialName,
              name: base.name, // Prefer Indonesian official name
              continent: base.continent,
            });
          } else {
            countryMap.set(saved.code.toUpperCase(), saved);
          }
        });

        this.countries = Array.from(countryMap.values());
        this.memories = storedMemories ? JSON.parse(storedMemories) : [];
        this.souvenirs = storedSouvenirs ? JSON.parse(storedSouvenirs) : [];

        // If countries count changed to 195, save immediately
        if (loadedCountries.length !== this.countries.length) {
          this.save();
        }
      }
    } catch (err) {
      console.warn('Storage read error, using safe fallback defaults:', err);
      this.countries = this.buildInitialCountries();
      this.memories = [...SEED_MEMORIES];
      this.souvenirs = [];
    }
  }

  private buildInitialCountries(): Country[] {
    const canonicalMap = new Map(CANONICAL_COUNTRIES.map(c => [c.id.toUpperCase(), c]));
    return INITIAL_COUNTRIES.map(base => {
      const canonical = canonicalMap.get(base.code.toUpperCase());
      const update = INITIAL_UPDATED_COUNTRIES[base.code];
      const merged: Country = {
        ...base,
        capital: canonical?.capital || '',
        officialName: canonical?.officialName || '',
      };
      return update ? { ...merged, ...update } : merged;
    });
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNTRIES, JSON.stringify(this.countries));
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(this.memories));
      localStorage.setItem(STORAGE_KEYS.SOUVENIRS, JSON.stringify(this.souvenirs));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } catch (err) {
      console.error('Failed to write to local storage:', err);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Countries ---
  public getCountries(): Country[] {
    return [...this.countries];
  }

  public getCountryByCode(code: string): Country | undefined {
    return this.countries.find(c => c.code.toUpperCase() === code.toUpperCase());
  }

  public updateCountry(code: string, updates: Partial<Country>): Country | null {
    const index = this.countries.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
    if (index === -1) return null;

    this.countries[index] = { ...this.countries[index], ...updates };
    this.save();
    return this.countries[index];
  }

  // --- Memories ---
  public getMemories(): Memory[] {
    return [...this.memories].sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
  }

  public getMemoryById(id: string): Memory | undefined {
    return this.memories.find(m => m.id === id);
  }

  public getMemoriesByCountry(countryCode: string): Memory[] {
    return this.memories
      .filter(m => m.countryCode.toUpperCase() === countryCode.toUpperCase())
      .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
  }

  public saveMemory(memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Memory {
    const now = new Date().toISOString();
    let memory: Memory;

    if (memoryData.id) {
      // Update existing
      const existingIndex = this.memories.findIndex(m => m.id === memoryData.id);
      if (existingIndex >= 0) {
        memory = {
          ...this.memories[existingIndex],
          ...memoryData,
          id: memoryData.id,
          updatedAt: now
        };
        this.memories[existingIndex] = memory;
      } else {
        memory = {
          ...memoryData,
          id: memoryData.id,
          createdAt: now,
          updatedAt: now
        };
        this.memories.push(memory);
      }
    } else {
      // Create new
      memory = {
        ...memoryData,
        id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: now,
        updatedAt: now
      };
      this.memories.push(memory);
    }

    // Auto-update country documented status if not yet documented
    const country = this.getCountryByCode(memory.countryCode);
    if (country) {
      const placesCount = new Set(
        this.memories.filter(m => m.countryCode === country.code).map(m => m.placeName)
      ).size;

      this.updateCountry(country.code, {
        status: 'documented',
        documentedPlacesCount: placesCount
      });
    }

    this.save();
    return memory;
  }

  public deleteMemory(id: string): boolean {
    const target = this.memories.find(m => m.id === id);
    if (!target) return false;

    this.memories = this.memories.filter(m => m.id !== id);

    // Recompute country place count
    const remainingForCountry = this.memories.filter(m => m.countryCode === target.countryCode);
    if (remainingForCountry.length === 0) {
      const country = this.getCountryByCode(target.countryCode);
      if (country && country.status === 'documented') {
        this.updateCountry(country.code, {
          status: 'visited',
          documentedPlacesCount: 0
        });
      }
    }

    this.save();
    return true;
  }

  // --- Souvenirs ---
  public getSouvenirs(): Souvenir[] {
    // Gather independent souvenirs plus embedded ones from memories
    const embedded = this.memories.flatMap(m => m.souvenirs || []);
    const standaloneIds = new Set(this.souvenirs.map(s => s.id));
    const uniqueEmbedded = embedded.filter(s => !standaloneIds.has(s.id));
    return [...this.souvenirs, ...uniqueEmbedded];
  }

  public saveSouvenir(souvenirData: Omit<Souvenir, 'id'> & { id?: string }): Souvenir {
    const id = souvenirData.id || `souv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const souvenir: Souvenir = { ...souvenirData, id };

    const existingIndex = this.souvenirs.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      this.souvenirs[existingIndex] = souvenir;
    } else {
      this.souvenirs.unshift(souvenir);
    }

    // Auto mark country visited if unknown
    const country = this.getCountryByCode(souvenir.countryCode);
    if (country && country.status === 'unknown') {
      this.updateCountry(country.code, { status: 'visited' });
    }

    this.save();
    return souvenir;
  }

  public deleteSouvenir(id: string): boolean {
    this.souvenirs = this.souvenirs.filter(s => s.id !== id);
    this.memories.forEach(m => {
      if (m.souvenirs) {
        m.souvenirs = m.souvenirs.filter(s => s.id !== id);
      }
    });
    this.save();
    return true;
  }

  // --- Statistics ---
  public getStats(): AtlasStats {
    const documentedCountries = this.countries.filter(c => c.status === 'documented').length;
    const visitedCountries = this.countries.filter(c => c.status === 'visited' || c.status === 'documented').length;
    const places = new Set(this.memories.map(m => `${m.countryCode}-${m.placeName}`));
    const photos = this.memories.reduce((acc, m) => acc + (m.mediaReferences?.length || 0), 0);
    const souvenirs = this.getSouvenirs().length;

    return {
      totalCountriesDocumented: documentedCountries,
      totalCountriesVisited: visitedCountries,
      totalMemories: this.memories.length,
      totalPlaces: places.size,
      totalPhotos: photos,
      totalSouvenirs: souvenirs,
    };
  }

  // --- V2: Backup & Restore with Atomic Staging & Rollback Protection ---
  public async createBackupArchive(options: { includeMedia?: boolean } = { includeMedia: true }): Promise<string> {
    let mediaBlobs: Array<{ id: string; name: string; mimeType: string; dataUrl: string }> | undefined = undefined;
    if (options.includeMedia && typeof window !== 'undefined') {
      try {
        const exported = await mediaStore.exportAllMediaBlobs();
        if (exported.length > 0) {
          mediaBlobs = exported;
        }
      } catch (err) {
        console.warn('Could not export media blobs for archive:', err);
      }
    }

    const backup = {
      version: '2.1',
      exportedAt: new Date().toISOString(),
      appName: 'Project Atlas',
      stats: this.getStats(),
      countries: this.countries.filter(c => c.status !== 'unknown'),
      memories: this.memories,
      souvenirs: this.souvenirs,
      mediaBlobs,
    };
    return JSON.stringify(backup, null, 2);
  }

  public async importBackupArchive(
    rawJson: string,
    mode: 'merge' | 'replace' = 'merge'
  ): Promise<{ memoriesCount: number; countriesCount: number; mediaCount: number }> {
    // Step 1: Parse
    let data: any;
    try {
      data = JSON.parse(rawJson);
    } catch {
      throw new Error('Format arsip tidak valid: Gagal mem-parse JSON.');
    }

    // Step 2: Validate Schema & Constraints
    if (!data || typeof data !== 'object') {
      throw new Error('Format arsip tidak valid: Payload kosong atau bukan objek.');
    }
    if (!data.memories || !Array.isArray(data.memories)) {
      throw new Error('Format arsip tidak valid: Array memories tidak ditemukan.');
    }

    // Validate memory records
    for (const mem of data.memories) {
      if (!mem || typeof mem !== 'object') {
        throw new Error('Format arsip tidak valid: Terdapat memori yang korup.');
      }
      if (typeof mem.countryCode !== 'string' || !mem.countryCode) {
        throw new Error('Format arsip tidak valid: Memori kehilangan kode negara.');
      }
    }

    // Step 3: Safety Checkpoint (In-memory transaction snapshot)
    const originalCountries = JSON.parse(JSON.stringify(this.countries));
    const originalMemories = JSON.parse(JSON.stringify(this.memories));
    const originalSouvenirs = JSON.parse(JSON.stringify(this.souvenirs));

    try {
      // Step 4: Stage Changes
      let stagedCountries: Country[];
      let stagedMemories: Memory[];
      let stagedSouvenirs: Souvenir[];

      if (mode === 'replace') {
        stagedCountries = this.buildInitialCountries().map(c => ({ ...c, status: 'unknown' as const }));
        stagedMemories = [...data.memories];
        stagedSouvenirs = Array.isArray(data.souvenirs) ? [...data.souvenirs] : [];

        if (data.countries && Array.isArray(data.countries)) {
          data.countries.forEach((incoming: Country) => {
            if (!incoming || !incoming.code) return;
            const idx = stagedCountries.findIndex(c => c.code.toUpperCase() === incoming.code.toUpperCase());
            if (idx >= 0) {
              stagedCountries[idx] = { ...stagedCountries[idx], ...incoming };
            }
          });
        }
      } else {
        // Merge mode
        stagedCountries = JSON.parse(JSON.stringify(this.countries));
        stagedMemories = [...this.memories];
        stagedSouvenirs = [...this.souvenirs];

        const existingMemIds = new Set(stagedMemories.map(m => m.id));
        for (const incomingMem of data.memories) {
          if (!existingMemIds.has(incomingMem.id)) {
            stagedMemories.push(incomingMem);
            existingMemIds.add(incomingMem.id);
          }
        }

        if (data.countries && Array.isArray(data.countries)) {
          data.countries.forEach((incoming: Country) => {
            if (!incoming || !incoming.code) return;
            const idx = stagedCountries.findIndex(c => c.code.toUpperCase() === incoming.code.toUpperCase());
            if (idx >= 0) {
              stagedCountries[idx] = { ...stagedCountries[idx], ...incoming };
            }
          });
        }

        if (data.souvenirs && Array.isArray(data.souvenirs)) {
          const existingSouvIds = new Set(stagedSouvenirs.map(s => s.id));
          for (const s of data.souvenirs) {
            if (!existingSouvIds.has(s.id)) {
              stagedSouvenirs.push(s);
              existingSouvIds.add(s.id);
            }
          }
        }
      }

      // Step 5: Restore Media Blobs if present
      let importedMediaCount = 0;
      if (Array.isArray(data.mediaBlobs) && data.mediaBlobs.length > 0 && typeof window !== 'undefined') {
        try {
          importedMediaCount = await mediaStore.importMediaBlobs(data.mediaBlobs);
        } catch (mediaErr) {
          console.warn('Gagal memulihkan sebagian media blob:', mediaErr);
        }
      }

      // Step 6: Commit Transaction to Production State
      this.countries = stagedCountries;
      this.memories = stagedMemories;
      this.souvenirs = stagedSouvenirs;
      this.save();

      return {
        memoriesCount: this.memories.length,
        countriesCount: this.countries.filter(c => c.status === 'documented').length,
        mediaCount: importedMediaCount,
      };
    } catch (transactionErr) {
      // Step 7: Rollback to Safety Checkpoint on failure
      this.countries = originalCountries;
      this.memories = originalMemories;
      this.souvenirs = originalSouvenirs;
      this.save();
      throw transactionErr;
    }
  }

  // --- Admin / Diagnostics ---
  public resetToCuratedSeed() {
    this.countries = this.buildInitialCountries();
    this.memories = [...SEED_MEMORIES];
    this.souvenirs = [];
    this.save();
  }

  public clearAllToEmpty() {
    this.countries = INITIAL_COUNTRIES.map(c => ({ ...c, status: 'unknown' }));
    this.memories = [];
    this.souvenirs = [];
    this.save();
  }
}

export const storageService = new StorageService();
