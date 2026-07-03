'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data.user);
    if (data.token) setToken(data.token);
    toast.success('Welcome back!');
    return data;
  }, []);

  const register = useCallback(async (name, email, password, phone, avatar = null) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (phone) formData.append('phone', phone);
    if (avatar) formData.append('avatar', avatar);
    const { data } = await authAPI.register(formData);
    setUser(data.user);
    if (data.token) setToken(data.token);
    toast.success('Account created successfully!');
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
    } finally {
      setUser(null);
      setToken(null);
      toast.success('Logged out');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
