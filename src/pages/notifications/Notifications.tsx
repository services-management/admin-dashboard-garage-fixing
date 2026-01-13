import { useState } from 'react';
import {
  RiBellLine,
  RiCheckDoubleLine,
  RiDeleteBinLine,
  RiCalendarLine,
  RiToolsLine,
  RiAlertLine,
  RiUserLine,
  RiTimeLine,
  RiArrowRightSLine,
  RiSendPlaneLine,
  RiCloseLine,
} from 'react-icons/ri';

const NotificationContent = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSendForm, setShowSendForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    title: '',
    message: '',
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      icon: RiCalendarLine,
      title: 'សំណើកក់ថ្មី',
      description:
        'អតិថិជន John Doe បានកក់ "កញ្ចប់សេវាថែទាំរថយន្តពេញលេញ" សម្រាប់ Toyota Camry 2020',
      timestamp: '៥ នាទីមុន',
      status: 'unread',
      priority: 'normal',
      link: '/bookings/12345',
    },
    {
      id: 2,
      type: 'technician',
      icon: RiToolsLine,
      title: 'សេវាបានបញ្ចប់',
      description: 'ជាងបច្ចេកទេស Mike Johnson បានបញ្ចប់សេវាប្តូរប្រេងម៉ាស៊ីនសម្រាប់ការកក់ #12340',
      timestamp: '១៥ នាទីមុន',
      status: 'unread',
      priority: 'normal',
      link: '/bookings/12340',
    },
    {
      id: 3,
      type: 'booking',
      icon: RiAlertLine,
      title: 'ត្រូវការសកម្មភាព: លុបចោលការកក់',
      description:
        'អតិថិជន Sarah Smith បានស្នើសុំលុបចោលការកក់ #12338។ សងប្រាក់វិញកំពុងរងចាំការអនុម័ត។',
      timestamp: '៣០ នាទីមុន',
      status: 'unread',
      priority: 'critical',
      link: '/bookings/12338',
    },
    {
      id: 4,
      type: 'system',
      icon: RiAlertLine,
      title: 'បានទទួលការទូទាត់',
      description: 'បានទទួលការទូទាត់ $150 សម្រាប់ការកក់ #12335',
      timestamp: '១ ម៉ោងមុន',
      status: 'read',
      priority: 'normal',
      link: '/payments/12335',
    },
    {
      id: 5,
      type: 'technician',
      icon: RiUserLine,
      title: 'បានធ្វើបច្ចុប្បន្នភាពភាពអាចរកបានរបស់ជាងបច្ចេកទេស',
      description: 'ជាងបច្ចេកទេស David Lee បានសម្គាល់ខ្លួនឯងថាមិនអាចរកបានសម្រាប់ថ្ងៃស្អែក',
      timestamp: '២ ម៉ោងមុន',
      status: 'unread',
      priority: 'action',
      link: '/technicians/tech_005',
    },
    {
      id: 6,
      type: 'booking',
      icon: RiTimeLine,
      title: 'សេវាបានចាប់ផ្តើម',
      description: 'ជាងបច្ចេកទេស Emma Wilson បានចាប់ផ្តើមសេវាពិនិត្យចន្លោះសម្រាប់ការកក់ #12330',
      timestamp: '៣ ម៉ោងមុន',
      status: 'read',
      priority: 'normal',
      link: '/bookings/12330',
    },
    {
      id: 7,
      type: 'system',
      icon: RiCalendarLine,
      title: 'ការព្រមានស្តុកទាប',
      description: 'ស្តុកប្រេងម៉ាស៊ីនកំពុងអស់ (នៅសល់ 5 ឯកតា)',
      timestamp: '៤ ម៉ោងមុន',
      status: 'unread',
      priority: 'action',
      link: '/inventory',
    },
    {
      id: 8,
      type: 'booking',
      icon: RiCalendarLine,
      title: 'បានកំណត់ពេលវេលាការកក់ឡើងវិញ',
      description: 'អតិថិជន Michael Brown បានកំណត់ពេលវេលាការកក់ #12325 ឡើងវិញទៅសប្តាហ៍ក្រោយ',
      timestamp: '៥ ម៉ោងមុន',
      status: 'read',
      priority: 'normal',
      link: '/bookings/12325',
    },
  ]);

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter((n) => n.status === 'unread');
      case 'action':
        return notifications.filter((n) => n.priority === 'action' || n.priority === 'critical');
      case 'booking':
        return notifications.filter((n) => n.type === 'booking');
      case 'technician':
        return notifications.filter((n) => n.type === 'technician');
      case 'system':
        return notifications.filter((n) => n.type === 'system');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;
  const actionCount = notifications.filter(
    (n) => n.priority === 'action' || n.priority === 'critical',
  ).length;
  const todayCount = notifications.length;

  const getPriorityClass = (priority: string) => {
    return priority === 'critical' ? 'critical' : priority === 'action' ? 'action' : '';
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'បន្ទាន់';
      case 'action':
        return 'ត្រូវការសកម្មភាព';
      default:
        return 'ព័ត៌មាន';
    }
  };

  const getIconClass = (priority: string) => {
    return priority === 'critical' ? 'red' : priority === 'action' ? 'orange' : 'blue';
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
    setNotifications(notifications.map((n) => ({ ...n, status: 'read' })));
  };

  const handleClearAll = () => {
    if (window.confirm('តើអ្នកពិតជាចង់សម្អាតការជូនដំណឹងទាំងអស់មែនទេ?')) {
      setNotifications([]);
    }
  };

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    console.log('Navigate to:', notification.link);
    // Mark as read when clicked
    setNotifications(
      notifications.map((n) => (n.id === notification.id ? { ...n, status: 'read' } : n)),
    );
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipient || !formData.title || !formData.message) {
      alert('សូមបំពេញព័ត៌មានទាំងអស់');
      return;
    }

    // Create new notification
    const newNotification = {
      id: notifications.length + 1,
      type: 'system',
      icon: RiAlertLine,
      title: formData.title,
      description: formData.message,
      timestamp: 'ឥឡូវនេះ',
      status: 'unread' as const,
      priority: 'normal' as const,
      link: '#',
    };

    // Add to notifications list
    setNotifications([newNotification, ...notifications]);

    // Reset form
    setFormData({
      recipient: '',
      title: '',
      message: '',
    });

    // Close modal
    setShowSendForm(false);

    // Show success message
    alert('បានផ្ញើការជូនដំណឹងដោយជោគជ័យ!');
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="notification-page-header">
        <div className="notification-page-title">
          <h1>ការជូនដំណឹង</h1>
          <p>ទទួលបានការធ្វើបច្ចុប្បន្នភាពជាមួយសកម្មភាពប្រព័ន្ធ</p>
        </div>
        <div className="notification-header-actions">
          <button className="notification-btn send-btn" onClick={() => setShowSendForm(true)}>
            <RiSendPlaneLine />
            ផ្ញើការជូនដំណឹង
          </button>
          <button className="notification-btn" onClick={handleMarkAllRead}>
            <RiCheckDoubleLine />
            សម្គាល់ទាំងអស់ថាបានអាន
          </button>
          <button className="notification-btn" onClick={handleClearAll}>
            <RiDeleteBinLine />
            សម្អាតទាំងអស់
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="notification-summary-cards">
        <div className="notification-summary-card">
          <div className="notification-summary-card-content">
            <div>
              <p className="notification-summary-card-label">មិនទាន់អាន</p>
              <p className="notification-summary-card-value">{unreadCount}</p>
            </div>
            <div className="notification-summary-card-icon blue">
              <RiBellLine />
            </div>
          </div>
        </div>

        <div className="notification-summary-card">
          <div className="notification-summary-card-content">
            <div>
              <p className="notification-summary-card-label">ត្រូវការសកម្មភាព</p>
              <p className="notification-summary-card-value">{actionCount}</p>
            </div>
            <div className="notification-summary-card-icon orange">
              <RiAlertLine />
            </div>
          </div>
        </div>

        <div className="notification-summary-card">
          <div className="notification-summary-card-content">
            <div>
              <p className="notification-summary-card-label">ថ្ងៃនេះ</p>
              <p className="notification-summary-card-value">{todayCount}</p>
            </div>
            <div className="notification-summary-card-icon green">
              <RiCalendarLine />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notification-filter-tabs">
        <div className="notification-filter-tabs-container">
          {[
            { id: 'all', label: 'ទាំងអស់', count: notifications.length },
            { id: 'unread', label: 'មិនទាន់អាន', count: unreadCount },
            { id: 'action', label: 'ត្រូវការសកម្មភាព', count: actionCount },
            {
              id: 'booking',
              label: 'ការកក់',
              count: notifications.filter((n) => n.type === 'booking').length,
            },
            {
              id: 'technician',
              label: 'ជាងបច្ចេកទេស',
              count: notifications.filter((n) => n.type === 'technician').length,
            },
            {
              id: 'system',
              label: 'ប្រព័ន្ធ',
              count: notifications.filter((n) => n.type === 'system').length,
            },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`notification-filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            >
              {filter.label}
              <span className="notification-filter-badge">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty-state">
            <RiBellLine />
            <p>រកមិនឃើញការជូនដំណឹង</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-content">
                  <div
                    className={`notification-icon-wrapper ${getIconClass(notification.priority)}`}
                  >
                    <Icon />
                  </div>
                  <div className="notification-body">
                    <div className="notification-header">
                      <div className="notification-details">
                        <h3 className="notification-title">{notification.title}</h3>
                        <p className="notification-description">{notification.description}</p>
                        <div className="notification-meta">
                          <span className="notification-time">
                            <RiTimeLine />
                            {notification.timestamp}
                          </span>
                          {notification.status === 'unread' && (
                            <span className="notification-badge unread-badge">មិនទាន់អាន</span>
                          )}
                          {(notification.priority === 'critical' ||
                            notification.priority === 'action') && (
                            <span
                              className={`notification-badge priority-badge ${getPriorityClass(notification.priority)}`}
                            >
                              {getPriorityLabel(notification.priority)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="notification-arrow">
                        <RiArrowRightSLine />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Send Notification Modal */}
      {showSendForm && (
        <div className="notification-modal-overlay" onClick={() => setShowSendForm(false)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <h2>ផ្ញើការជូនដំណឹង</h2>
              <button className="notification-modal-close" onClick={() => setShowSendForm(false)}>
                <RiCloseLine />
              </button>
            </div>

            <form onSubmit={handleSendNotification}>
              <div className="notification-form-group">
                <label>ប្រភេទសារ</label>
                <input
                  type="text"
                  className="notification-form-input"
                  placeholder="ប្រភេទសារ"
                  value={formData.recipient}
                  onChange={(e) => handleFormChange('recipient', e.target.value)}
                />
              </div>

              <div className="notification-form-group">
                <label>ប្រធានបទ</label>
                <input
                  type="text"
                  className="notification-form-input"
                  placeholder="បញ្ចូលប្រធានបទ"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                />
              </div>

              <div className="notification-form-group">
                <label>សារ</label>
                <textarea
                  className="notification-form-textarea"
                  placeholder="បញ្ចូលសារ"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                />
              </div>

              <button type="submit" className="notification-form-submit">
                ផ្ញើការជូនដំណឹង
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationContent;
