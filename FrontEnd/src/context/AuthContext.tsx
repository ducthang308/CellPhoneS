import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type User = {
  userId: number;
  sdt: string;      
  fullName: string;
  role?: number;
  address?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  login: (data: any) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem('token()');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

const login = (data: any) => {
    localStorage.setItem('token', data.token);

    const userData = {
      userId: data.userId,
      sdt: data.sdt,                    
      fullName: data.fullName || 'Người dùng'
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};