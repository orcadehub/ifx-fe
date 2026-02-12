import apiClient from './api-client';

export const getWallet = async () => {
  const response = await apiClient.get('/wallet');
  return response.data.wallet;
};

export const getWalletBalance = async () => {
  const response = await apiClient.get('/wallet/balance');
  return response.data.balance;
};

export const getWalletTransactions = async (type?: string) => {
  const response = await apiClient.get('/wallet/transactions', {
    params: { type: type || 'all' }
  });
  return response.data.transactions || [];
};

export const createWalletOrder = async (amount: number) => {
  const response = await apiClient.post('/wallet/create-order', { amount });
  return response.data;
};

export const verifyWalletPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
}) => {
  const response = await apiClient.post('/wallet/verify-payment', paymentData);
  return response.data;
};
