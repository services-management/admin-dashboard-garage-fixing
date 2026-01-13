import { useState } from 'react';
import '../../styles/profile.css';

export default function Profile() {
  const [form, setForm] = useState({
    username: 'admin_user',
    name: 'Sok Dara',
    role: 'អ្នកគ្រប់គ្រង',
    phone: '012 345 678',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [backup, setBackup] = useState<typeof form | null>(null);

  const handleSaveAccount = () => {
    // persist changes (placeholder)
    alert('ព័ត៌មានគណនីបានរក្សាទុក');
    setIsEditing(false);
    setBackup(null);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setBackup({ ...form });
      setIsEditing(true);
      return;
    }
    // cancel editing
    if (backup) setForm(backup);
    setIsEditing(false);
    setBackup(null);
  };

  const handleSavePassword = () => {
    const np = form.newPassword || '';
    const cp = form.confirmPassword || '';
    if (np.length < 8) {
      alert('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច 8 តួអក្សរ');
      return;
    }
    if (np !== cp) {
      alert('ពាក្យសម្ងាត់ថ្មី និង ការបញ្ជាក់មិនដូចគ្នា');
      return;
    }
    alert('ការផ្លាស់ប្តូរពាក្យសម្ងាត់បានរក្សាទុក');
    setForm((p) => ({ ...p, newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="page-profile">
      <div className="page-header">
        <h1>ព័ត៌មានគណនី</h1>
        <div className="page-header-actions">
          <button className="btn-edit" onClick={handleEditToggle}>
            ✎ កែប្រែ
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {isEditing ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="profile-username">ឈ្មោះគណនី</label>
                  <input
                    className="form-input"
                    value={form.username}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, username: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone">លេខទូរស័ព្ទ</label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, phone: e.target.value }));
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="profile-name">ឈ្មោះ</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, name: e.target.value }));
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="btn-primary" onClick={handleSaveAccount}>
                  រក្សាទុកការកែប្រែ
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (backup) setForm(backup);
                    setIsEditing(false);
                    setBackup(null);
                  }}
                  style={{ marginLeft: 12 }}
                >
                  បោះបង់
                </button>
              </div>
            </>
          ) : (
            <div className="display-grid">
              <div className="col">
                <div className="display-label">ឈ្មោះ</div>
                <div className="display-value">{form.name || '-'}</div>

                <div style={{ height: 18 }} />

                <div className="display-label">លេខទូរស័ព្ទ</div>
                <div className="display-value">{form.phone}</div>
              </div>

              <div className="col">
                <div className="display-label">ឈ្មោះគណនី</div>
                <div className="display-value">{form.username}</div>

                <div style={{ height: 18 }} />

                <div className="display-label">តួនាទី</div>
                <div className="display-value">{form.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">ប្ដូរពាក្យសម្ងាត់</div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-new-password">ពាក្យសម្ងាត់ថ្មី</label>
              <input
                type="password"
                className="form-input"
                value={form.newPassword}
                onChange={(e) => {
                  setForm((p) => ({ ...p, newPassword: e.target.value }));
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-confirm-password">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
              <input
                type="password"
                className="form-input"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm((p) => ({ ...p, confirmPassword: e.target.value }));
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={handleSavePassword}>
              ប្តូរពាក្យសម្ងាត់
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
