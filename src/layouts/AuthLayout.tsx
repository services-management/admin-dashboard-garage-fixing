
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#8b1d13]">
      <Outlet />
    </div>
  );
}

