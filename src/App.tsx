import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from './core/services/storageService';
import { Country, Memory, Souvenir, AtlasStats, CountryStatus } from './core/contracts';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './features/landing/LandingPage';
import { AtlasPage } from './features/atlas/AtlasPage';
import { CountryDetailPage } from './features/countries/CountryDetailPage';
import { CountriesCatalog } from './features/countries/CountriesCatalog';
import { MemoriesPage } from './features/memories/MemoriesPage';
import { MemoryDetailPage } from './features/memories/MemoryDetailPage';
import { MemoryFormModal } from './features/memories/MemoryFormModal';
import { SouvenirsPage } from './features/souvenirs/SouvenirsPage';
import { JournalPage } from './features/journal/JournalPage';
import { VideoTheaterPage } from './features/videos/VideoTheaterPage';
import { AboutPage } from './features/about/AboutPage';
import { BackupModal } from './features/backup/BackupModal';
import { PassportDossierModal } from './features/dossier/PassportDossierModal';
import { MuseumPage } from './features/museum/MuseumPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  // Modal state
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [prefilledCountryCode, setPrefilledCountryCode] = useState<string | undefined>(undefined);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  // Domain state
  const [countries, setCountries] = useState<Country[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [stats, setStats] = useState<AtlasStats>({
    totalCountriesDocumented: 0,
    totalCountriesVisited: 0,
    totalMemories: 0,
    totalPlaces: 0,
    totalPhotos: 0,
    totalSouvenirs: 0,
  });

  const reloadData = useCallback(() => {
    setCountries(storageService.getCountries());
    setMemories(storageService.getMemories());
    setSouvenirs(storageService.getSouvenirs());
    setStats(storageService.getStats());
  }, []);

  useEffect(() => {
    reloadData();
    const unsubscribe = storageService.subscribe(reloadData);
    return () => unsubscribe();
  }, [reloadData]);

  // Tab change resets sub-page drilldowns
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedCountryCode(null);
    setSelectedMemoryId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (code: string) => {
    setSelectedCountryCode(code);
    setSelectedMemoryId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMemory = (id: string) => {
    setSelectedMemoryId(id);
    setSelectedCountryCode(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewMemory = (prefillCountry?: string) => {
    setEditingMemory(null);
    setPrefilledCountryCode(prefillCountry);
    setIsMemoryModalOpen(true);
  };

  const handleOpenEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setPrefilledCountryCode(undefined);
    setIsMemoryModalOpen(true);
  };

  const handleSaveMemory = (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const saved = storageService.saveMemory(memoryData);
    reloadData();
    // Navigate to the saved memory
    setSelectedMemoryId(saved.id);
  };

  const handleDeleteMemory = (id: string) => {
    storageService.deleteMemory(id);
    reloadData();
    setSelectedMemoryId(null);
    setActiveTab('memories');
  };

  const handleUpdateCountryStatus = (code: string, status: CountryStatus) => {
    storageService.updateCountry(code, { status });
    reloadData();
  };

  const handleSaveSouvenir = (souvenirData: Omit<Souvenir, 'id'>) => {
    storageService.saveSouvenir(souvenirData);
    reloadData();
  };

  const handleDeleteSouvenir = (id: string) => {
    storageService.deleteSouvenir(id);
    reloadData();
  };

  // Render view router
  const renderContent = () => {
    // 1. Memory Detail view
    if (selectedMemoryId) {
      const memory = memories.find(m => m.id === selectedMemoryId);
      if (memory) {
        const country = countries.find(c => c.code === memory.countryCode);
        return (
          <MemoryDetailPage
            memory={memory}
            country={country}
            onBack={() => setSelectedMemoryId(null)}
            onEdit={handleOpenEditMemory}
            onDelete={handleDeleteMemory}
            onSelectCountry={handleSelectCountry}
          />
        );
      }
    }

    // 2. Country Detail view
    if (selectedCountryCode) {
      const country = countries.find(c => c.code === selectedCountryCode);
      if (country) {
        const countryMemories = memories.filter(m => m.countryCode === country.code);
        return (
          <CountryDetailPage
            country={country}
            memories={countryMemories}
            onBack={() => setSelectedCountryCode(null)}
            onSelectMemory={handleSelectMemory}
            onNewMemory={(cCode) => handleOpenNewMemory(cCode)}
            onUpdateCountryStatus={handleUpdateCountryStatus}
          />
        );
      }
    }

    // 3. Tab views
    switch (activeTab) {
      case 'home':
        return (
          <LandingPage
            featuredMemories={memories}
            stats={stats}
            onNavigate={handleSelectTab}
            onSelectMemory={handleSelectMemory}
            onSelectCountry={handleSelectCountry}
          />
        );

      case 'atlas':
        return (
          <AtlasPage
            countries={countries}
            memories={memories}
            onSelectCountry={handleSelectCountry}
            onSelectMemory={handleSelectMemory}
            onUpdateCountryStatus={handleUpdateCountryStatus}
          />
        );

      case 'memories':
        return (
          <MemoriesPage
            memories={memories}
            countries={countries}
            onSelectMemory={handleSelectMemory}
            onNewMemory={() => handleOpenNewMemory()}
          />
        );

      case 'countries':
        return (
          <CountriesCatalog
            countries={countries}
            memories={memories}
            onSelectCountry={handleSelectCountry}
          />
        );

      case 'souvenirs':
        return (
          <SouvenirsPage
            souvenirs={souvenirs}
            memories={memories}
            countries={countries}
            onSelectMemory={handleSelectMemory}
            onSelectCountry={handleSelectCountry}
            onSaveSouvenir={handleSaveSouvenir}
            onDeleteSouvenir={handleDeleteSouvenir}
          />
        );

      case 'journal':
        return (
          <JournalPage
            memories={memories}
            countries={countries}
            onSelectMemory={handleSelectMemory}
            onSelectCountry={handleSelectCountry}
            onNewMemory={() => handleOpenNewMemory()}
          />
        );

      case 'videos':
        return (
          <VideoTheaterPage
            memories={memories}
            countries={countries}
            onSelectCountry={handleSelectCountry}
            onSelectMemory={handleSelectMemory}
            onRefresh={reloadData}
          />
        );

      case 'about':
        return <AboutPage />;

      case 'museum':
        return <MuseumPage onSelectCountry={handleSelectCountry} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#EAE2D7] flex flex-col font-sans selection:bg-earth-500 selection:text-white">
      {/* Editorial Museum Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenNewMemory={() => handleOpenNewMemory()}
        onOpenPassport={() => setIsPassportModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className={`flex-1${activeTab === 'museum' ? '' : ' pt-8 pb-20 lg:pb-0'}`}>
        {renderContent()}
      </main>

      {/* Archival Footer */}
      <Footer
        onRefresh={reloadData}
        onOpenPassport={() => setIsPassportModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Memory Form Modal */}
      <MemoryFormModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onSave={handleSaveMemory}
        initialMemory={editingMemory}
        countries={countries}
        prefilledCountryCode={prefilledCountryCode}
      />

      {/* V2: Portable Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onSuccess={reloadData}
      />

      {/* V2: Passport & Travel Journal Dossier (Print / PDF) */}
      <PassportDossierModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        countries={countries}
        memories={memories}
        souvenirs={souvenirs}
        stats={stats}
      />
    </div>
  );
};
