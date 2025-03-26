import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3030/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser({ token: res.data.token });
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Đăng nhập thất bại' };
    }
  };

  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:3030/api/auth/register', { username, password });
      navigate('/login');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };


