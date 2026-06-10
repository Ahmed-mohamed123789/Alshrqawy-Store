import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Add a response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].msg || data.message || 'Validation error';
      } else if (data.errors.msg) {
        return data.errors.msg;
      }
    }
    return data?.message || 'An unexpected error occurred. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
};
