import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
});

// Response interceptor to unwrap the Axios response and throw standard errors
api.interceptors.response.use(
  (response) => response.data.data || response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    throw new Error(message);
  }
);
