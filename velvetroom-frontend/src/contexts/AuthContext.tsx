/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser } from '@/services/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  address?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = localStorage.getItem('vr_token');
    const storedUser = localStorage.getItem('vr_user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('vr_token', data.token);
    localStorage.setItem('vr_user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      role: data.role,
      avatarUrl: data.avatarUrl, // ✅
    }));
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      role: data.role,
    });
  };

  const register = async (data: any) => {
    await registerUser(data);
  };

  const logout = () => {
    localStorage.removeItem('vr_token');
    localStorage.removeItem('vr_user');
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !user) {
        try {
          const me = await getCurrentUser();
          setUser(me);
        } catch (e) {
          console.warn('No se pudo obtener el perfil actual');
        }
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
