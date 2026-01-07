import { useState, useEffect } from 'react';

import Icon from '../../components/Icons';

export default function Settings() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      void err;
    }
  }, [theme]);

  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    garage: true,
    admin: true,
    invoice: true,
    notifications: true,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Garage Information
  const [garageName, setGarageName] = useState('Mr-Lube Garage');
  const [garageAddress, setGarageAddress] = useState('ភ្នំពេញ, កម្ពុជា');
  const [garagePhone, setGaragePhone] = useState('012 345 678');
  const [garageEmail, setGarageEmail] = useState('contact@mrlube.com');

  // Admin Account
  const [adminUsername, setAdminUsername] = useState('admin01');
  const [adminEmail, setAdminEmail] = useState('admin@garage.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Invoice Defaults
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [invoiceStartNumber, setInvoiceStartNumber] = useState('1001');
  const [taxRate, setTaxRate] = useState('10');
  const [currency, setCurrency] = useState('USD');
  const [paymentTerms, setPaymentTerms] = useState('30');

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [invoiceAlerts, setInvoiceAlerts] = useState(true);

  // Advanced Settings
  const [autoApproveBookings, setAutoApproveBookings] = useState(false);
  const [allowGuestBookings, setAllowGuestBookings] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [language, setLanguage] = useState('km');

  const handleSave = () => {
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        alert('សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា');
        return;
      }
      if (newPassword.length < 6) {
        alert('ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច 6 តួអក្សរ');
        return;
      }
    }

    console.log('Saving settings...');
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); }, 3000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1>ការកំណត់</h1>
        <button
          type="button"
          className="settings-theme-toggle"
          aria-label="Toggle theme"
          onClick={() => { setTheme((t) => (t === 'dark' ? 'light' : 'dark')); }}
        >
          <Icon name={theme === 'dark' ? 'night' : 'sun'} size={18} />
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && <div className="settings-toast">ការកំណត់ត្រូវបានរក្សារទុក</div>}

      <div className="settings-content">
        {/* Garage Information */}
        <section className={`settings-group ${expandedSections.garage ? 'is-expanded' : ''}`}>
          <button
            className="settings-group-header"
            onClick={() => { toggleSection('garage'); }}
            type="button"
          >
            <span className="settings-group-title">
              <Icon name="home" size={18} />
              ព័ត៌មានហាង
            </span>
            <Icon
              name={expandedSections.garage ? 'close' : 'expand_up_down'}
              size={16}
              className="settings-group-icon"
            />
          </button>
          {expandedSections.garage && (
            <div className="settings-group-content">
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ឈ្មោះហាង</div>
                  <div className="settings-label-desc">ឈ្មោះដែលបង្ហាញនៅលើវិក្កយបត្រ</div>
                </div>
                <div className="settings-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={garageName}
                    onChange={(e) => { setGarageName(e.target.value); }}
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អាសយដ្ឋាន</div>
                  <div className="settings-label-desc">ទីតាំងរបស់ហាង</div>
                </div>
                <div className="settings-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={garageAddress}
                    onChange={(e) => { setGarageAddress(e.target.value); }}
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">លេខទូរស័ព្ទ</div>
                  <div className="settings-label-desc">លេខទំនាក់ទំនងរបស់ហាង</div>
                </div>
                <div className="settings-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={garagePhone}
                    onChange={(e) => { setGaragePhone(e.target.value); }}
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អ៊ីមែល</div>
                  <div className="settings-label-desc">អ៊ីមែលសម្រាប់ទំនាក់ទំនង</div>
                </div>
                <div className="settings-control">
                  <input
                    type="email"
                    className="settings-input"
                    value={garageEmail}
                    onChange={(e) => { setGarageEmail(e.target.value); }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Admin Account */}
        <section className={`settings-group ${expandedSections.admin ? 'is-expanded' : ''}`}>
          <button
            className="settings-group-header"
            onClick={() => { toggleSection('admin'); }}
            type="button"
          >
            <span className="settings-group-title">
              <Icon name="profile" size={18} />
              គណនីអ្នកគ្រប់គ្រង
            </span>
            <Icon
              name={expandedSections.admin ? 'close' : 'expand_up_down'}
              size={16}
              className="settings-group-icon"
            />
          </button>
          {expandedSections.admin && (
            <div className="settings-group-content">
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ឈ្មោះអ្នកប្រើប្រាស់</div>
                  <div className="settings-label-desc">ឈ្មោះសម្រាប់ចូលប្រើប្រាស់</div>
                </div>
                <div className="settings-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={adminUsername}
                    onChange={(e) => { setAdminUsername(e.target.value); }}
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អ៊ីមែល</div>
                  <div className="settings-label-desc">អ៊ីមែលរបស់អ្នកគ្រប់គ្រង</div>
                </div>
                <div className="settings-control">
                  <input
                    type="email"
                    className="settings-input"
                    value={adminEmail}
                    onChange={(e) => { setAdminEmail(e.target.value); }}
                  />
                </div>
              </div>
              <div className="settings-divider" />
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ពាក្យសម្ងាត់បច្ចុប្បន្ន</div>
                  <div className="settings-label-desc">បំពេញប្រសិនបើចង់ផ្លាស់ប្តូរ</div>
                </div>
                <div className="settings-control">
                  <input
                    type="password"
                    className="settings-input"
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); }}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ពាក្យសម្ងាត់ថ្មី</div>
                  <div className="settings-label-desc">យ៉ាងតិច 6 តួអក្សរ</div>
                </div>
                <div className="settings-control">
                  <input
                    type="password"
                    className="settings-input"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); }}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">បញ្ជាក់ពាក្យសម្ងាត់</div>
                  <div className="settings-label-desc">បញ្ចូលម្តងទៀត</div>
                </div>
                <div className="settings-control">
                  <input
                    type="password"
                    className="settings-input"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); }}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Invoice & Payment Defaults */}
        <section className={`settings-group ${expandedSections.invoice ? 'is-expanded' : ''}`}>
          <button
            className="settings-group-header"
            onClick={() => { toggleSection('invoice'); }}
            type="button"
          >
            <span className="settings-group-title">
              <Icon name="invoices" size={18} />
              វិក្កយបត្រ និងការទូទាត់
            </span>
            <Icon
              name={expandedSections.invoice ? 'close' : 'expand_up_down'}
              size={16}
              className="settings-group-icon"
            />
          </button>
          {expandedSections.invoice && (
            <div className="settings-group-content">
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">បុព្វបទវិក្កយបត្រ</div>
                  <div className="settings-label-desc">អក្សរនៅមុខលេខវិក្កយបត្រ</div>
                </div>
                <div className="settings-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={invoicePrefix}
                    onChange={(e) => { setInvoicePrefix(e.target.value); }}
                    placeholder="INV"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">លេខចាប់ផ្តើម</div>
                  <div className="settings-label-desc">លេខវិក្កយបត្រដំបូង</div>
                </div>
                <div className="settings-control">
                  <input
                    type="number"
                    className="settings-input"
                    value={invoiceStartNumber}
                    onChange={(e) => { setInvoiceStartNumber(e.target.value); }}
                    min="1"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អត្រាពន្ធ</div>
                  <div className="settings-label-desc">ភាគរយពន្ធលើវិក្កយបត្រ</div>
                </div>
                <div className="settings-control">
                  <input
                    type="number"
                    className="settings-input"
                    value={taxRate}
                    onChange={(e) => { setTaxRate(e.target.value); }}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">រូបិយប័ណ្ណ</div>
                  <div className="settings-label-desc">រូបិយប័ណ្ណលំនាំដើម</div>
                </div>
                <div className="settings-control">
                  <select
                    className="settings-select"
                    value={currency}
                    onChange={(e) => { setCurrency(e.target.value); }}
                  >
                    <option value="USD">USD - ដុល្លារអាមេរិក</option>
                    <option value="KHR">KHR - រៀល</option>
                    <option value="THB">THB - បាត</option>
                  </select>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">លក្ខខណ្ឌទូទាត់</div>
                  <div className="settings-label-desc">ចំនួនថ្ងៃសម្រាប់ទូទាត់</div>
                </div>
                <div className="settings-control">
                  <input
                    type="number"
                    className="settings-input"
                    value={paymentTerms}
                    onChange={(e) => { setPaymentTerms(e.target.value); }}
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className={`settings-group ${expandedSections.notifications ? 'is-expanded' : ''}`}>
          <button
            className="settings-group-header"
            onClick={() => { toggleSection('notifications'); }}
            type="button"
          >
            <span className="settings-group-title">
              <Icon name="notifications" size={18} />
              ការជូនដំណឹង
            </span>
            <Icon
              name={expandedSections.notifications ? 'close' : 'expand_up_down'}
              size={16}
              className="settings-group-icon"
            />
          </button>
          {expandedSections.notifications && (
            <div className="settings-group-content">
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អ៊ីមែល</div>
                  <div className="settings-label-desc">ទទួលការជូនដំណឹងតាមអ៊ីមែល</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => { setEmailNotifications(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">SMS</div>
                  <div className="settings-label-desc">ទទួលការជូនដំណឹងតាម SMS</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => { setSmsNotifications(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ការកក់ថ្មី</div>
                  <div className="settings-label-desc">ជូនដំណឹងពេលមានការកក់ថ្មី</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={bookingAlerts}
                      onChange={(e) => { setBookingAlerts(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">វិក្កយបត្រថ្មី</div>
                  <div className="settings-label-desc">ជូនដំណឹងពេលមានវិក្កយបត្រថ្មី</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={invoiceAlerts}
                      onChange={(e) => { setInvoiceAlerts(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Advanced Settings */}
        <section className={`settings-group ${expandedSections.advanced ? 'is-expanded' : ''}`}>
          <button
            className="settings-group-header"
            onClick={() => { toggleSection('advanced'); }}
            type="button"
          >
            <span className="settings-group-title">
              <Icon name="settings" size={18} />
              ការកំណត់កម្រិតខ្ពស់
            </span>
            <Icon
              name={expandedSections.advanced ? 'close' : 'expand_up_down'}
              size={16}
              className="settings-group-icon"
            />
          </button>
          {expandedSections.advanced && (
            <div className="settings-group-content">
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អនុម័តការកក់ស្វ័យប្រវត្តិ</div>
                  <div className="settings-label-desc">ការកក់ត្រូវបានអនុម័តដោយស្វ័យប្រវត្តិ</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={autoApproveBookings}
                      onChange={(e) => { setAutoApproveBookings(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">អនុញ្ញាតការកក់ភ្ញៀវ</div>
                  <div className="settings-label-desc">អ្នកដែលមិនបានចុះឈ្មោះអាចធ្វើការកក់</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={allowGuestBookings}
                      onChange={(e) => { setAllowGuestBookings(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">របៀបថែទាំ</div>
                  <div className="settings-label-desc">បិទការប្រើប្រាស់សម្រាប់អ្នកប្រើធម្មតា</div>
                </div>
                <div className="settings-control">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => { setMaintenanceMode(e.target.checked); }}
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-label">
                  <div className="settings-label-text">ភាសា</div>
                  <div className="settings-label-desc">ភាសាប្រើប្រាស់ក្នុងប្រព័ន្ធ</div>
                </div>
                <div className="settings-control">
                  <select
                    className="settings-select"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); }}
                  >
                    <option value="km">ខ្មែរ</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="settings-footer">
          <button className="settings-save-btn" onClick={handleSave}>
            រក្សារទុក
          </button>
        </div>
      </div>
    </div>
  );
}
