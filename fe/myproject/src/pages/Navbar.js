import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: "#808080" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hệ thống quản lý kho
        </Typography>
        {user && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              Xin chào, {user.role.toUpperCase()}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Đăng xuất
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
