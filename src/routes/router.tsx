import { createBrowserRouter } from 'react-router-dom';
import AdminRoute from './adminRoute';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Booking from '../pages/bookings/Bookings';
import Dashboard from '../pages/dashboard/Dashboard';
import Invoices from '../pages/invoices/Invoices';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import Product from '../pages/services/products/Products';
import ServicePackage from '../pages/services/service-package/ServicePackage';
import Services from '../pages/services/services/Services';
import Settings from '../pages/settings/Settings';
import Staff from '../pages/staff/Staff';

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
    element: <AdminRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'services',
            element: <Services />,
          },
          {
            path: 'services/service-package',
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
            path: 'services/products',
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
          {
            path: 'staff',
            element: <Staff />,
          },
        ],
      },
    ],
  },
]);
