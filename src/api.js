// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Agrega un interceptor para incluir el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token attached to request:", config.headers.Authorization);
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
