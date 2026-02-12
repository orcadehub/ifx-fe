import apiClient from '@/lib/api-client';

export const fetchTopInfluencers = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/top-influencers');
    return data;
  } catch (error) {
    console.error('Error fetching top influencers:', error);
    return [];
  }
};

export const fetchTopBusinessUsers = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/top-business-users');
    return data;
  } catch (error) {
    console.error('Error fetching top business users:', error);
    return [];
  }
};
