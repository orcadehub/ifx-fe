import apiClient from './api-client';

export const getNotifications = async () => {
  const response = await apiClient.get('/dashboard/notifications');
  return response.data.notifications || [];
};

export const markNotificationAsRead = async (notificationId: number) => {
  const response = await apiClient.put(`/dashboard/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.put('/dashboard/notifications/mark-all-read');
  return response.data;
};
