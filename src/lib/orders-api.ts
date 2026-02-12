import apiClient from './api-client';

export const createOrder = async (orderData: {
  influencerId: string;
  influencer_name: string;
  type: string;
  services: any[];
  totalPrice: number;
  orderAmount: number;
  description: string;
  affiliatedLinks: string[];
  couponCode?: string;
  postDateTime?: string;
  polls?: any[];
  visitPromotionData?: any;
}) => {
  const response = await apiClient.post('/place-order', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data.orders || [];
};

export const fetchPendingOrders = async () => {
  const response = await apiClient.get('/orders');
  const orders = response.data.orders || [];
  return orders.filter((order: any) => order.status === 'pending payment');
};

export const updateOrder = async (orderId: number, updateData: {
  scheduledDate?: string;
  scheduledTime?: string;
  socialLinks?: any;
}) => {
  const postDateTime = updateData.scheduledDate && updateData.scheduledTime 
    ? `${updateData.scheduledDate}T${updateData.scheduledTime}:00` 
    : undefined;
  
  const response = await apiClient.put(`/orders/${orderId}`, {
    post_datetime: postDateTime,
    social_links: updateData.socialLinks
  });
  return response.data;
};
