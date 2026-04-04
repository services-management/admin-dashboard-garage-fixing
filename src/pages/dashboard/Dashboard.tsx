import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../components/Icons';
import { BookingService, type DailyOverview } from '../../store/booking/bookingService';

export default function Dashboard() {
  const [overview, setOverview] = useState<DailyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, [targetDate]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getDailyOverview(targetDate);
      setOverview(data);
    } catch {
      toast.error('Failed to load daily overview');
    } finally {
      setLoading(false);
    }
  };

  const stats = overview?.stats || {
    total_bookings: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0,
    total_revenue: 0,
  };

  const recentBookings = overview?.bookings?.slice(0, 5) || [];

  return (
    <div className="dashboard">
      {/* Date Selector */}
      <section style={{ marginTop: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ថ្ងៃជ្រើសរើស:</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              fontSize: 14,
            }}
          />
          <button
            onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--brand-red)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ថ្ងៃនេះ
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">ការកក់សរុប</div>
            <div className="stat-icon">
              <Icon name="calendar" size={24} />
            </div>
          </div>
          <div className="stat-value">{loading ? '...' : stats.total_bookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">កំពុងរង់ចាំ</div>
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Icon name="clock" size={24} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#d97706' }}>
            {loading ? '...' : stats.pending}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">បានអនុម័ត</div>
            <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <Icon name="services" size={24} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#059669' }}>
            {loading ? '...' : stats.approved}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">បានបញ្ចប់</div>
            <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Icon name="services" size={24} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#2563eb' }}>
            {loading ? '...' : stats.completed}
          </div>
        </div>
      </section>

      <section className="revenue">
        <div className="revenue-header">
          <div className="revenue-title">ចំណូល ({targetDate})</div>
          <div className="revenue-icon">
            <Icon name="invoices" size={24} />
          </div>
        </div>
        <div className="revenue-value">
          {loading ? '$...' : `$${stats.total_revenue?.toLocaleString() || 0}`}
        </div>
      </section>

      <section className="recent">
        <div className="recent-title">ការកក់ថ្មីៗ ({recentBookings.length})</div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading...
          </div>
        ) : recentBookings.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            គ្មានការកក់សម្រាប់ថ្ងៃនេះ
          </div>
        ) : (
          <div className="card-list">
            {recentBookings.map((booking: any, index: number) => (
              <article
                className="task-card"
                key={booking.id || index}
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowDetailModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-main">
                  <div className="task-name">
                    {booking.full_name || booking.customer?.full_name || 'Unknown'}
                  </div>
                  <div className="task-sub">
                    {booking.car_make} {booking.car_model}
                  </div>
                </div>
                <div className="task-meta">
                  <div className="task-date">{booking.appointment_date || targetDate}</div>
                  <span
                    className={`task-badge ${booking.status?.toLowerCase() === 'pending' ? 'pending' : 'success'}`}
                  >
                    {booking.status || 'pending'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 12,
              width: '90%',
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: 24,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>
                ការកក់ #{selectedBooking.booking_id || selectedBooking.id}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ×
              </button>
            </div>

            {/* Status & Price */}
            <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#6b7280' }}>ស្ថានភាព:</span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background:
                      selectedBooking.status?.toLowerCase() === 'pending'
                        ? '#fef3c7'
                        : selectedBooking.status?.toLowerCase() === 'approved'
                          ? '#d1fae5'
                          : '#fee2e2',
                    color:
                      selectedBooking.status?.toLowerCase() === 'pending'
                        ? '#d97706'
                        : selectedBooking.status?.toLowerCase() === 'approved'
                          ? '#059669'
                          : '#dc2626',
                  }}
                >
                  {selectedBooking.status}
                </span>
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#6b7280' }}>តម្លៃសរុប:</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
                  ${selectedBooking.total_price || 0}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
                ព័ត៌មានអតិថិជន
              </h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ឈ្មោះ:</span>
                  <span>
                    {selectedBooking.full_name || selectedBooking.customer?.full_name || 'Unknown'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ទូរស័ព្ទ:</span>
                  <span>
                    {selectedBooking.contact_phone || selectedBooking.customer?.phone || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
                ព័ត៌មានយានយន្ត
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ម៉ាក:</span>
                  <span>{selectedBooking.car_make || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ម៉ូដែល:</span>
                  <span>{selectedBooking.car_model || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ឆ្នាំ:</span>
                  <span>{selectedBooking.car_year || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ម៉ាស៊ីន:</span>
                  <span>{selectedBooking.car_engine || '-'}</span>
                </div>
              </div>
            </div>

            {/* Appointment */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
                កាលបរិច្ឆេទ
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>កាលបរិច្ឆេទ:</span>
                  <span>{selectedBooking.appointment_date || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ម៉ោង:</span>
                  <span>{selectedBooking.start_time || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>ទីតាំង:</span>
                  <span>
                    {selectedBooking.service_location === 'garage' ? 'ហ្គារ៉ាស់' : 'ផ្ទះ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            {selectedBooking.note && (
              <div style={{ background: '#fef3c7', padding: 12, borderRadius: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                  ចំណាំ
                </h3>
                <p style={{ margin: 0, color: '#92400e' }}>{selectedBooking.note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
