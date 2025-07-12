import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../api/authService"; // Adjust the path if needed

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string=} avatar
 * @property {string=} location
 * // Add more fields as needed
 */

/**
 * @typedef {Object} AuthContextProps
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {function(string, string): Promise<object>} login
 * @property {function(Object): Promise<object>} register
 * @property {function(): void} logout
 * @property {boolean} loading
 * @property {string|null} error
 */

const AuthContext = createContext(
  /** @type {AuthContextProps} */ (null)
);

/** AuthProvider wraps the app and manages authentication state */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User info object
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // For initial load
  const [error, setError] = useState(null);

  // Try to fetch user info on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("skillswap_token");
    if (token) {
      authService
        .getCurrentUser()
        .then((data) => {
          setUser(data.user || data);
          setIsAuthenticated(true);
          setError(null);
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("skillswap_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      if (res.token) localStorage.setItem("skillswap_token", res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setError(null);
      return { success: true, user: res.user };
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }

  // Register function
  async function register({ name, email, password }) {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({ name, email, password });
      if (res.token) localStorage.setItem("skillswap_token", res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setError(null);
      return { success: true, user: res.user };
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }

  // Logout function
  function logout() {
    authService.logout().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("skillswap_token");
  }

  // Context value
  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
