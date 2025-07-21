import { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated as isTokenValid, setToken, logout as clearToken } from '../../service/auth';

const AuthContext = createContext(null);

const getUserPayloadFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error("Failed to decode token payload:", error);
        return null;
    }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserJson = localStorage.getItem('user');

    if (storedToken && isTokenValid()) {
      if (storedUserJson) {
        try {
          return JSON.parse(storedUserJson);
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
          localStorage.removeItem('user');
          return getUserPayloadFromToken();
        }
      } else {
        return getUserPayloadFromToken();
      }
    }
    return null;
  });

  const login = (loginResponse) => {
    setToken(loginResponse.token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
    setUser(loginResponse.user);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};