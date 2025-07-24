export function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.exp) {
      return false; 
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTimeInSeconds;
  } catch (err) {
    console.error("Failed to parse or validate token:", err);
    return false; 
  }
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function setStoredUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getStoredUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch (e) {
        return null; 
    }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}