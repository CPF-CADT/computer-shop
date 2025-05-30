// src/context/AuthContext.js
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const login = (userData) => {
    setUser({ email: userData.email, name: userData.name || 'Test User' }); // Store user info
    localStorage.setItem('user', JSON.stringify({ email: userData.email, name: userData.name || 'Test User'  }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Check localStorage for existing user session on initial load
  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);