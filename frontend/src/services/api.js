import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart_notes_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('smart_notes_token', token);
  } else {
    localStorage.removeItem('smart_notes_token');
  }
};

export const getAuthToken = () => localStorage.getItem('smart_notes_token');

export const register = (payload) => api.post('/auth/register', payload).then((response) => response.data);

export const login = (payload) => api.post('/auth/login', payload).then((response) => response.data);

export const getMe = () => api.get('/auth/me').then((response) => response.data);

export const getNotes = (params = {}) => api.get('/notes', { params }).then((response) => response.data);

export const getNoteById = (id) => api.get(`/notes/${id}`).then((response) => response.data);

export const createNote = (payload) => api.post('/notes', payload).then((response) => response.data);

export const updateNote = (id, payload) => api.put(`/notes/${id}`, payload).then((response) => response.data);

export const patchNote = (id, payload) => api.patch(`/notes/${id}`, payload).then((response) => response.data);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;
