import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const url = error.config?.url || '';
    const isAuthCheck = url.includes('/auth/me');
    const isAuthAction = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !isAuthCheck && !isAuthAction) {
        window.location.href = '/login';
      }
      if (!isAuthCheck) {
        toast.error(message);
      }
    } else if (error.response?.status === 403) {
      toast.error(message);
    } else if (error.response?.status === 400) {
      toast.error(message);
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const complaintsAPI = {
  create: (data) => api.post('/complaints', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
  delete: (id) => api.delete(`/complaints/${id}`),
};

export const lostFoundAPI = {
  create: (data) => api.post('/lost-found', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/lost-found', { params }),
  getById: (id) => api.get(`/lost-found/${id}`),
  update: (id, data) => api.put(`/lost-found/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status) => api.put(`/lost-found/${id}/status`, { status }),
  delete: (id) => api.delete(`/lost-found/${id}`),
};

export const volunteersAPI = {
  register: (data) => api.post('/volunteers', data),
  getAll: (params) => api.get('/volunteers', { params }),
  updateStatus: (id, status) => api.put(`/volunteers/${id}/status`, { status }),
  delete: (id) => api.delete(`/volunteers/${id}`),
};

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export default api;
