import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Sử dụng context để quản lý trạng thái đăng nhập

  // Danh sách tài khoản mặc định
  const defaultUsers = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "manage", password: "manage123", role: "manage" }
  ];

  const handleLogin = () => {
    // Lấy danh sách tài khoản từ localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const allUsers = [...defaultUsers, ...storedUsers];

    // Kiểm tra tài khoản
    const user = allUsers.find((u) => u.username === username && u.password === password);

    if (user) {
      login(user); // Lưu user vào context

      // Chuyển hướng dựa vào role
      if (user.role === "admin") {
        navigate("/admin"); // Chuyển đến trang admin
      } else if (user.role === "manage") {
        navigate("/manage"); // Chuyển đến trang manage
      } else {
        navigate("/user"); // Chuyển đến trang user
      }
    } else {
      setError("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center", bgcolor: "white" }}>
        <Typography variant="h5" gutterBottom>Đăng nhập</Typography>

        {error && <Alert severity="error">{error}</Alert>}

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

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
        
        <Typography variant="body2" sx={{ mt: 2 }}>
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
