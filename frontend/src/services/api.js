import axios from 'axios';

const API = axios.create({
  baseURL: 'https://event-mng-app.onrender.com/api', // Replace with your backend URL
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default API;