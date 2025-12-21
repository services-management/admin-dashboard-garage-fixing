import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Booking from '../pages/dashboard/bookings/Bookings';
import Invoices from '../pages/dashboard/invoices/Invoices';
import Notifications from '../pages/dashboard/notifications/Notifications';
import Profile from '../pages/dashboard/profile/Profile';
import Product from '../pages/dashboard/services/products/Products';
import ServicePackage from '../pages/dashboard/services/service-package/ServicePackage';
import Services from '../pages/dashboard/services/services/Services';
import Settings from '../pages/dashboard/settings/Settings';
import Login from '../pages/auth/Login';

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
    ],
  },
]);
