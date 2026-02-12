import apiClient from '@/lib/api-client';

export const fetchInfluencers = async () => {
  try {
    const { data } = await apiClient.get('/influencers');
    return data && data.length > 0 ? data : [];
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return [];
  }
};

export const fetchInfluencerProfile = async (influencerId: string) => {
  try {
    const { data } = await apiClient.get(`/profile/${influencerId}`);
    return data;
  } catch (error) {
    console.error('Error fetching influencer profile:', error);
    return null;
  }
};

export const toggleInfluencerWishlist = async (influencerId: string, isWishlisted: boolean) => {
  try {
    const endpoint = isWishlisted ? '/influencers/dislike' : '/influencers/like';
    const { data } = await apiClient.post(endpoint, { influencerId });
    return data;
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    throw error;
  }
};

export const fetchWishlist = async () => {
  try {
    const { data } = await apiClient.get('/wishlist');
    return data || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};
