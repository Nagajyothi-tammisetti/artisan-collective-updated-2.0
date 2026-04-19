import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userType: "artisan" | "customer" | null;
  userName: string | null;
  login: (type: "artisan" | "customer", name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("auth_logged_in") === "true";
  });
  const [userType, setUserType] = useState<"artisan" | "customer" | null>(() => {
    return (localStorage.getItem("auth_user_type") as "artisan" | "customer") || null;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem("auth_user_name") || null;
  });

  const login = (type: "artisan" | "customer", name: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserName(name);
    localStorage.setItem("auth_logged_in", "true");
    localStorage.setItem("auth_user_type", type);
    localStorage.setItem("auth_user_name", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserName(null);
    localStorage.removeItem("auth_logged_in");
    localStorage.removeItem("auth_user_type");
    localStorage.removeItem("auth_user_name");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
