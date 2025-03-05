import Layout from "../components/Layout";
import { Typography, Box, Paper } from "@mui/material";

const UserPage = () => {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Quản lý sản phẩm
        </Typography>
        <Paper sx={{ p: 2 }}>Danh sách sản phẩm sẽ hiển thị ở đây.</Paper>
      </Box>
    </Layout>
  );
};

export default UserPage;
