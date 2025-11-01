import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/api/user/register', data),
  login: (data) => api.post('/api/user/login', data),
  logout: () => api.post('/api/user/logout'),
};

// Event APIs
export const eventAPI = {
  getEvents: () => api.get('/api/event'),
  createEvent: (data) => api.post('/api/event/create', data),
  updateEvent: (id, data) => api.put(`/api/event/update/${id}`, data),
  deleteEvent: (id) => api.delete(`/api/event/delete/${id}`),
};

// Swap APIs
export const swapAPI = {
  getSwappableSlots: () => api.get('/api/swappableSlots'),
  createSwapRequest: (data) => api.post('/api/swapRequest', data),
  respondToSwap: (requestId, action) => api.post(`/api/respondToSwap/${requestId}`, { action }),
  getMySwapRequests: () => api.get('/api/mySwapRequests'),
};

export default api;
