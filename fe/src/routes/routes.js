// src/routes/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Auth Views
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';

// Dashboard Views
import AdminDashboard from '../views/dashboard/AdminDashboard';
import ManagerDashboard from '../views/dashboard/ManagerDashboard';
import UserDashboard from '../views/dashboard/UserDashboard';

// Inventory Views
import InventoryList from '../views/inventory/InventoryList';
import AddProduct from '../views/inventory/AddProduct';
import EditProduct from '../views/inventory/EditProduct';

// Other Views
import NotFound from '../views/NotFound';

// Route Guards
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

const routes = [
  // Public routes
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  
  // Protected routes
  {
    path: '/dashboard',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard/user" />
      },
      // Admin routes
      {
        path: 'admin',
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            path: '',
            element: <AdminDashboard />
          }
        ]
      },
      // Manager routes
      {
        path: 'manager',
        element: <RoleRoute allowedRoles={['admin', 'manager']} />,
        children: [
          {
            path: '',
            element: <ManagerDashboard />
          }
        ]
      },
      // Regular user routes
      {
        path: 'user',
        element: <RoleRoute allowedRoles={['admin', 'manager', 'user']} />,
        children: [
          {
            path: '',
            element: <UserDashboard />
          }
        ]
      }
    ]
  },
  
  // Inventory routes
  {
    path: '/inventory',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <InventoryList />
      },
      {
        path: 'add',
        element: <RoleRoute allowedRoles={['admin', 'manager']} />,
        children: [
          {
            path: '',
            element: <AddProduct />
          }
        ]
      },
      {
        path: 'edit/:id',
        element: <RoleRoute allowedRoles={['admin', 'manager']} />,
        children: [
          {
            path: '',
            element: <EditProduct />
          }
        ]
      }
    ]
  },
  
  // 404 Not Found
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;