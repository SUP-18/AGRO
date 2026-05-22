import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agropredict-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('agropredict-token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('agropredict-token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('agropredict-token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('agropredict-token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  // Demo login — authenticates against the real backend with seeded credentials
  const demoLogin = async (role = 'farmer') => {
    const demoCredentials = {
      farmer: { email: 'farmer@agropredict.com', password: 'farmer123' },
      admin: { email: 'admin@agropredict.com', password: 'admin123' },
    };
    const creds = demoCredentials[role] || demoCredentials.farmer;
    const res = await login(creds.email, creds.password);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile, demoLogin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
