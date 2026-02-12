import apiClient from './api-client';

export const getUserReports = async () => {
  const response = await apiClient.get('/reports');
  return response.data.reports || [];
};

export const createReportRequest = async (data: {
  orderId?: string;
  fromDate: string;
  toDate: string;
}) => {
  const response = await apiClient.post('/reports/request', data);
  return response.data;
};

export const processReportPayment = async (reportId: string, paymentData: any) => {
  const response = await apiClient.post(`/reports/${reportId}/payment`, paymentData);
  return response.data;
};
