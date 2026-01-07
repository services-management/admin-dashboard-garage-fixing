import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import companyLogo from '../assets/garage-logo.svg';
import Icon, { type IconName } from '../components/Icons';
import SidebarDropdown from '../components/SidebarDropdown';

/* =======================
   Sidebar Nav Item
======================= */
function NavItem({ to, label, iconName }: { to: string; label: string; iconName: IconName }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link to={to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon" aria-hidden="true">
          <Icon name={iconName} size={20} />
        </span>
        <span className="sidebar-label">{label}</span>
      </Link>
    </li>
  );
}

/* =======================
   Layout
======================= */
export default function DashboardLayout() {
  const location = useLocation();

  // Hide topbar for pages that have their own header
  const hideTopbar =
    location.pathname.startsWith('/dashboard/staff') ||
    location.pathname.startsWith('/dashboard/user') ||
    location.pathname.startsWith('/dashboard/settings');

  const [query, setQuery] = useState('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src={companyLogo}
            alt="Mr-Lube Garage Logo"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <div className="brand-text">
            <div className="brand-title">ម្ចាស់យានដ្ឋាន</div>
            <div className="brand-subtitle">ផ្ទាំងគ្រប់គ្រង</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <NavItem to="/dashboard" label="ផ្ទាំងទូទៅ" iconName="dashboard" />

            <SidebarDropdown
              label="សេវាកម្ម"
              iconName="box"
              items={[
                {
                  to: '/dashboard/services',
                  label: 'សេវាកម្មទាំងអស់',
                  iconName: 'services',
                },
                {
                  to: '/dashboard/services/products',
                  label: 'ផលិតផល',
                  iconName: 'products',
                },
                {
                  to: '/dashboard/services/service-package',
                  label: 'កញ្ចប់សេវាកម្ម',
                  iconName: 'service_package',
                },
              ]}
            />

            <NavItem to="/dashboard/booking" label="ការកក់" iconName="booking" />
            <NavItem to="/dashboard/invoices" label="វិក្កយបត្រ" iconName="invoices" />
            <NavItem to="/dashboard/staff" label="បុគ្គលិក" iconName="staff" />
            <NavItem to="/dashboard/user" label="អ្នកប្រើប្រាស់" iconName="user" />
            <NavItem to="/dashboard/notifications" label="ការជូនដំណឹង" iconName="notifications" />
            <NavItem to="/dashboard/profile" label="ប្រវត្តិរូប" iconName="profile" />
            <NavItem to="/dashboard/settings" label="ការកំណត់" iconName="settings" />
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">A</div>
          <div className="user-meta">
            <div className="user-name">Admin User</div>
            <div className="user-email">admin@garage.com</div>
          </div>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="content">
        {/* ===== Topbar (hidden for Staff & User pages) ===== */}
        <header className="topbar">
          {!hideTopbar && (
            <div className="search">
              <span className="search-icon" aria-hidden="true">
                <Icon name="search" size={18} />
              </span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="search-input"
                placeholder="ស្វែងរក..."
              />
            </div>
          )}

          {!hideTopbar && (
            <div className="topbar-actions">
              <button
                type="button"
                className="theme-btn"
                aria-label="Toggle dark mode"
                onClick={() => {
                  setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
                }}
              >
                <Icon name={theme === 'dark' ? 'night' : 'sun'} size={20} />
              </button>
            </div>
          )}
        </header>

        {/* ===== Page Content ===== */}
        <Outlet />
      </main>
    </div>
  );
}
