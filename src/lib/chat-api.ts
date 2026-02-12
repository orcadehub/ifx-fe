import apiClient from './api-client';

export const fetchChats = async () => {
  const response = await apiClient.get('/chats');
  return response.data.chats;
};

export const fetchChatMessages = async (otherUserId: string) => {
  const response = await apiClient.get(`/chat/${otherUserId}`);
  return response.data.messages;
};

export const sendMessage = async (receiverId: string, message: string, messageType = 'text', fileUrl?: string, fileName?: string, fileSize?: number) => {
  const response = await apiClient.post('/chat/send', {
    receiverId,
    message,
    messageType,
    fileUrl,
    fileName,
    fileSize
  });
  return response.data.message;
};

export const uploadChatFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const markMessagesAsRead = async (otherUserId: string) => {
  const response = await apiClient.put(`/chat/${otherUserId}/read`);
  return response.data;
};
