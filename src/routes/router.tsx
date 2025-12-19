import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Booking from '../pages/dashboard/Booking';
import Invoices from '../pages/dashboard/Invoices';
import Notifications from '../pages/dashboard/Notifications';
import Profile from '../pages/dashboard/Profile';
import Product from '../pages/dashboard/service/Products';
import ServicePackage from '../pages/dashboard/service/ServicePackage';
import Services from '../pages/dashboard/service/Services';
import Settings from '../pages/dashboard/Settings';
import Login from '../pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'service/services',
        element: <Services />,
      },
      {
        path: 'service/ServicePackage',
        element: <ServicePackage />,
      },
      {
        path: 'booking',
        element: <Booking />,
      },
      {
        path: 'invoices',
        element: <Invoices />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'service/products',
        element: <Product />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
