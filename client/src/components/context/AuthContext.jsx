import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  isTokenValid, 
  setToken, 
  getStoredUser, 
  setStoredUser, 
  logout as clearAuthData 
} from '../../service/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const validateAuth = useCallback(() => {
    if (isTokenValid()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    } else {
      clearAuthData();
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    validateAuth();
  }, [validateAuth]);

  const login = (loginResponse) => {
    setToken(loginResponse.token);
    setStoredUser(loginResponse.user);
    setUser(loginResponse.user);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    window.location.href = '/login'; 
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && !isLoading,
    isLoading, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};