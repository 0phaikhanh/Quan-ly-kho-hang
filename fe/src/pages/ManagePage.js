import Layout from "../components/Layout";
import { Typography, Box, Paper } from "@mui/material";

const ManagePage = () => {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Báo cáo & Thống kê
        </Typography>
        <Paper sx={{ p: 2 }}>Dữ liệu báo cáo & thống kê sẽ hiển thị ở đây.</Paper>
      </Box>
    </Layout>
  );
};

export default ManagePage;
