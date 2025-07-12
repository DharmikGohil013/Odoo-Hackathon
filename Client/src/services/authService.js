import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const login = (email, password) =>
  axios.post(`${API_BASE_URL}/auth/login`, { email, password });

export const register = (name, email, password) =>
  axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
