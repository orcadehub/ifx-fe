import apiClient from '@/lib/api-client';

export const fetchDashboardMetrics = async () => {
  try {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    const role = user?.role || 'business';
    
    const endpoint = role === 'admin' ? '/metrics/admin' : `/metrics/${user?.id || ''}`;
    const { data } = await apiClient.get(endpoint);
    
    return data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};
