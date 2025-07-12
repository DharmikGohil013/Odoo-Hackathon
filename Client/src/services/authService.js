import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillswap_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('skillswap_token');
    } catch (error) {
      localStorage.removeItem('skillswap_token');
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Mock functions for development (remove when backend is ready)
  mockLogin: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@skillswap.com' && password === 'password') {
          resolve({
            user: {
              id: 1,
              name: 'Alex Johnson',
              email: 'demo@skillswap.com',
              avatar: null,
              college: 'MIT',
              company: 'Google',
              location: 'San Francisco, CA',
              bio: 'Full-stack developer passionate about teaching and learning new technologies.',
              skillsOffered: ['React', 'Node.js', 'Python', 'Machine Learning'],
              skillsWanted: ['Go', 'Kubernetes', 'DevOps', 'System Design'],
              rating: 4.8,
              totalSwaps: 24,
              isPublic: true,
              joinedAt: '2024-01-15'
            },
            token: 'mock-jwt-token-skillswap'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  mockRegister: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Math.random(),
            name: userData.name,
            email: userData.email,
            avatar: null,
            college: userData.college || '',
            company: userData.company || '',
            location: userData.location || '',
            bio: '',
            skillsOffered: [],
            skillsWanted: [],
            rating: 0,
            totalSwaps: 0,
            isPublic: true,
            joinedAt: new Date().toISOString()
          },
          token: 'mock-jwt-token-skillswap'
        });
      }, 1000);
    });
  }
};

export default api;