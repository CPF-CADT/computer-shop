export function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch (err) {
    return false;
  }
}
export function setToken(token) {
    // implement your logic to set the token
    localStorage.setItem('token',token)
}

export function logout() {
    // implement your logic to remove the token
    localStorage.removeItem('token')
    localStorage.removeItem('user')

}