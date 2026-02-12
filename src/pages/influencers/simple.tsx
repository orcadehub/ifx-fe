import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useInfluencersData } from '@/hooks/useInfluencersData';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import InfluencerList from '@/components/influencers/InfluencerList';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import FilterPanel from '@/components/influencers/FilterPanel';
import { useLocations } from '@/hooks/useLocations';
import { useNiches } from '@/hooks/useNiches';
import { useHashtags } from '@/hooks/useHashtags';

type Platform = {
  value: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  label: string;
};

const audienceCountries = [{ value: 'us', label: 'United States' }, { value: 'in', label: 'India' }] as const;
const audienceLanguages = [{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }] as const;
type AudienceCountry = typeof audienceCountries[number]['value'];
type AudienceLanguage = typeof audienceLanguages[number]['value'];

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const InfluencersPageSimple = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 1500000]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([0, 10]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform['value'][]>([]);
  const [selectedAudienceCountries, setSelectedAudienceCountries] = useState<AudienceCountry[]>([]);
  const [selectedAudienceLanguages, setSelectedAudienceLanguages] = useState<AudienceLanguage[]>([]);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [isAudienceCountryDropdownOpen, setIsAudienceCountryDropdownOpen] = useState(false);
  const [isAudienceLanguageDropdownOpen, setIsAudienceLanguageDropdownOpen] = useState(false);

  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    loading: loadingLocations
  } = useLocations();

  const {
    niches,
    selectedNiche,
    setSelectedNiche,
    loading: loadingNiches
  } = useNiches();

  const {
    selectedHashtags,
    setSelectedHashtags,
    addHashtag
  } = useHashtags();

  const {
    influencers,
    isLoading,
    selectedInfluencer,
    setSelectedInfluencer,
    loadInfluencerProfile,
    handleWishlistToggle
  } = useInfluencersData();

  useEffect(() => {
    if (selectedInfluencer?.id) {
      loadInfluencerProfile(selectedInfluencer.id);
    }
  }, [selectedInfluencer?.id]);

  useEffect(() => {
    if (id && influencers.length > 0) {
      const influencer = influencers.find(inf => inf.id === id);
      if (influencer) {
        setSelectedInfluencer(influencer);
      }
    }
  }, [id, influencers]);

  const resetFilters = () => {
    setSearchTerm('');
    setFollowerRange([0, 1500000]);
    setEngagementRange([0, 10]);
    setPriceRange([0, 5000]);
    setSelectedType('');
    setSelectedGender('');
    setSelectedAge('');
    setSelectedPlatforms([]);
    setSelectedAudienceCountries([]);
    setSelectedAudienceLanguages([]);
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedNiche('');
    setSelectedHashtags([]);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const filteredInfluencers = influencers.filter(inf => {
    // Search term
    if (searchTerm && !(inf.name?.toLowerCase().includes(searchTerm.toLowerCase()) || inf.category?.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Location filters
    if (selectedCountry && inf.country?.name !== selectedCountry) return false;
    if (selectedState && inf.state?.name !== selectedState) return false;
    if (selectedCity && inf.city?.name !== selectedCity) return false;
    
    // Niche filter
    if (selectedNiche && inf.niche?.name !== selectedNiche) return false;
    
    // Content type filter
    if (selectedType && inf.category !== selectedType) return false;
    
    // Gender filter
    if (selectedGender && inf.gender !== selectedGender) return false;
    
    // Age filter
    if (selectedAge) {
      const age = inf.age || 0;
      if (selectedAge === '18-25' && (age < 18 || age > 25)) return false;
      if (selectedAge === '26-35' && (age < 26 || age > 35)) return false;
      if (selectedAge === '36-45' && (age < 36 || age > 45)) return false;
      if (selectedAge === '46+' && age < 46) return false;
    }
    
    // Engagement rate filter
    const engRate = inf.engagement_rate || 0;
    if (engRate < engagementRange[0] || engRate > engagementRange[1]) return false;
    
    // Follower count filter
    const totalFollowers = (inf.data?.instagram?.total_followers || 0) +
                          (inf.data?.facebook?.total_followers || 0) +
                          (inf.data?.youtube?.total_followers || 0) +
                          (inf.data?.twitter?.total_followers || 0);
    if (totalFollowers < followerRange[0] || totalFollowers > followerRange[1]) return false;
    
    // Platform filter
    if (selectedPlatforms.length > 0) {
      const hasPlatform = selectedPlatforms.some(platform => {
        const followers = inf.data?.[platform]?.total_followers || 0;
        return followers > 0;
      });
      if (!hasPlatform) return false;
    }
    
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Influencers</h1>
            <Button onClick={() => setIsFilterOpen(true)}>Filters</Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCountry && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Country: {countries.find(c => c.isoCode === selectedCountry)?.name}
                <button onClick={() => setSelectedCountry('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedState && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                State: {states.find(s => s.isoCode === selectedState)?.name}
                <button onClick={() => setSelectedState('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                City: {selectedCity}
                <button onClick={() => setSelectedCity('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedNiche && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Niche: {selectedNiche}
                <button onClick={() => setSelectedNiche('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Type: {selectedType}
                <button onClick={() => setSelectedType('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedGender && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedAge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Age: {selectedAge}
                <button onClick={() => setSelectedAge('')} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {(engagementRange[0] > 0 || engagementRange[1] < 10) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Engagement: {engagementRange[0]}%-{engagementRange[1]}%
                <button onClick={() => setEngagementRange([0, 10])} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {(followerRange[0] > 0 || followerRange[1] < 1500000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Followers: {formatNumber(followerRange[0])}-{formatNumber(followerRange[1])}
                <button onClick={() => setFollowerRange([0, 1500000])} className="ml-1 hover:text-primary/80">×</button>
              </span>
            )}
            {selectedPlatforms.length > 0 && selectedPlatforms.map(platform => (
              <span key={platform} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Platform: {platform}
                <button onClick={() => setSelectedPlatforms(prev => prev.filter(p => p !== platform))} className="ml-1 hover:text-primary/80">×</button>
              </span>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <InfluencerList
                  influencers={filteredInfluencers}
                  selectedInfluencer={selectedInfluencer}
                  onInfluencerClick={setSelectedInfluencer}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  loading={isLoading}
                  isInitialLoad={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                {selectedInfluencer ? (
                  <InfluencerProfile
                    influencer={selectedInfluencer}
                    onWishlistToggle={() => handleWishlistToggle(selectedInfluencer.id)}
                    onBook={() => navigate('/orders/place', { state: { selected: selectedInfluencer } })}
                  />
                ) : (
                  <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-center h-96">
                    <p className="text-muted-foreground">Select an influencer to view their profile</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        followerRange={followerRange}
        setFollowerRange={setFollowerRange}
        engagementRange={engagementRange}
        setEngagementRange={setEngagementRange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedAge={selectedAge}
        setSelectedAge={setSelectedAge}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        selectedAudienceCountries={selectedAudienceCountries}
        setSelectedAudienceCountries={setSelectedAudienceCountries}
        selectedAudienceLanguages={selectedAudienceLanguages}
        setSelectedAudienceLanguages={setSelectedAudienceLanguages}
        isPlatformDropdownOpen={isPlatformDropdownOpen}
        setIsPlatformDropdownOpen={setIsPlatformDropdownOpen}
        isAudienceCountryDropdownOpen={isAudienceCountryDropdownOpen}
        setIsAudienceCountryDropdownOpen={setIsAudienceCountryDropdownOpen}
        isAudienceLanguageDropdownOpen={isAudienceLanguageDropdownOpen}
        setIsAudienceLanguageDropdownOpen={setIsAudienceLanguageDropdownOpen}
        countries={countries}
        states={states}
        cities={cities}
        niches={niches}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedNiche={selectedNiche}
        setSelectedNiche={setSelectedNiche}
        selectedHashtags={selectedHashtags}
        setSelectedHashtags={setSelectedHashtags}
        addHashtag={addHashtag}
        loadingLocations={loadingLocations}
        loadingNiches={loadingNiches}
        onResetFilters={resetFilters}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default InfluencersPageSimple;
