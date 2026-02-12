
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Instagram, Facebook, Youtube, Twitter, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { fetchWishlist } from '@/lib/influencers-api';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistInfluencers, setWishlistInfluencers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWishlist();
      setWishlistInfluencers(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (!num || num === 0) return '0';
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  const handleInfluencerClick = (influencer: any) => {
    navigate(`/influencers/simple/${influencer.id}`);
  };

  const filteredInfluencers = wishlistInfluencers.filter(influencer =>
    influencer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    influencer.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {filteredInfluencers.length} of {wishlistInfluencers.length} influencer{wishlistInfluencers.length !== 1 ? 's' : ''} 
                {searchQuery && ' found'}
              </p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search influencers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : wishlistInfluencers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No Influencers in Wishlist</h3>
              <p className="text-muted-foreground mb-4">Start adding influencers to your wishlist to see them here</p>
              <Button onClick={() => navigate('/influencers')}>
                Browse Influencers
              </Button>
            </div>
          ) : filteredInfluencers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredInfluencers.map((influencer) => (
                <div
                  key={influencer.id}
                  className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleInfluencerClick(influencer)}
                >
                  <div className="relative mb-3">
                    <Avatar className="h-16 w-16 mx-auto">
                      <img 
                        src={influencer.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                        alt={influencer.name} 
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                      {influencer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 truncate">
                      {influencer.category}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <Instagram className="h-3 w-3 text-pink-500" />
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(influencer.data?.instagram?.total_followers || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Facebook className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(influencer.data?.facebook?.total_followers || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Youtube className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(influencer.data?.youtube?.total_followers || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Twitter className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(influencer.data?.twitter?.total_followers || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WishlistPage;
