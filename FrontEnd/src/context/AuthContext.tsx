import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { IUser } from "../services/Interface";

type AuthContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserFromStorage = () => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUserFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken") {
        syncUserFromStorage();
      }
    };

    const handleAuthChanged = () => {
      syncUserFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", handleAuthChanged);

    setLoading(false);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 🔥 báo cho toàn app
    window.dispatchEvent(new Event("auth-changed"));
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
