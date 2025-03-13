import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.username === formData.username)) {
      setError("Tài khoản đã tồn tại");
      return;
    }

    const newUser = { username: formData.username, email: formData.email, password: formData.password, role: "user" };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Bạn đã đăng ký thành công");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 5, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Đăng ký tài khoản</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Tên tài khoản" name="username" value={formData.username} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" fullWidth />
          <TextField label="Mật khẩu" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth />
          <TextField label="Xác nhận mật khẩu" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" fullWidth />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" color="primary" onClick={handleRegister}>Đăng ký</Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
