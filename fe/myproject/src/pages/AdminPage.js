import Layout from "../components/Layout";
import { Typography, Box, Paper } from "@mui/material";

const AdminPage = () => {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Xem báo cáo
        </Typography>
        <Paper sx={{ p: 2 }}>Báo cáo</Paper>
      </Box>
    </Layout>
  );
};

export default AdminPage;
