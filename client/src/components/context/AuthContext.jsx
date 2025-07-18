import { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated as isTokenValid, setToken, logout as clearToken } from '../../service/auth';

const AuthContext = createContext(null);

const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => isTokenValid() ? getUserFromToken() : null);
  const login = (loginData) => {
    setToken(loginData.token);
    const userData = getUserFromToken();
    setUser(userData);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {user,login, logout,isAuthenticated: !!user};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
