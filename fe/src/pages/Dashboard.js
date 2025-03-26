import React from 'react';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Trang Dashboard
      </Typography>
      <Typography>
        Chào mừng bạn đến với hệ thống quản lý kho hàng!
      </Typography>
    </Container>
  );
};

export default Dashboard;
