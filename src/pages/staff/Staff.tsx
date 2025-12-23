import React, { useMemo, useState, useEffect } from 'react';

import Icon from '../../components/Icons';

interface StaffItem {
  id: number;
  name: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
}

export default function Staff() {
  const [query, setQuery] = useState('');
  const [staff, setStaff] = useState<StaffItem[]>([
    { id: 1, name: 'ជា​​ មាលា ', phone: '098 765 432', role: 'អ្នកជួសជុល', status: 'active' },
    { id: 2, name: 'ត​ កុសល ', phone: '098 765 432', role: 'អ្នកបង់ប្រាក់', status: 'active' },
    { id: 3, name: 'ប៉ា ចាន់ណា', phone: '077 888 999', role: 'អ្នកគ្រប់គ្រង', status: 'inactive' },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q),
    );
  }, [query, staff]);

  const handleDelete = (id: number) => {
    if (confirm('តើអ្នកចង់លុបបុគ្គលិកនេះមែន?')) {
      setStaff((prev) => {
        return prev.filter((p) => p.id !== id);
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [current, setCurrent] = useState<StaffItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      // ignore localStorage write errors (e.g., private mode)
      void err;
    }
  }, [theme]);

  const openAdd = () => {
    setIsEditMode(false);
    setCurrent(null);
    setForm({ name: '', phone: '', role: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (id: number) => {
    const s = staff.find((x) => x.id === id);
    if (!s) return;
    setIsEditMode(true);
    setCurrent(s);
    setForm({ name: s.name, phone: s.phone, role: s.role, status: s.status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrent(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('សូមបញ្ចូលឈ្មោះ');
      return;
    }
    if (isEditMode && current) {
      setStaff((prev) => {
        return prev.map((p) => (p.id === current.id ? { ...p, ...form } : p));
      });
      alert('បុគ្គលិកបានកែសម្រួល');
    } else {
      const nextId = Math.max(0, ...staff.map((s) => s.id)) + 1;
      setStaff((prev) => {
        return [
          ...prev,
          { id: nextId, name: form.name, phone: form.phone, role: form.role, status: form.status },
        ];
      });
      alert('បុគ្គលិកបានបន្ថែម');
    }
    closeModal();
  };

  return (
    <div className="page-staff">
      <div className="page-header">
        <h1>បុគ្គលិក</h1>
        <div className="header-actions">
          <input
            placeholder="ស្វែងរក..."
            className="search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <button className="btn-primary" onClick={openAdd}>
            + បន្ថែមបុគ្គលិក
          </button>

          <button
            type="button"
            className="theme-btn"
            aria-label="Toggle dark mode"
            onClick={() => {
              setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
            }}
          >
            {
              // use the project's Icon component so visuals match other buttons
            }
            <Icon name={theme === 'dark' ? 'night' : 'sun'} size={18} className="icon-red" />
          </button>
        </div>
      </div>

      <div className="table-card">
        <table className="staff-table">
          <thead>
            <tr className="table-header-row">
              <th>ឈ្មោះ</th>
              <th>លេខទូរស័ព្ទ</th>
              <th>តួនាទី</th>
              <th>ស្ថានភាព</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.role}</td>
                <td>
                  <span className={`status-badge ${s.status}`}>
                    {s.status === 'active' ? 'សកម្ម' : 'អវត្តមាន'}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-btn btn-edit"
                    onClick={() => {
                      openEdit(s.id);
                    }}
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    className="icon-btn btn-delete"
                    onClick={() => {
                      handleDelete(s.id);
                    }}
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Icon name="trash" size={18} className="icon-svg trash-icon" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>
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
              <h2>{isEditMode ? 'កែសម្រួលបុគ្គលិក' : 'បន្ថែមបុគ្គលិកថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="name-input">
                  ឈ្មោះ
                </label>
                <input
                  id="name-input"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone-input">
                  លេខទូរស័ព្ទ
                </label>
                <input
                  id="phone-input"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, phone: e.target.value }));
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="role-input">
                  តួនាទី
                </label>
                <input
                  id="role-input"
                  className="form-input"
                  value={form.role}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, role: e.target.value }));
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="status-select">
                  ស្ថានភាព
                </label>
                <select
                  id="status-select"
                  className="form-select"
                  value={form.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setForm((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }));
                  }}
                >
                  <option value="active">សកម្ម</option>
                  <option value="inactive">អវត្តមាន</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                បោះបង់
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'កែប្រែ' : 'រក្សារទុក'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
