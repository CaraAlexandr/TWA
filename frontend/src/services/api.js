import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNotes = (params = {}) => api.get('/notes', { params }).then((response) => response.data);

export const getNoteById = (id) => api.get(`/notes/${id}`).then((response) => response.data);

export const createNote = (payload) => api.post('/notes', payload).then((response) => response.data);

export const updateNote = (id, payload) => api.put(`/notes/${id}`, payload).then((response) => response.data);

export const patchNote = (id, payload) => api.patch(`/notes/${id}`, payload).then((response) => response.data);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;
