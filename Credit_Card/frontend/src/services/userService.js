import api from './api';

export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const getFavorites = () => api.get('/users/favorites');
export const toggleFavorite = (cardId) => api.post(`/users/favorites/${cardId}`);

// Admin
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminStats = () => api.get('/admin/stats');
