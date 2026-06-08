import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Users API
export const usersAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getUser: (userId) => api.get(`/users/${userId}`),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.post(`/users/${userId}/unblock`),
  getBlockedUsers: () => api.get('/users/blocked')
};

// Chats API
export const chatsAPI = {
  getAllChats: () => api.get('/chats'),
  createChat: (data) => api.post('/chats', data),
  getChat: (chatId) => api.get(`/chats/${chatId}`),
  updateChat: (chatId, data) => api.put(`/chats/${chatId}`, data),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
  addUserToGroup: (chatId, userId) => api.post(`/chats/${chatId}/add-user`, { userId }),
  removeUserFromGroup: (chatId, userId) => api.post(`/chats/${chatId}/remove-user`, { userId })
};

// Messages API
export const messagesAPI = {
  getMessages: (chatId, page = 1) => api.get(`/messages?chatId=${chatId}&page=${page}`),
  sendMessage: (data) => api.post('/messages', data),
  editMessage: (messageId, content) => api.put(`/messages/${messageId}`, { content }),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  addReaction: (messageId, reaction) => api.post(`/messages/${messageId}/reaction`, { reaction })
};

export default api;