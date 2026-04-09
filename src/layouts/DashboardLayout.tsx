import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import companyLogo from '../assets/garage-logo.svg';
import Icon, { type IconName } from '../components/Icons';
import SidebarDropdown from '../components/SidebarDropdown';

/* =======================
   Mobile Nav Item
======================= */
function MobileNavItem({
  to,
  label,
  iconName,
  onClick,
}: {
  to: string;
  label: string;
  iconName: IconName;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link to={to} className={`mobile-nav-link ${isActive ? 'active' : ''}`} onClick={onClick}>
        <span className="mobile-nav-icon" aria-hidden="true">
          <Icon name={iconName} size={22} />
        </span>
        <span className="mobile-nav-label">{label}</span>
      </Link>
    </li>
  );
}

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

  // Hide topbar for pages that have their own header (staff & user)
  // Hide search also for profile page, but keep topbar actions (theme) visible on profile
  const hideTopbar =
    location.pathname.startsWith('/dashboard/staff') ||
    location.pathname.startsWith('/dashboard/user') ||
    location.pathname.startsWith('/dashboard/settings');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
              label="ព័ត៌មានសេវាកម្ម"
              iconName="box"
              items={[
                {
                  to: '/dashboard/services',
                  label: 'សេវាកម្មទាំងអស់',
                  iconName: 'services',
                },
                {
                  to: '/dashboard/services/categories',
                  label: 'ប្រភេទផលិតផល',
                  iconName: 'category',
                },
                {
                  to: '/dashboard/services/products',
                  label: 'ផលិតផល',
                  iconName: 'products',
                },
              ]}
            />

            <SidebarDropdown
              label="ព័ត៌មានយានយន្ត"
              iconName="vehicles"
              items={[
                {
                  to: '/dashboard/vehicles/make',
                  label: 'ម៉ាករថយន្ត',
                  iconName: 'vehicles',
                },
                {
                  to: '/dashboard/vehicles/model',
                  label: 'ម៉ូដែលរថយន្ត',
                  iconName: 'vehicles',
                },
                {
                  to: '/dashboard/vehicles/spec',
                  label: 'រថយន្ត',
                  iconName: 'vehicles',
                },
              ]}
            />

            <NavItem to="/dashboard/booking" label="គ្រប់គ្រងការកក់" iconName="booking" />
            <NavItem to="/dashboard/invoices" label="គ្រប់គ្រងវិក្កយបត្រ" iconName="invoices" />
            <NavItem to="/dashboard/staff" label="គ្រប់គ្រងបុគ្គលិក" iconName="staff" />
            <NavItem to="/dashboard/user" label="គ្រប់គ្រងអ្នកប្រើប្រាស់" iconName="user" />
            <NavItem to="/dashboard/notifications" label="ការជូនដំណឹង" iconName="notifications" />
            <NavItem to="/dashboard/slideshow" label="Slideshow" iconName="slideshow" />
            <NavItem to="/dashboard/profile" label="ប្រវត្តិរូបអ្នកគ្រប់គ្រង" iconName="profile" />
            <NavItem to="/dashboard/settings" label="ការកំណត់ប្រព័ន្ធ" iconName="settings" />
          </ul>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="content">
        {/* ===== Topbar ===== */}
        <header className="topbar">
          {/* Mobile Logo */}
          <div className="mobile-logo">
            <img
              src={companyLogo}
              alt="Mr-Lube Garage Logo"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <span className="mobile-logo-text">ម្ចាស់យានដ្ឋាន</span>
          </div>

          {!hideTopbar && (
            <div className="topbar-actions" style={{ marginRight: '16px' }}>
              <div className="theme-btn-container">
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
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* ===== Page Content ===== */}
        <Outlet />
      </main>

      {/* ================= Mobile Navigation Drawer ================= */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-nav-brand">
            <img
              src={companyLogo}
              alt="Mr-Lube Garage Logo"
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            />
            <div className="mobile-nav-brand-text">
              <div className="mobile-nav-brand-title">ម្ចាស់យានដ្ឋាន</div>
              <div className="mobile-nav-brand-subtitle">ផ្ទាំងគ្រប់គ្រង</div>
            </div>
          </div>
          <button
            type="button"
            className="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav className="mobile-nav">
          <ul>
            <MobileNavItem to="/dashboard" label="ផ្ទាំងទូទៅ" iconName="dashboard" />

            <li className="mobile-nav-section">ព៍សេវាកម្ម</li>
            <MobileNavItem to="/dashboard/services" label="សេវាកម្មទាំងអស់" iconName="services" />
            <MobileNavItem
              to="/dashboard/services/categories"
              label="ប្រភេទផលិតផល"
              iconName="category"
            />
            <MobileNavItem to="/dashboard/services/products" label="ផលិតផល" iconName="products" />

            <li className="mobile-nav-section">យានយន្ត</li>
            <MobileNavItem to="/dashboard/vehicles/make" label="ម៉ាករថយន្ត" iconName="vehicles" />
            <MobileNavItem
              to="/dashboard/vehicles/model"
              label="ម៉ូដែលរថយន្ត"
              iconName="vehicles"
            />
            <MobileNavItem to="/dashboard/vehicles/spec" label="រថយន្ត" iconName="vehicles" />

            <MobileNavItem to="/dashboard/booking" label="ការកក់" iconName="booking" />
            <MobileNavItem to="/dashboard/invoices" label="វិក្កយបត្រ" iconName="invoices" />
            <MobileNavItem to="/dashboard/staff" label="បុគ្គលិក" iconName="staff" />
            <MobileNavItem to="/dashboard/user" label="អ្នកប្រើប្រាស់" iconName="user" />

            <MobileNavItem
              to="/dashboard/notifications"
              label="ការជូនដំណឹង"
              iconName="notifications"
            />
            <MobileNavItem to="/dashboard/slideshow" label="Slideshow" iconName="slideshow" />
            <MobileNavItem to="/dashboard/profile" label="ប្រវត្តិរូប" iconName="profile" />
            <MobileNavItem to="/dashboard/settings" label="ការកំណត់" iconName="settings" />
          </ul>
        </nav>

        <div className="mobile-nav-footer">
          <div className="user-avatar">A</div>
          <div className="user-meta">
            <div className="user-name">Admin User</div>
            <div className="user-email">admin@garage.com</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
