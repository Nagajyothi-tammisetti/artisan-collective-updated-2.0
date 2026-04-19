import { createContext, useContext, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type UserType = "artisan" | "customer";

interface AuthContextType {
  isLoggedIn: boolean;
  userType:   UserType | null;
  userName:   string | null;
  login:      (type: UserType, name: string) => void;
  logout:     () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType,   setUserType]   = useState<UserType | null>(null);
  const [userName,   setUserName]   = useState<string | null>(null);

  const login = (type: UserType, name: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}