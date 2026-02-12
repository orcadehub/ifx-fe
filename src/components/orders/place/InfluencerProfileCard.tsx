
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleInfluencerWishlist } from '@/lib/influencers-api';
import { toast } from 'sonner';

interface FollowerData {
  platform: string;
  icon: React.ReactNode;
  value: string;
}

interface InfluencerData {
  avatar: string;
  name: string;
  category: string;
  location: string;
  followers: FollowerData[];
  id?: string;
  wishlist?: boolean;
}

interface InfluencerProfileCardProps {
  influencer: InfluencerData;
}

const InfluencerProfileCard: React.FC<InfluencerProfileCardProps> = ({ influencer }) => {
  const [isWishlisted, setIsWishlisted] = useState(influencer.wishlist || false);
  const [isToggling, setIsToggling] = useState(false);

  const handleWishlistToggle = async () => {
    if (!influencer.id || isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleInfluencerWishlist(influencer.id, isWishlisted);
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <div className="rounded-xl overflow-hidden border-0 shadow-md bg-white dark:bg-card">
      <div className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 flex items-center gap-4 text-white">
          <div className="relative">
            <img
              src={influencer.avatar}
              alt="Influencer Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{influencer.name}</h3>
              <Heart 
                className={`w-5 h-5 cursor-pointer hover:scale-110 transition-all ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-white/80 hover:text-red-400'
                }`}
                onClick={handleWishlistToggle}
              />
            </div>
            <p className="text-sm text-white/90">{influencer.category} • {influencer.location}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 divide-x divide-border border-t">
          {influencer.followers.map((item, idx) => (
            <div key={idx} className="p-3 text-center group transition-all hover:bg-accent cursor-default">
              <div className="flex justify-center mb-1 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="font-semibold text-sm">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.platform}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileCard;
