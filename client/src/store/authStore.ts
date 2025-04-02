import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001';

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  message: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      set({
        isLoading: false,
        error: axiosError.response?.data?.message || 'Failed to login',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
        email,
        password,
        fullName,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Registration error:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      set({
        isLoading: false,
        error: axiosError.response?.data?.message || 'Failed to register',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Initialize axios auth header if token exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Axios interceptor for handling 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default useAuthStore;
