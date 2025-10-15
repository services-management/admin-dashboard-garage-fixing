import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

function NavItem({ to, label, icon }: { to: string; label: string; icon: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <li>
      <Link
        to={to}
        className={`sidebar-link ${isActive ? 'active' : ''}`}
      >
        <span className="sidebar-icon" aria-hidden>{icon}</span>
        <span className="sidebar-label">{label}</span>
      </Link>
    </li>
  );
}

export default function DashboardLayout() {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const placeholder = useMemo(
    () => (theme === 'dark' ? 'ស្វែងរក...' : 'ស្វែងរក...'),
    [theme],
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-circle">ម</div>
          <div className="brand-text">
            <div className="brand-title">ម៉ាស្ទអដមីន</div>
            <div className="brand-subtitle">ផ្ទាំងគ្រប់គ្រង</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <NavItem to="/dashboard" label="ផ្ទាំងទូទៅ" icon="🏠" />
            <NavItem to="/dashboard/profile" label="ប្រវត្តិរូប" icon="👤" />
            <NavItem to="/dashboard/settings" label="ការកំណត់" icon="⚙️" />
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
      <main className="content">
        <header className="topbar">
          <div className="search">
            <span className="search-icon">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              placeholder={placeholder}
            />
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="theme-btn"
              aria-label="Toggle dark mode"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
