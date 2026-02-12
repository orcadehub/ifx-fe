import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import HashtagInput from '@/components/filters/HashtagInput';
import RangeSlider from '@/components/filters/RangeSlider';

type Platform = {
  value: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  label: string;
  icon: React.ElementType;
};

const platforms: Platform[] = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
];

const audienceCountries = [
  { value: 'us', label: 'United States' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'id', label: 'Indonesia' },
  { value: 'mx', label: 'Mexico' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'ph', label: 'Philippines' },
  { value: 'tr', label: 'Turkey' },
  { value: 'eg', label: 'Egypt' },
] as const;

const audienceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'ko', label: 'Korean' },
] as const;

type AudienceCountry = typeof audienceCountries[number]['value'];
type AudienceLanguage = typeof audienceLanguages[number]['value'];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
  followerRange: [number, number];
  setFollowerRange: (range: [number, number]) => void;
  engagementRange: [number, number];
  setEngagementRange: (range: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  selectedAge: string;
  setSelectedAge: (age: string) => void;
  selectedPlatforms: Platform['value'][];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<Platform['value'][]>>;
  selectedAudienceCountries: AudienceCountry[];
  setSelectedAudienceCountries: React.Dispatch<React.SetStateAction<AudienceCountry[]>>;
  selectedAudienceLanguages: AudienceLanguage[];
  setSelectedAudienceLanguages: React.Dispatch<React.SetStateAction<AudienceLanguage[]>>;
  isPlatformDropdownOpen: boolean;
  setIsPlatformDropdownOpen: (open: boolean) => void;
  isAudienceCountryDropdownOpen: boolean;
  setIsAudienceCountryDropdownOpen: (open: boolean) => void;
  isAudienceLanguageDropdownOpen: boolean;
  setIsAudienceLanguageDropdownOpen: (open: boolean) => void;
  countries: any[];
  states: any[];
  cities: any[];
  niches: any[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  selectedHashtags: string[];
  setSelectedHashtags: (hashtags: string[]) => void;
  addHashtag: (hashtag: string) => void;
  loadingLocations: boolean;
  loadingNiches: boolean;
  onResetFilters: () => void;
  formatNumber: (num: number) => string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  followerRange,
  setFollowerRange,
  engagementRange,
  setEngagementRange,
  priceRange,
  setPriceRange,
  selectedType,
  setSelectedType,
  selectedGender,
  setSelectedGender,
  selectedAge,
  setSelectedAge,
  selectedPlatforms,
  setSelectedPlatforms,
  selectedAudienceCountries,
  setSelectedAudienceCountries,
  selectedAudienceLanguages,
  setSelectedAudienceLanguages,
  isPlatformDropdownOpen,
  setIsPlatformDropdownOpen,
  isAudienceCountryDropdownOpen,
  setIsAudienceCountryDropdownOpen,
  isAudienceLanguageDropdownOpen,
  setIsAudienceLanguageDropdownOpen,
  countries,
  states,
  cities,
  niches,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedNiche,
  setSelectedNiche,
  selectedHashtags,
  setSelectedHashtags,
  addHashtag,
  loadingLocations,
  loadingNiches,
  onResetFilters,
  formatNumber
}) => {
  const handlePlatformSelect = (platform: Platform['value']) => {
    setSelectedPlatforms((prev: Platform['value'][]) => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[400px] bg-background shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onResetFilters}>Reset Filters</Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Location</h3>
            <div className="grid grid-cols-3 gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : countries.map(country => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState} disabled={!selectedCountry || loadingLocations}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : states.map(state => (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState || loadingLocations}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : cities.map(city => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium mb-2">Niche</h3>
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Niche" />
                </SelectTrigger>
                <SelectContent>
                  {loadingNiches ? <SelectItem value="loading" disabled>Loading...</SelectItem> : niches.map(niche => (
                    <SelectItem key={niche} value={niche}>
                      {niche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Content Type</h3>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium mb-2">Engagement Rate</h3>
            <div className="px-2">
              <RangeSlider label="" min={0} value={engagementRange} max={10} step={0.1} onChange={setEngagementRange} formatValue={value => `${value}%`} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium mb-2">Follower Count</h3>
            <div className="px-2">
              <RangeSlider label="" min={0} value={followerRange} max={1500000} step={10000} onChange={setFollowerRange} formatValue={value => formatNumber(value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Popover open={isPlatformDropdownOpen} onOpenChange={setIsPlatformDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPlatformDropdownOpen}
                  className="w-full justify-between"
                >
                  {selectedPlatforms.length > 0
                    ? `${selectedPlatforms.length} selected`
                    : "Select platforms"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="py-1">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div
                        key={platform.value}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                        onClick={() => handlePlatformSelect(platform.value)}
                      >
                        <Checkbox
                          checked={selectedPlatforms.includes(platform.value)}
                          onCheckedChange={() => handlePlatformSelect(platform.value)}
                          className="mr-2"
                        />
                        <Icon className="h-4 w-4" />
                        <span>{platform.label}</span>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" className="w-1/2" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
              <Input type="number" placeholder="Max" className="w-1/2" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
            </div>
          </div>

          <div className="space-y-2">
            <HashtagInput label="Hashtags" tags={selectedHashtags} onChange={setSelectedHashtags} placeholder="Enter hashtags" onAddHashtag={addHashtag} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium mb-2">Age</h3>
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="13-17">13-17</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45+">45+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Gender</h3>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Top Audience Countries</label>
            <Popover open={isAudienceCountryDropdownOpen} onOpenChange={setIsAudienceCountryDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isAudienceCountryDropdownOpen}
                  className="w-full justify-between"
                >
                  {selectedAudienceCountries.length > 0
                    ? `${selectedAudienceCountries.length} selected`
                    : "Select audience countries"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="py-1">
                  {audienceCountries.map((country) => (
                    <div
                      key={country.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedAudienceCountries((prev: AudienceCountry[]) =>
                          prev.includes(country.value)
                            ? prev.filter(c => c !== country.value)
                            : [...prev, country.value]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedAudienceCountries.includes(country.value)}
                        onCheckedChange={() => {
                          setSelectedAudienceCountries((prev: AudienceCountry[]) =>
                            prev.includes(country.value)
                              ? prev.filter(c => c !== country.value)
                              : [...prev, country.value]
                          );
                        }}
                        className="mr-2"
                      />
                      <span>{country.label}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Audience Languages</label>
            <Popover open={isAudienceLanguageDropdownOpen} onOpenChange={setIsAudienceLanguageDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isAudienceLanguageDropdownOpen}
                  className="w-full justify-between"
                >
                  {selectedAudienceLanguages.length > 0
                    ? `${selectedAudienceLanguages.length} selected`
                    : "Select audience languages"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="py-1">
                  {audienceLanguages.map((language) => (
                    <div
                      key={language.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedAudienceLanguages((prev: AudienceLanguage[]) =>
                          prev.includes(language.value)
                            ? prev.filter(l => l !== language.value)
                            : [...prev, language.value]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedAudienceLanguages.includes(language.value)}
                        onCheckedChange={() => {
                          setSelectedAudienceLanguages((prev: AudienceLanguage[]) =>
                            prev.includes(language.value)
                              ? prev.filter(l => l !== language.value)
                              : [...prev, language.value]
                          );
                        }}
                        className="mr-2"
                      />
                      <span>{language.label}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onApply?.(); onClose(); }}>Update</Button>
      </div>
    </div>
  );
};

export default FilterPanel;
