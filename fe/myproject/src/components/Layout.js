import { Box } from "@mui/material";
import Sidebar from "../pages/Sidebar";
import Navbar from "../pages/Navbar";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
