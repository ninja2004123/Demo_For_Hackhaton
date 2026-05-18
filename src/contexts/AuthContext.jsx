import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage.js';
import { seedTenant } from '../utils/seedData.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ tenantId, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) { setLoading(false); return; }
    seedTenant(tenantId);
    const saved = sessionStorage.getItem(`nexusiq:session:${tenantId}`);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, [tenantId]);

  const login = (email, password) => {
    const users = getItem(tenantId, 'users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    sessionStorage.setItem(`nexusiq:session:${tenantId}`, JSON.stringify(safeUser));
    return { success: true };
  };

  const register = (data) => {
    const users = getItem(tenantId, 'users', []);
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      clearance: 'L1',
      role: data.role || 'Employee',
      department: data.department || 'General',
      isAdmin: false,
    };
    setItem(tenantId, 'users', [...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    sessionStorage.setItem(`nexusiq:session:${tenantId}`, JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(`nexusiq:session:${tenantId}`);
  };

  const updateUserClearance = (userId, clearance) => {
    const users = getItem(tenantId, 'users', []);
    const updated = users.map(u => u.id === userId ? { ...u, clearance } : u);
    setItem(tenantId, 'users', updated);
    if (user?.id === userId) {
      const newUser = { ...user, clearance };
      setUser(newUser);
      sessionStorage.setItem(`nexusiq:session:${tenantId}`, JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserClearance, tenantId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
