import { useState, useEffect } from 'react';
import '../../styles/profile.css';
import { getCurrentAdminApi, updateCurrentAdminApi } from '../../store/auth/authService';
import toast from 'react-hot-toast';

interface AdminProfile {
  admin_id: string;
  username: string;
  email_phone: string;
  role: string;
  is_active: boolean;
  telegram_magic_link?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    username: '',
    name: '',
    role: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [backup, setBackup] = useState<typeof form | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentAdminApi();
      setProfile(data);
      setForm({
        username: data.username || '',
        name: data.username || '',
        role: data.role || 'អ្នកគ្រប់គ្រង',
        phone: data.email_phone || '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    try {
      await updateCurrentAdminApi({
        username: form.username,
        email_phone: form.phone,
      });
      toast.success('ព័ត៌មានគណនីបានរក្សាទុក');
      setIsEditing(false);
      setBackup(null);
      fetchProfile(); // Refresh to get updated data
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    }
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

  const handleSavePassword = async () => {
    const np = form.newPassword || '';
    const cp = form.confirmPassword || '';
    if (np.length < 8) {
      toast.error('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច 8 តួអក្សរ');
      return;
    }
    if (np !== cp) {
      toast.error('ពាក្យសម្ងាត់ថ្មី និង ការបញ្ជាក់មិនដូចគ្នា');
      return;
    }
    try {
      await updateCurrentAdminApi({
        password: np,
      });
      toast.success('ការផ្លាស់ប្តូរពាក្យសម្ងាត់បានរក្សាទុក');
      setForm((p) => ({ ...p, newPassword: '', confirmPassword: '' }));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password');
    }
  };

  return (
    <div className="page-profile">
      <div className="page-header">
        <h1>ព័ត៌មានគណនី</h1>
        <div className="page-header-actions">
          <button className="btn-edit" onClick={handleEditToggle}>
            ✎ កែប្រែ
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_refresh_token');
              window.location.href = '/';
            }}
            style={{ marginLeft: '12px' }}
          >
            ចាកចេញ (Logout)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            Loading...
          </div>
        </div>
      ) : (
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
              <>
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

                {profile && (
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
                    <div className="display-label">Admin ID</div>
                    <div className="display-value" style={{ fontSize: '12px', color: '#6b7280' }}>
                      {profile.admin_id}
                    </div>
                    <div style={{ height: 12 }} />
                    <div className="display-label">Status</div>
                    <div className="display-value">
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: profile.is_active ? '#d1fae5' : '#fee2e2',
                          color: profile.is_active ? '#065f46' : '#991b1b',
                        }}
                      >
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
