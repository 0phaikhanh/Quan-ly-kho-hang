import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.username === formData.username && u.password === formData.password);

    if (!user) {
      setError("Tài khoản hoặc mật khẩu không chính xác");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Đăng nhập thành công");
    navigate(`/${user.role}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 5, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Đăng nhập</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Tên tài khoản" name="username" value={formData.username} onChange={handleChange} fullWidth />
          <TextField label="Mật khẩu" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" color="primary" onClick={handleLogin}>Đăng nhập</Button>
          <Button color="secondary" onClick={() => navigate("/register")}>Đăng ký</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
