import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/dashboard/Profile';
import Settings from '../pages/dashboard/Settings';
import Services from '../pages/dashboard/Services';
import Booking from '../pages/dashboard/Booking';
import Invoices from '../pages/dashboard/Invoices';
import Notifications from '../pages/dashboard/Notifications';
import ServicePackage from '../pages/dashboard/service_package';

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
        path: 'service_package',
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
