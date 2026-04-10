import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create an axios instance for auth requests
const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await authApi.get('/api/dashboard/profile');
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const signOut = () => {
    const baseUrl = authApi.defaults.baseURL.replace(/\/$/, '');
    window.location.assign(`${baseUrl}/auth/logout`);
  };

  const signIn = () => {
    const baseUrl = authApi.defaults.baseURL.replace(/\/$/, '');
    window.location.assign(`${baseUrl}/auth/discord`);
  };

  const value = {
    user,
    loading,
    signOut,
    signIn,
    refreshUser: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
