import { useMemo, useState, useEffect } from 'react';

import Icon from '../../components/Icons';
import '../../styles/user.css';

interface UserItem {
  id: string;
  username: string;
  role: 'admin' | 'technical';
  name?: string;
  phone_number?: string;
  status?: 'free' | 'busy' | 'off_duty';
  disabled?: boolean;
  password?: string;
}

export default function User() {
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'admin' | 'technical'>('admin');

  const [users, setUsers] = useState<UserItem[]>([
    { id: crypto.randomUUID(), username: 'admin01', role: 'admin', phone_number: '017 870 523' },
    { id: crypto.randomUUID(), username: 'admin02', role: 'admin', phone_number: '012 345 678' },
    {
      id: crypto.randomUUID(),
      username: 'tech01',
      name: 'ជា មាលា',
      phone_number: '098 765 432',
      role: 'technical',
      status: 'busy',
    },
    {
      id: crypto.randomUUID(),
      username: 'tech02',
      name: 'ស៊ូ ស៊ីណា',
      phone_number: '099 123 456',
      role: 'technical',
      status: 'free',
    },
  ]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (_e) {
      // ignore localStorage failures (e.g., privacy mode)
    }
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => u.role === filterRole)
      .filter((u) => {
        const nameMatches = u.name ? u.name.toLowerCase().includes(q) : false;
        const phoneMatches = u.phone_number ? u.phone_number.toLowerCase().includes(q) : false;
        return u.username.toLowerCase().includes(q) || nameMatches || phoneMatches;
      });
  }, [query, users, filterRole]);

  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<UserItem | null>(null);

  const [form, setForm] = useState({
    username: '',
    password: '',
    phone_number: '',
    name: '',
    status: 'free' as 'free' | 'busy' | 'off_duty',
    role: 'admin' as 'admin' | 'technical',
  });

  const openAdd = () => {
    setCurrent(null);
    setForm({
      username: '',
      password: '',
      phone_number: '',
      name: '',
      status: 'free',
      role: 'technical',
    });
    setShowModal(true);
  };

  const toggleDisable = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, disabled: !(u.disabled ?? false) } : u)),
    );
  };

  const handleSave = () => {
    const username = form.username.trim();
    if (username.length < 4 || username.length > 50) {
      alert('Username must be 4-50 characters');
      return;
    }

    if (current) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === current.id
            ? {
                ...u,
                username: form.username,
                phone_number: form.phone_number,
                ...(form.password ? { password: form.password } : {}),
              }
            : u,
        ),
      );
      alert('បុគ្គលិកបានកែសម្រួល');
      setShowModal(false);
      return;
    }

    if (form.role === 'technical') {
      if (!form.password || form.password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      if (!form.name.trim()) {
        alert('Name is required for technical users');
        return;
      }
      if (!form.phone_number.trim()) {
        alert('Phone number is required for technical users');
        return;
      }

      setUsers((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          username: form.username,
          role: 'technical',
          name: form.name,
          phone_number: form.phone_number,
          status: form.status,
          password: form.password,
        },
      ]);
      alert('បុគ្គលិកបានបង្កើត');
      setShowModal(false);
      return;
    } else {
      if (!form.password || form.password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      if (!form.phone_number.trim()) {
        alert('Phone number is required for admin');
        return;
      }

      setUsers((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          username: form.username,
          role: 'admin',
          phone_number: form.phone_number,
          ...(form.password ? { password: form.password } : {}),
        },
      ]);
      alert('អ្នកគ្រប់គ្រងបានបង្កើត');
      setShowModal(false);
      return;
    }
  };

  return (
    <div className="page-user">
      <div className="page-header">
        <h1>បុគ្គលិកទាំងអស់</h1>

        <div className="header-actions">
          <input
            placeholder="ស្វែងរក..."
            className="search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <button
            className={`btn-filter ${filterRole === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setFilterRole('admin');
            }}
          >
            អ្នកគ្រប់គ្រង
          </button>
          <button
            className={`btn-filter ${filterRole === 'technical' ? 'active' : ''}`}
            onClick={() => {
              setFilterRole('technical');
            }}
          >
            បុគ្គលិក
          </button>

          <button className="btn-primary" onClick={openAdd}>
            + បង្កើតបុគ្គលិកថ្មី
          </button>
          <button
            type="button"
            className="theme-btn"
            onClick={() => {
              setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
            }}
          >
            <Icon name={theme === 'dark' ? 'night' : 'sun'} size={18} />
          </button>
        </div>
      </div>

      <div className="table-card">
        <table className="staff-table">
          <thead>
            <tr>
              <th>ឈ្មោះគណនី</th>
              {filterRole === 'technical' && <th>ឈ្មោះ</th>}
              <th>លេខទូរស័ព្ទ</th>
              {filterRole === 'technical' && <th>ស្ថានភាព</th>}
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className={u.disabled ? 'user-disabled' : undefined}>{u.username}</td>
                {filterRole === 'technical' && <td>{u.name ?? '-'}</td>}
                <td>{u.phone_number ?? '-'}</td>
                {filterRole === 'technical' && (
                  <td>
                    {u.status === 'free' ? 'ទំនេរ' : u.status === 'busy' ? 'រវល់' : 'ឈប់បម្រើការ'}
                  </td>
                )}
                <td>
                  <button
                    className="btn-delete btn-disable"
                    title={u.disabled ? 'បើកគណនី' : 'បិទគណនី'}
                    aria-pressed={!!u.disabled}
                    onClick={() => {
                      const newValue = !(u.disabled ?? false);
                      if (confirm(newValue ? 'តើអ្នកចង់បិទគណនីនេះ?' : 'តើអ្នកចង់បើកគណនីនេះ?')) {
                        toggleDisable(u.id);
                        alert(newValue ? 'គណនីត្រូវបានបិទ' : 'គណនីត្រូវបានបើក');
                      }
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <line
                        x1="5"
                        y1="5"
                        x2="19"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={filterRole === 'admin' ? 3 : 5}
                  style={{ textAlign: 'center', padding: 24 }}
                >
                  មិនមានទិន្នន័យ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{current ? 'កែសម្រួលបុគ្គលិកទាំងអស់' : 'បង្កើតបុគ្គលិកថ្មី'}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="username">ឈ្មោះគណនី</label>
                <input
                  id="username"
                  className="form-input"
                  value={form.username}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, username: e.target.value }));
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {current ? 'ពាក្យសម្ងាត់ (Reset Password)' : 'ពាក្យសម្ងាត់'}
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                  }}
                />
              </div>

              {current && (
                <div className="form-group">
                  <label htmlFor="phone-current">លេខទូរស័ព្ទ</label>
                  <input
                    id="phone-current"
                    className="form-input"
                    value={form.phone_number}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, phone_number: e.target.value }));
                    }}
                  />
                </div>
              )}

              {!current && (
                <>
                  <div className="form-group">
                    <label htmlFor="role">តួនាទី</label>
                    <select
                      id="role"
                      className="form-input"
                      value={form.role}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, role: e.target.value as 'admin' | 'technical' }));
                      }}
                    >
                      <option value="admin">អ្នកគ្រប់គ្រង</option>
                      <option value="technical">បុគ្គលិក</option>
                    </select>
                  </div>

                  {form.role === 'technical' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="name">ឈ្មោះ</label>
                        <input
                          id="name"
                          className="form-input"
                          value={form.name}
                          onChange={(e) => {
                            setForm((p) => ({ ...p, name: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone-technical">លេខទូរស័ព្ទ</label>
                        <input
                          id="phone-technical"
                          className="form-input"
                          value={form.phone_number}
                          onChange={(e) => {
                            setForm((p) => ({ ...p, phone_number: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="status">ស្ថានភាព</label>
                        <select
                          id="status"
                          className="form-input"
                          value={form.status}
                          onChange={(e) => {
                            setForm((p) => ({
                              ...p,
                              status: e.target.value as 'free' | 'busy' | 'off_duty',
                            }));
                          }}
                        >
                          <option value="free">ទំនេរ</option>
                          <option value="busy">រវល់</option>
                          <option value="off_duty">ឈប់បម្រើការ</option>
                        </select>
                      </div>
                    </>
                  )}

                  {form.role === 'admin' && (
                    <div className="form-group">
                      <label htmlFor="phone-admin">លេខទូរស័ព្ទ</label>
                      <input
                        id="phone-admin"
                        className="form-input"
                        value={form.phone_number}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, phone_number: e.target.value }));
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                បោះបង់
              </button>
              <button className="btn-primary" onClick={handleSave}>
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
