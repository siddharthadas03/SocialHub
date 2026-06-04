import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('socialhub_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('socialhub_token'));
  const [authLoading, setAuthLoading] = useState(Boolean(token));

  const persistSession = (payload) => {
    localStorage.setItem('socialhub_token', payload.token);
    localStorage.setItem('socialhub_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const signup = async (formValues) => {
    const { data } = await api.post('/auth/signup', formValues);
    persistSession(data);
  };

  const login = async (formValues) => {
    const { data } = await api.post('/auth/login', formValues);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem('socialhub_token');
    localStorage.removeItem('socialhub_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      // regular authenticated flow

      try {
        const { data } = await api.get('/auth/me');
        localStorage.setItem('socialhub_user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (_error) {
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      authLoading,
      signup,
      login,
      logout
    }),
    [authLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
