export const STORED_KEYS = {
  get TOKEN() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  },
  get USER(): any {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user') || sessionStorage.getItem('user');
    }
    return null;
  },
  get REMEMBER_ME() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberMe') || sessionStorage.getItem('rememberMe');
    }
    return null;
  },
};