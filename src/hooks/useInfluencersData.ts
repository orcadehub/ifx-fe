import { useState, useEffect } from 'react';
import { fetchInfluencers, fetchInfluencerProfile, toggleInfluencerWishlist } from '@/lib/influencers-api';

export const useInfluencersData = () => {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInfluencers();
      setInfluencers(data);
      if (data.length > 0 && !selectedInfluencer) {
        setSelectedInfluencer(data[0]);
      }
    } catch (error) {
      console.error('Error loading influencers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInfluencerProfile = async (influencerId: string) => {
    try {
      const profileData = await fetchInfluencerProfile(influencerId);
      if (profileData) {
        setSelectedInfluencer((prev: any) => ({
          ...prev,
          ...profileData
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleWishlistToggle = async (influencerId: string) => {
    try {
      const influencer = influencers.find(inf => inf.id === influencerId);
      if (!influencer) return;

      await toggleInfluencerWishlist(influencerId, influencer.wishlist);
      
      // Reload influencers to get updated wishlist status from backend
      await loadInfluencers();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return {
    influencers,
    isLoading,
    selectedInfluencer,
    setSelectedInfluencer,
    loadInfluencerProfile,
    handleWishlistToggle
  };
};
