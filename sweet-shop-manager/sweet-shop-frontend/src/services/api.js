import axios from 'axios';

// Ensure the base URL matches your backend server's address and port
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication Service ---
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// --- Sweets Service ---
export const getAllSweets = () => api.get('/sweets');
export const getSweetById = (id) => api.get(`/sweets/${id}`); // Helper for editing
export const addSweet = (sweetData) => api.post('/sweets', sweetData);
export const updateSweet = (id, sweetData) => api.put(`/sweets/${id}`, sweetData);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);
export const purchaseSweet = (id, quantity) => api.patch(`/sweets/${id}/purchase`, { quantity });
export const restockSweet = (id, quantity) => api.patch(`/sweets/${id}/restock`, { quantity });
export const searchSweets = (params) => api.get('/sweets/search', { params });

export default api;