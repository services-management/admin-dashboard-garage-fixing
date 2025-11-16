import { Outlet } from 'react-router-dom';
import companyLogo from '../assets/garage-logo.svg';

export default function AuthLayout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--surface)'
    }}>
      <img 
        src={companyLogo} 
        alt="Mr-Lube Garage Management System" 
        style={{ width: '180px', marginBottom: '32px' }}
      />
      
      <Outlet />
    </div>
  );
}

