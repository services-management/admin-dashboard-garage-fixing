import { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../components/Icons';
import '../../styles/user.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createAdmin,
  createTechnical,
  fetchAdmins,
  fetchTechnicals,
  fetchTeams,
  createTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  getAdminMagicLink,
  getTechnicalMagicLink,
} from '../../store/staff/staffThunk';
import { clearStaffError, clearStaffSuccessMessage } from '../../store/staff/staffSlice';
import type { TechnicalTeam } from '../../store/staff/staffTypes';

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

type TabType = 'staff' | 'teams';

export default function User() {
  const dispatch = useAppDispatch();
  const { admins, technicals, teams, loading, error, successMessage } = useAppSelector(
    (s) => s.staff,
  );

  const [activeTab, setActiveTab] = useState<TabType>('staff');
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'admin' | 'technical'>('admin');

  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    dispatch(fetchAdmins());
    dispatch(fetchTechnicals());
    dispatch(fetchTeams());
  }, [dispatch]);

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
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    password: '',
    phone_number: '',
    name: '',
    telegram_chat_id: '',
    status: 'free' as 'free' | 'busy' | 'off_duty',
    role: 'admin' as 'admin' | 'technical',
  });

  // Team modals state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TechnicalTeam | null>(null);
  const [teamForm, setTeamForm] = useState({
    team_name: '',
    description: '',
    team_lead_id: '',
  });

  // Telegram link modal state
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramLink, setTelegramLink] = useState<string>('');
  const [createdUserName, setCreatedUserName] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openAdd = () => {
    setCurrent(null);
    setShowPassword(false);
    setForm({
      username: '',
      password: '',
      phone_number: '',
      name: '',
      telegram_chat_id: '',
      status: 'free',
      role: 'technical',
    });
    setShowModal(true);
  };

  const openAddTeam = () => {
    setTeamForm({
      team_name: '',
      description: '',
      team_lead_id: '',
    });
    setShowTeamModal(true);
  };

  const openTeamMembers = (team: TechnicalTeam) => {
    setSelectedTeam(team);
    setShowTeamMembersModal(true);
  };

  const handleCreateTeam = async () => {
    if (!teamForm.team_name.trim()) {
      alert('Team name is required');
      return;
    }
    await dispatch(
      createTeam({
        team_name: teamForm.team_name,
        description: teamForm.description || undefined,
        team_lead_id: teamForm.team_lead_id || undefined,
      }),
    );
    setShowTeamModal(false);
  };

  const handleAddMember = async (teamId: string, technicalId: string) => {
    await dispatch(addMemberToTeam({ teamId, technicalId }));
    await dispatch(fetchTeams());
    await dispatch(fetchTechnicals());
  };

  const handleRemoveMember = async (technicalId: string) => {
    if (confirm('តើអ្នកចង់ដកសមាជិកចេញពីក្រុមនេះ?')) {
      await dispatch(removeMemberFromTeam(technicalId));
      await dispatch(fetchTeams());
      await dispatch(fetchTechnicals());
    }
  };

  // Auto-update selectedTeam when teams data changes
  useEffect(() => {
    if (selectedTeam && showTeamMembersModal) {
      const updatedTeam = teams.find((t) => t.team_id === selectedTeam.team_id);
      if (updatedTeam) {
        setSelectedTeam(updatedTeam);
      }
    }
  }, [teams, selectedTeam?.team_id, showTeamMembersModal]);

  const toggleDisable = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, disabled: !(u.disabled ?? false) } : u)),
    );
  };

  const handleGetMagicLink = async (id: string, username: string, role: 'admin' | 'technical') => {
    const result = await dispatch(
      role === 'admin' ? getAdminMagicLink(id) : getTechnicalMagicLink(id),
    );
    if (
      (role === 'admin' && getAdminMagicLink.fulfilled.match(result)) ||
      (role === 'technical' && getTechnicalMagicLink.fulfilled.match(result))
    ) {
      setTelegramLink(result.payload);
      setCreatedUserName(username);
      setShowTelegramModal(true);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearStaffError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearStaffSuccessMessage());
      setShowModal(false);
    }
  }, [successMessage, dispatch]);

  // Sync admins and technicals from Redux to local state
  useEffect(() => {
    const mappedAdmins: UserItem[] = admins.map((admin) => ({
      id: admin.admin_id,
      username: admin.username,
      role: 'admin' as const,
      phone_number: admin.email_phone,
    }));
    const mappedTechnicals: UserItem[] = technicals.map((tech) => ({
      id: tech.technical_id,
      username: tech.username,
      role: 'technical' as const,
      name: tech.name,
      phone_number: tech.phone_number,
      status: tech.status,
    }));
    setUsers([...mappedAdmins, ...mappedTechnicals]);
  }, [admins, technicals]);

  const handleSave = async () => {
    const username = form.username.trim();
    if (username.length < 4 || username.length > 50) {
      alert('Username must be 4-50 characters');
      return;
    }

    if (current) {
      // TODO: Implement update API when available
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
      const password = form.password?.trim() || '';
      if (password.length < 8) {
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

      const result = await dispatch(
        createTechnical({
          username: form.username.trim(),
          password: password,
          name: form.name.trim(),
          phone_number: form.phone_number.trim().replace(/\s/g, ''),
        }),
      );
      if (createTechnical.rejected.match(result)) {
        return;
      }
      // Show telegram link if available
      const payload = result.payload as any;
      if (payload?.telegram_magic_link) {
        setTelegramLink(payload.telegram_magic_link);
        setCreatedUserName(form.username);
        setShowTelegramModal(true);
      }
    } else {
      const password = form.password?.trim() || '';
      if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      if (!form.phone_number.trim()) {
        alert('Phone number is required for admin');
        return;
      }

      const result = await dispatch(
        createAdmin({
          username: form.username.trim(),
          password: password,
          email_phone: form.phone_number.trim().replace(/\s/g, ''),
        }),
      );
      if (createAdmin.rejected.match(result)) {
        return;
      }
      // Show telegram link if available
      const payload = result.payload as any;
      if (payload?.telegram_magic_link) {
        setTelegramLink(payload.telegram_magic_link);
        setCreatedUserName(form.username);
        setShowTelegramModal(true);
      }
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
            className={`btn-filter ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('staff');
            }}
          >
            បុគ្គលិក
          </button>
          <button
            className={`btn-filter ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('teams');
            }}
          >
            ក្រុមបច្ចេកទេស
          </button>

          {activeTab === 'staff' ? (
            <button className="btn-primary" onClick={openAdd}>
              + បង្កើតបុគ្គលិកថ្មី
            </button>
          ) : (
            <button className="btn-primary" onClick={openAddTeam}>
              + បង្កើតក្រុមថ្មី
            </button>
          )}
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

      {activeTab === 'staff' ? (
        <>
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
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
              បុគ្គលិកបច្ចេកទេស
            </button>
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
                        {u.status === 'free'
                          ? 'ទំនេរ'
                          : u.status === 'busy'
                            ? 'រវល់'
                            : 'ឈប់បម្រើការ'}
                      </td>
                    )}
                    <td>
                      <button
                        className="btn-primary"
                        style={{
                          padding: '6px 12px',
                          fontSize: 14,
                          marginRight: 8,
                          backgroundColor: '#0088cc',
                        }}
                        onClick={() => handleGetMagicLink(u.id, u.username, filterRole)}
                        title="យកតំណ Telegram"
                      >
                        Telegram
                      </button>
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
        </>
      ) : (
        <div className="table-card">
          <table className="staff-table">
            <thead>
              <tr>
                <th>ឈ្មោះក្រុម</th>
                <th>ការពិពណ៌នា</th>
                <th>ចំនួនសមាជិក</th>
                <th>ស្ថានភាព</th>
                <th>សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.team_id}>
                  <td>{team.team_name}</td>
                  <td>{team.description ?? '-'}</td>
                  <td>{team.members?.length ?? 0}</td>
                  <td>{team.is_active ? 'សកម្ម' : 'មិនសកម្ម'}</td>
                  <td>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: 14 }}
                      onClick={() => openTeamMembers(team)}
                    >
                      គ្រប់គ្រងសមាជិក
                    </button>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>
                    មិនមានទិន្នន័យ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    value={form.password}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, password: e.target.value }));
                    }}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                    }}
                  >
                    <Icon name={showPassword ? 'eye_off' : 'eye'} size={20} />
                  </button>
                </div>
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
                        <label
                          htmlFor="status"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Icon name="user" size={16} />
                          ស្ថានភាព
                        </label>
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
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showTeamModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>បង្កើតក្រុមបច្ចេកទេសថ្មី</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowTeamModal(false);
                }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="team_name">ឈ្មោះក្រុម *</label>
                <input
                  id="team_name"
                  className="form-input"
                  value={teamForm.team_name}
                  onChange={(e) => {
                    setTeamForm((p) => ({ ...p, team_name: e.target.value }));
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">ការពិពណ៌នា</label>
                <textarea
                  id="description"
                  className="form-input"
                  rows={3}
                  value={teamForm.description}
                  onChange={(e) => {
                    setTeamForm((p) => ({ ...p, description: e.target.value }));
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="team_lead">អ្នកដឹកនាំក្រុម</label>
                <select
                  id="team_lead"
                  className="form-input"
                  value={teamForm.team_lead_id}
                  onChange={(e) => {
                    setTeamForm((p) => ({ ...p, team_lead_id: e.target.value }));
                  }}
                >
                  <option value="">-- ជ្រើសរើសអ្នកដឹកនាំ --</option>
                  {technicals.map((tech) => (
                    <option key={tech.technical_id} value={tech.technical_id}>
                      {tech.name} ({tech.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowTeamModal(false);
                }}
              >
                បោះបង់
              </button>
              <button className="btn-primary" onClick={handleCreateTeam} disabled={loading}>
                {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamMembersModal && selectedTeam && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: 800 }}>
            <div className="modal-header">
              <h2>គ្រប់គ្រងសមាជិក - {selectedTeam.team_name}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowTeamMembersModal(false);
                  setSelectedTeam(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Team Info Card */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>អ្នកដឹកនាំក្រុម៖ </span>
                    <span style={{ fontWeight: 600 }}>
                      {selectedTeam.team_lead_id
                        ? (() => {
                            const lead = technicals.find(
                              (t) => t.technical_id === selectedTeam.team_lead_id,
                            );
                            return lead
                              ? `${lead.name} (${lead.username})`
                              : selectedTeam.team_lead_id;
                          })()
                        : 'មិនមានអ្នកដឹកនាំ'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>ចំនួនសមាជិក៖ </span>
                    <span style={{ fontWeight: 600 }}>
                      {selectedTeam.members?.length || 0} នាក់
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>ស្ថានភាព៖ </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: selectedTeam.is_active ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {selectedTeam.is_active ? 'សកម្ម' : 'មិនសកម្ម'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Current Members */}
                <div>
                  <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1e293b' }}>
                    សមាជិកក្នុងក្រុម ({selectedTeam.members?.length || 0})
                  </h3>
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <table className="staff-table">
                      <thead>
                        <tr>
                          <th>ឈ្មោះ</th>
                          <th style={{ width: '100px' }}>សកម្មភាព</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTeam.members.map((member) => {
                          const memberObj = member as any;
                          const memberId =
                            typeof member === 'string' ? member : memberObj.technical_id;
                          const memberName =
                            typeof member === 'string'
                              ? member
                              : memberObj.name || memberObj.username;
                          const isTeamLead = selectedTeam.team_lead_id === memberId;
                          return (
                            <tr key={memberId}>
                              <td>
                                {memberName}
                                {isTeamLead && (
                                  <span
                                    style={{
                                      marginLeft: '8px',
                                      fontSize: '11px',
                                      background: '#3b82f6',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    អ្នកដឹកនាំ
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleRemoveMember(memberId)}
                                  disabled={loading}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fecaca';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                  }}
                                >
                                  ដកចេញ
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: '#64748b',
                        background: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      មិនទាន់មានសមាជិក
                    </div>
                  )}
                </div>

                {/* Available Technicals */}
                <div>
                  <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1e293b' }}>
                    បុគ្គលិកដែលអាចបន្ថែម
                  </h3>
                  <table className="staff-table">
                    <thead>
                      <tr>
                        <th>ឈ្មោះគណនី</th>
                        <th>ឈ្មោះ</th>
                        <th>ស្ថានភាព</th>
                        <th style={{ width: '100px' }}>សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody>
                      {technicals
                        .filter((t) => {
                          // Check if technical is already a member of this team
                          const isMember = selectedTeam.members?.some((m: any) => {
                            const memberId = typeof m === 'string' ? m : m.technical_id;
                            return memberId === t.technical_id;
                          });
                          return !isMember && !t.team_id;
                        })
                        .map((tech) => (
                          <tr key={tech.technical_id}>
                            <td>{tech.username}</td>
                            <td>{tech.name}</td>
                            <td>
                              {tech.status === 'free'
                                ? 'ទំនេរ'
                                : tech.status === 'busy'
                                  ? 'រវល់'
                                  : 'ឈប់បម្រើការ'}
                            </td>
                            <td>
                              <button
                                className="btn-primary"
                                style={{ padding: '6px 12px', fontSize: 14 }}
                                onClick={() =>
                                  handleAddMember(selectedTeam.team_id, tech.technical_id)
                                }
                                disabled={loading}
                              >
                                បន្ថែម
                              </button>
                            </td>
                          </tr>
                        ))}
                      {technicals.filter((t) => {
                        const isMember = selectedTeam.members?.some((m: any) => {
                          const memberId = typeof m === 'string' ? m : m.technical_id;
                          return memberId === t.technical_id;
                        });
                        return !isMember && !t.team_id;
                      }).length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>
                            មិនមានបុគ្គលិកដែលអាចបន្ថែម
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowTeamMembersModal(false);
                  setSelectedTeam(null);
                }}
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Link Modal */}
      {showTelegramModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>តំណភ្ជាប់ Telegram</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowTelegramModal(false);
                  setTelegramLink('');
                  setCreatedUserName('');
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                បុគ្គលិក <strong>{createdUserName}</strong> ត្រូវបានបង្កើតជោគជ័យ!
              </p>
              <p style={{ marginBottom: '24px', color: '#666' }}>
                សូមចុចលីងខាងក្រោមដើម្បីភ្ជាប់គណនី Telegram៖
              </p>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  backgroundColor: '#0088cc',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
              >
                ភ្ជាប់ Telegram
              </a>

              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <input
                  type="text"
                  value={telegramLink}
                  readOnly
                  style={{
                    padding: '10px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '300px',
                    backgroundColor: '#f9f9f9',
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: copied ? '#22c55e' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? '✓ បានចម្លង' : 'ចម្លងតំណ'}
                </button>
              </div>

              <p style={{ marginTop: '16px', fontSize: '14px', color: '#888' }}>
                ចម្លងតំណនេះផ្ញើទៅបុគ្គលិកដើម្បីភ្ជាប់ Telegram
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowTelegramModal(false);
                  setTelegramLink('');
                  setCreatedUserName('');
                }}
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
