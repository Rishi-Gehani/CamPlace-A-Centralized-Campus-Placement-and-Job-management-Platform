import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import AuthStatusPopup from '../components/AuthStatusPopup';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/user', {
        headers: {
          'x-auth-token': token
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        const displayName = (data.user?.firstName && String(data.user.firstName) !== 'undefined') ? data.user.firstName : 'User';
        setAuthStatus({ 
          type: 'login', 
          message: `Welcome back, ${displayName}! Logging you in...` 
        });
        setTimeout(() => setAuthStatus(null), 2000);
        return data.user;
      } else {
        setError(data.message || 'Login failed');
        return null;
      }
    } catch {
      setError('Server error');
      return null;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        const displayName = (data.user?.firstName && String(data.user.firstName) !== 'undefined') ? data.user.firstName : 'User';
        setAuthStatus({ 
          type: 'register', 
          message: `Welcome to CamPlace, ${displayName}! Your account has been created.` 
        });
        setTimeout(() => setAuthStatus(null), 2000);
        return data.user;
      } else {
        setError(data.message || 'Registration failed');
        return null;
      }
    } catch {
      setError('Server error');
      return null;
    }
  };

  const logout = () => {
    setAuthStatus({ 
      type: 'logout', 
      message: 'Logging you out safely. See you soon!' 
    });
    
    setTimeout(() => {
      localStorage.removeItem('token');
      setUser(null);
      setAuthStatus(null);
      navigate('/', { replace: true });
      openAuthModal('login');
    }, 2000);
  };

  const refreshUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      refreshUser,
      isAuthModalOpen,
      authMode,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
      <AuthStatusPopup status={authStatus} />
    </AuthContext.Provider>
  );
};

