import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = {
    admin: [
      { text: "Xem báo cáo", path: "/admin" },
      { text: "Đăng xuất", action: logout }
    ],
    manage: [
      { text: "Báo cáo & Thống kê", path: "/manage" },
      { text: "Đăng xuất", action: logout }
    ],
    user: [
      { text: "Quản lý sản phẩm", path: "/user" },
      { text: "Đăng xuất", action: logout }
    ]
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Toolbar />
      <List>
        {user && menuItems[user.role]?.map((item, index) => (
          <ListItem button key={index} onClick={() => (item.path ? navigate(item.path) : item.action())}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
