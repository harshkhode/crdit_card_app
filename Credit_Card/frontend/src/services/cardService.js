import api from './api';

export const getCards = (params) => api.get('/cards', { params });
export const getCardById = (id) => api.get(`/cards/${id}`);
export const compareCards = (ids) => api.get('/cards/compare', { params: { ids: ids.join(',') } });
export const getRecommended = () => api.get('/cards/recommended');
export const getBanks = () => api.get('/cards/banks');

// Admin
export const createCard = (data) => api.post('/cards', data);
export const updateCard = (id, data) => api.put(`/cards/${id}`, data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);
