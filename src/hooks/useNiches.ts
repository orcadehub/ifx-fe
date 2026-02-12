
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export function useNiches() {
  const [niches, setNiches] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchNiches() {
      try {
        setLoading(true);
        const { data } = await apiClient.get('/niches');
        setNiches(data || []);
      } catch (error) {
        console.error('Error fetching niches:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNiches();
  }, []);

  return {
    niches,
    selectedNiche,
    setSelectedNiche,
    loading
  };
}
