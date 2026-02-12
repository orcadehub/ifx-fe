import apiClient from './api-client';

export const createServiceRequest = async (data: {
  serviceTitle: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  projectDescription: string;
  budget: string;
  timeline: string;
}) => {
  const response = await apiClient.post('/service-request', data);
  return response.data;
};

export const getUserServiceRequests = async () => {
  const response = await apiClient.get('/my-services');
  return response.data.services;
};
