// src/pages/auth/Login.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await loginUser(username, password);
      login(data.token); // Lưu token vào Context và localStorage
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center', border: '1px solid #ccc', borderRadius: 2, p: 3 }}>
        <Typography variant="h5">Đăng nhập</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Đăng nhập
        </Button>
        <Typography sx={{ mt: 2 }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;