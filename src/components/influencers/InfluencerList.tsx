
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Twitter, Youtube, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Influencer } from '@/types/location';

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '0';
  if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const InfluencerListItem = ({
  influencer,
  isSelected,
  onClick
}: {
  influencer: Influencer;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const getFollowerCount = (platform: 'instagram' | 'facebook' | 'twitter' | 'youtube') => {
    return influencer.data?.[platform]?.total_followers || influencer[`followers_${platform}`] || 0;
  };

  return (
    <div 
      onClick={onClick} 
      className={`flex items-start gap-3 p-2 mb-2 rounded transition-all cursor-pointer hover:bg-accent/50 ${isSelected ? 'bg-accent' : 'bg-card'}`}
      style={{ minHeight: '70px' }}
    >
      <img
        src={influencer.profilePic || influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'}
        alt={influencer.name}
        className={`rounded-full border-2 border-yellow-500 object-cover ${influencer.is_blurred ? 'blur-sm' : ''}`}
        style={{ width: '50px', height: '50px', marginTop: '4px' }}
      />
      <div className="flex-1 w-full">
        <div className="font-medium text-foreground text-sm">
          {influencer.username || influencer.name}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {influencer.niche?.name || influencer.category || 'N/A'}
        </div>
        <div className="flex justify-between flex-wrap gap-3 text-foreground">
          <span className="flex items-center gap-1 text-[10px]">
            <Instagram className="h-3.5 w-3.5" style={{ color: '#E1306C' }} />
            <span>{formatNumber(getFollowerCount('instagram'))}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <Facebook className="h-3.5 w-3.5" style={{ color: '#1877F2' }} />
            <span>{formatNumber(getFollowerCount('facebook'))}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <Twitter className="h-3.5 w-3.5" style={{ color: '#1DA1F2' }} />
            <span>{formatNumber(getFollowerCount('twitter'))}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <Youtube className="h-3.5 w-3.5" style={{ color: '#FF0000' }} />
            <span>{formatNumber(getFollowerCount('youtube'))}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const InfluencerListSkeleton = () => {
  return (
    <div className="space-y-3 px-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface InfluencerListProps {
  influencers: Influencer[];
  selectedInfluencer: Influencer | null;
  onInfluencerClick: (influencer: Influencer) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
  isInitialLoad: boolean;
}

const InfluencerList: React.FC<InfluencerListProps> = ({
  influencers,
  selectedInfluencer,
  onInfluencerClick,
  searchTerm,
  onSearchChange,
  loading,
  isInitialLoad
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  return (
    <div className="md:col-span-1 h-full flex flex-col">
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden h-full flex flex-col">
        <div className="p-3">
          <div className="relative">
            <Input 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-9 border-border rounded-xl text-sm" 
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <style>{`
          @media (min-width: 1080px) {
            .mobile-accordion {
              display: none !important;
            }
          }
          @media (max-width: 1080px) {
            .desktop-cards {
              display: none !important;
            }
          }
        `}</style>

        {/* Mobile Accordion View */}
        <div className="mobile-accordion px-3">
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-accent transition-colors"
            >
              <span className="font-medium text-foreground">
                Influencers ({influencers.length})
              </span>
              {isAccordionOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {isAccordionOpen && (
              <div className="border-t border-border">
                <div className="overflow-y-auto max-h-[60vh]">
                  {isInitialLoad ? <InfluencerListSkeleton /> : loading && !isInitialLoad ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <span className="ml-2 text-muted-foreground">Filtering...</span>
                    </div>
                  ) : influencers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="mb-2">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No influencers found</h3>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div>
                  ) : (
                    influencers.map((influencer, index) => (
                      <div 
                        key={influencer.id}
                        style={{
                          cursor: index >= 5 ? 'default' : 'pointer',
                          pointerEvents: index >= 5 ? 'none' : 'auto',
                          opacity: index >= 5 ? 0.5 : 1,
                          filter: index >= 5 ? 'blur(2px)' : 'none',
                        }}
                      >
                        <InfluencerListItem 
                          influencer={influencer} 
                          isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id} 
                          onClick={() => onInfluencerClick(influencer)} 
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Cards View */}
        <div className="desktop-cards overflow-y-auto flex-1">
          {isInitialLoad ? <InfluencerListSkeleton /> : loading && !isInitialLoad ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              <span className="ml-2 text-muted-foreground">Filtering...</span>
            </div>
          ) : influencers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="mb-2">
                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No influencers found</h3>
              <p className="text-sm">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            influencers.map((influencer, index) => (
              <div 
                key={influencer.id}
                style={{
                  cursor: index >= 5 ? 'default' : 'pointer',
                  pointerEvents: index >= 5 ? 'none' : 'auto',
                  opacity: index >= 5 ? 0.5 : 1,
                  filter: index >= 5 ? 'blur(2px)' : 'none',
                }}
              >
                <InfluencerListItem 
                  influencer={influencer} 
                  isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id} 
                  onClick={() => onInfluencerClick(influencer)} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerList;
