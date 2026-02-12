
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export const useHeaderData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: 'User',
    email: '',
    avatarUrl: ''
  });
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUserData({
            fullName: user.fullname || 'User',
            email: user.email || '',
            avatarUrl: user.profile_pic || ''
          });
        }
        
        try {
          const { data } = await apiClient.get('/dashboard/unread-notification-count');
          setNotificationCount(data.count || 0);
        } catch (notifErr) {
          console.error("Error fetching notifications:", notifErr);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return {
    isLoading,
    userData,
    notificationCount
  };
};
