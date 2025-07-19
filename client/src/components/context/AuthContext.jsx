import { createContext, useState, useContext, useEffect } from 'react';
// Make sure this path to your auth service is correct
import { isAuthenticated as isTokenValid, setToken, logout as clearToken } from '../../service/auth';

const AuthContext = createContext(null);

// This function is useful for decoding the token payload if you *only* have a token,
// but we'll prioritize the full user object from the API response.
const getUserPayloadFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload; // Returns id, phone_number, iat, exp from token payload
    } catch (error) {
        console.error("Failed to decode token payload:", error);
        return null;
    }
};

export function AuthProvider({ children }) {
  // Initialize user state:
  // 1. Try to get the full user object from localStorage (if previously saved)
  // 2. If not found or invalid, fallback to decoding the token payload (if a token exists and is valid)
  // 3. Otherwise, null
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserJson = localStorage.getItem('user');

    if (storedToken && isTokenValid()) {
      if (storedUserJson) {
        try {
          // Attempt to parse the full user object from localStorage
          return JSON.parse(storedUserJson);
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
          localStorage.removeItem('user'); // Clear corrupted data
          return getUserPayloadFromToken(); // Fallback to token payload if stored user is corrupted
        }
      } else {
        // If there's a valid token but no stored user object (e.g., first load after initial login),
        // try to get basic info from the token payload.
        return getUserPayloadFromToken();
      }
    }
    return null; // No valid token or user data
  });

  // The login function now expects an object that contains both token and user data
  const login = (loginResponse) => {
    // Save the token to localStorage using your auth service
    setToken(loginResponse.token);
    // Save the full user object to localStorage
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
    // Set the user state for the current session
    setUser(loginResponse.user);
  };

  const logout = () => {
    clearToken(); // Clear the token from localStorage
    localStorage.removeItem('user'); // Also clear the user data from localStorage
    setUser(null); // Clear the user state
  };

  // The value provided to consumers of the AuthContext
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user // isAuthenticated is true if a user object exists
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