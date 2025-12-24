import { useState } from 'react';

import Icon from '../../components/Icons';

const GarageBookingAdmin = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'Tom Brown',
      vehicle: 'Toyota Prius',
      service: 'ការផ្លាស់ប្តូរប្រេងម៉ាស៊ីន',
      serviceCode: '#0001',
      date: '2025-10-15',
      time: '02:00',
      status: 'pending',
      type: 'service',
      servicePrice: '$25.00',
      items: ['Engine Oil × 1'],
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      vehicle: 'Honda Civic',
      service: 'សម្អាតឡានក្រៅ',
      serviceCode: '#0002',
      date: '2025-10-15',
      time: '10:00',
      status: 'pending',
      type: 'service',
      servicePrice: '$15.00',
      items: ['មីនណាតថ្នាំសម្អាត'],
    },
    {
      id: 3,
      customerName: 'Mike Wilson',
      vehicle: 'Ford Focus',
      service: 'Premium oil change',
      serviceCode: '#PKG001',
      date: '2025-10-16',
      time: '14:00',
      status: 'approved',
      type: 'package',
      servicePrice: '$89.99',
      items: ['Engine Oil × 1', 'Brake Fluid × 2'],
      servicesIncluded: ['Oil Change', 'Brake Cleaning', 'Car Wash'],
      description: 'Complete premium car wash package with interior cleaning and waxing service',
    },
    {
      id: 4,
      customerName: 'Lisa Anderson',
      vehicle: 'BMW 320i',
      service: 'កញ្ចប់ថែទាំព្រហ្មនុត្តត',
      serviceCode: '#PKG002',
      date: '2025-10-16',
      time: '09:00',
      status: 'pending',
      type: 'package',
      servicePrice: '$45.00',
      items: ['Engine Oil × 1'],
      servicesIncluded: ['Oil Change', 'Filter Check'],
      description: 'Essential maintenance package for regular vehicle care and performance',
    },
    {
      id: 5,
      customerName: 'David Chen',
      vehicle: 'Tesla Model 3',
      service: 'Engine Oil Purchase',
      serviceCode: '#PROD001',
      date: '2025-10-17',
      time: '11:00',
      status: 'pending',
      type: 'product',
      servicePrice: '$35.00',
      items: ['Engine Oil × 2', 'Oil Filter × 1'],
      description: 'Product purchase only - no service',
    },
    {
      id: 6,
      customerName: 'Emily Rodriguez',
      vehicle: 'Mazda CX-5',
      service: 'Brake Fluid Purchase',
      serviceCode: '#PROD002',
      date: '2025-10-17',
      time: '15:00',
      status: 'approved',
      type: 'product',
      servicePrice: '$28.00',
      items: ['Brake Fluid × 3'],
      description: 'Product purchase only - no service',
    },
    {
      id: 7,
      customerName: 'John Smith',
      vehicle: 'Mercedes-Benz C-Class',
      service: 'ពិនិត្យប្រព័ន្ធ',
      serviceCode: '#0003',
      date: '2025-10-18',
      time: '13:00',
      status: 'rejected',
      type: 'service',
      servicePrice: '$30.00',
      items: ['Brake Fluid × 1'],
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    customerName: '',
    vehicle: '',
    service: '',
    serviceCode: '',
    date: '',
    time: '',
    type: 'service',
    servicePrice: '',
    items: '',
    servicesIncluded: '',
    description: '',
  });

  const handleApprove = (id: number) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'approved' } : b)));
  };

  const handleReject = (id: number) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b)));
  };

  const handleResetStatus = (id: number) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'pending' } : b)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: any = {
      id: bookings.length + 1,
      customerName: formData.customerName,
      vehicle: formData.vehicle,
      service: formData.service,
      serviceCode: formData.serviceCode || `#${String(bookings.length + 1).padStart(4, '0')}`,
      date: formData.date,
      time: formData.time,
      status: 'pending' as const,
      type: formData.type as 'service' | 'package' | 'product',
      servicePrice: formData.servicePrice,
      items: formData.items
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item),
      ...(formData.type === 'package' &&
        formData.servicesIncluded && {
          servicesIncluded: formData.servicesIncluded
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s),
        }),
      ...(formData.description && { description: formData.description }),
    };
    setBookings([...bookings, newBooking]);
    setShowModal(false);
    setFormData({
      customerName: '',
      vehicle: '',
      service: '',
      serviceCode: '',
      date: '',
      time: '',
      type: 'service',
      servicePrice: '',
      items: '',
      servicesIncluded: '',
      description: '',
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesType = filterType === 'all' || booking.type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'service':
        return <span className="booking-badge booking-badge-service">សេវាកម្ម</span>;
      case 'package':
        return <span className="booking-badge booking-badge-package">កញ្ចប់សេវា</span>;
      case 'product':
        return <span className="booking-badge booking-badge-product">ផលិតផល</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="booking-badge booking-badge-pending">រង់ចាំ</span>;
      case 'approved':
        return <span className="booking-badge booking-badge-approved">អនុម័ត</span>;
      case 'rejected':
        return <span className="booking-badge booking-badge-rejected">បដិសេធ</span>;
      default:
        return null;
    }
  };

  const countByType = (type: string) => bookings.filter((b) => b.type === type).length;
  const countByStatus = (status: string) => bookings.filter((b) => b.status === status).length;

  return (
    <div className="booking-admin-container">
      {/* Stats Header */}
      <div className="booking-page-header">
        <div className="booking-page-header-content">
          <div className="booking-page-header-left">
            <h2 className="booking-page-title">ការកក់</h2>
            <p className="booking-page-subtitle">
              គ្រប់គ្រងការកក់សេវាកម្ម កញ្ចប់ និងផលិតផលរបស់អតិថិជន
            </p>
          </div>
          <div className="booking-header-stats">
            <span className="booking-stat-badge booking-stat-total">សរុប: {bookings.length}</span>
            <span className="booking-stat-badge booking-stat-pending">
              រង់ចាំ: {countByStatus('pending')}
            </span>
            <span className="booking-stat-badge booking-stat-approved">
              អនុម័ត: {countByStatus('approved')}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="booking-stats-container">
        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>សេវាកម្ម</h3>
            <p>{countByType('service')}</p>
          </div>
          <div className="booking-stat-icon booking-icon-service">
            <Icon name="services" size={28} />
          </div>
        </div>

        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>កញ្ចប់សេវា</h3>
            <p>{countByType('package')}</p>
          </div>
          <div className="booking-stat-icon booking-icon-package">
            <Icon name="box" size={28} />
          </div>
        </div>

        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>ផលិតផល</h3>
            <p>{countByType('product')}</p>
          </div>
          <div className="booking-stat-icon booking-icon-product">
            <Icon name="products" size={28} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="booking-filters">
        <div className="booking-search-wrapper">
          <div className="booking-search-container">
            <Icon name="search" size={18} className="booking-search-icon" />
            <input
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ ឡាន ឬសេវាកម្ម..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="booking-search-input"
            />
          </div>
        </div>

        <div className="booking-filter-wrapper">
          <span className="booking-filter-label">Filter by:</span>
          <div className="booking-filter-controls">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="booking-filter-select"
            >
              <option value="all">ប្រភេទ: ទាំងអស់</option>
              <option value="service">សេវាកម្ម ({countByType('service')})</option>
              <option value="package">កញ្ចប់សេវា ({countByType('package')})</option>
              <option value="product">ផលិតផល ({countByType('product')})</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="booking-filter-select"
            >
              <option value="all">ស្ថានភាព: ទាំងអស់</option>
              <option value="pending">រង់ចាំ ({countByStatus('pending')})</option>
              <option value="approved">អនុម័ត ({countByStatus('approved')})</option>
              <option value="rejected">បដិសេធ ({countByStatus('rejected')})</option>
            </select>

            <button
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="booking-filter-reset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Header with Title and Button */}
      <div className="booking-main-header">
        <h1>គ្រប់គ្រងការកក់</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowModal(true);
          }}
        >
          + បង្កើតការកក់ថ្មី
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="booking-empty">
            <div className="booking-empty-icon" style={{ fontSize: '64px' }}>
              🔍
            </div>
            <p className="booking-empty-text">មិនមានការកក់ដែលត្រូវគ្នានឹងការច្រោះរបស់អ្នកទេ</p>
          </div>
        ) : (
          paginatedBookings.map((booking) => (
            <div key={booking.id} className={`booking-card status-${booking.status}`}>
              {/* Header */}
              <div className="booking-card-header">
                <div className="booking-card-info">
                  <div className="booking-card-badges">
                    {getTypeBadge(booking.type)}
                    {getStatusBadge(booking.status)}
                  </div>
                  <h3 className="booking-card-title">
                    {booking.customerName} - {booking.vehicle}
                  </h3>
                  <p className="booking-card-service">{booking.service}</p>
                  <p className="booking-card-code">{booking.serviceCode}</p>
                  {booking.description && (
                    <p className="booking-card-desc">{booking.description}</p>
                  )}
                </div>
                <div>
                  <p className="booking-card-price">{booking.servicePrice}</p>
                </div>
              </div>

              {/* Details */}
              <div className="booking-details">
                <div className="booking-detail-item">
                  <Icon name="calendar" className="booking-detail-icon" size={16} />
                  <span>
                    {booking.date} ម៉ោង {booking.time}
                  </span>
                </div>
              </div>

              {/* Services Included (for packages) */}
              {booking.servicesIncluded && (
                <div className="booking-services-box">
                  <div className="booking-box-header">
                    <Icon name="box" className="booking-box-icon" size={16} />
                    <span className="booking-box-label">សេវាកម្មក្នុងកញ្ចប់:</span>
                  </div>
                  <div className="booking-box-tags">
                    {booking.servicesIncluded.map((service) => (
                      <span key={service} className="booking-box-tag">
                        ✓ {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Items/Products */}
              <div className="booking-items-box">
                <div className="booking-box-header">
                  <span className="booking-box-icon" style={{ fontSize: '16px' }}>
                    📦
                  </span>
                  <span className="booking-box-label">
                    {booking.type === 'product' ? 'ផលិតផល:' : 'សម្ភារៈប្រើប្រាស់:'}
                  </span>
                </div>
                <div className="booking-box-tags">
                  {booking.items.map((item) => (
                    <span key={item} className="booking-box-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {booking.status === 'pending' && (
                <div className="booking-actions">
                  <button
                    onClick={() => {
                      handleApprove(booking.id);
                    }}
                    className="booking-btn booking-btn-approve"
                  >
                    <span style={{ fontSize: '16px' }}>✓</span>
                    អនុម័ត
                  </button>
                  <button
                    onClick={() => {
                      handleReject(booking.id);
                    }}
                    className="booking-btn booking-btn-reject"
                  >
                    <span style={{ fontSize: '16px' }}>✕</span>
                    បដិសេធ
                  </button>
                </div>
              )}
              {(booking.status === 'approved' || booking.status === 'rejected') && (
                <div className="booking-actions-vertical">
                  <div
                    className={`booking-status-msg ${booking.status === 'approved' ? 'approved' : 'rejected'}`}
                  >
                    {booking.status === 'approved'
                      ? '✓ ការកក់នេះត្រូវបានអនុម័ត'
                      : '✕ ការកក់នេះត្រូវបានបដិសេធ'}
                  </div>
                  <button
                    onClick={() => {
                      handleResetStatus(booking.id);
                    }}
                    className="booking-btn booking-btn-reset"
                  >
                    <span style={{ fontSize: '16px' }}>↻</span>
                    ត្រលប់មកវិញដើម្បីសម្រេចចិត្តឡើងវិញ
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredBookings.length > 0 && totalPages > 1 && (
        <div className="booking-pagination">
          <button
            className="booking-pagination-btn"
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
            disabled={currentPage === 1}
          >
            ‹ មុន
          </button>

          <div className="booking-pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`booking-pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(page);
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="booking-pagination-btn"
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            }}
            disabled={currentPage === totalPages}
          >
            បន្ទាប់ ›
          </button>
        </div>
      )}

      {/* Showing results info */}
      {filteredBookings.length > 0 && (
        <div className="booking-pagination-info">
          កំពុងបង្ហាញ {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} ពី{' '}
          {filteredBookings.length} ការកក់
        </div>
      )}

      {/* Add Booking Modal */}
      {showModal && (
        <div
          className="booking-modal-overlay"
          onClick={() => {
            setShowModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowModal(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div className="booking-modal" role="dialog" aria-modal="true">
            <div className="booking-modal-header">
              <h2>បង្កើតការកក់ថ្មី</h2>
              <button
                className="booking-modal-close"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="booking-form-grid">
                <div className="booking-form-group">
                  <label htmlFor="booking-customer-name">ឈ្មោះអតិថិជន *</label>
                  <input
                    id="booking-customer-name"
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData({ ...formData, customerName: e.target.value });
                    }}
                    placeholder="បញ្ចូលឈ្មោះអតិថិជន"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-vehicle">យានជំនិះ *</label>
                  <input
                    id="booking-vehicle"
                    type="text"
                    required
                    value={formData.vehicle}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicle: e.target.value });
                    }}
                    placeholder="ឧ. Toyota Prius"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-type">ប្រភេទ *</label>
                  <select
                    id="booking-type"
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                    }}
                    required
                  >
                    <option value="service">សេវាកម្ម</option>
                    <option value="package">កញ្ចប់សេវា</option>
                    <option value="product">ផលិតផល</option>
                  </select>
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-service">សេវាកម្ម *</label>
                  <input
                    id="booking-service"
                    type="text"
                    required
                    value={formData.service}
                    onChange={(e) => {
                      setFormData({ ...formData, service: e.target.value });
                    }}
                    placeholder="បញ្ចូលសេវាកម្ម"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-service-code">កូដសេវាកម្ម</label>
                  <input
                    id="booking-service-code"
                    type="text"
                    value={formData.serviceCode}
                    onChange={(e) => {
                      setFormData({ ...formData, serviceCode: e.target.value });
                    }}
                    placeholder="ស្វ័យប្រវត្តិ"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-price">តម្លៃ *</label>
                  <input
                    id="booking-price"
                    type="text"
                    required
                    value={formData.servicePrice}
                    onChange={(e) => {
                      setFormData({ ...formData, servicePrice: e.target.value });
                    }}
                    placeholder="$0.00"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-date">កាលបរិច្ឆេទ *</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                    }}
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-time">ម៉ោង *</label>
                  <input
                    id="booking-time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({ ...formData, time: e.target.value });
                    }}
                  />
                </div>
                <div className="booking-form-group booking-form-full">
                  <label htmlFor="booking-items">សម្ភារៈ/ផលិតផល *</label>
                  <input
                    id="booking-items"
                    type="text"
                    required
                    value={formData.items}
                    onChange={(e) => {
                      setFormData({ ...formData, items: e.target.value });
                    }}
                    placeholder="Engine Oil × 1, Brake Fluid × 2"
                  />
                  <small>បំបែកដោយសញ្ញា comma (,)</small>
                </div>
                {formData.type === 'package' && (
                  <div className="booking-form-group booking-form-full">
                    <label htmlFor="booking-services-included">សេវាកម្មក្នុងកញ្ចប់</label>
                    <input
                      id="booking-services-included"
                      type="text"
                      value={formData.servicesIncluded}
                      onChange={(e) => {
                        setFormData({ ...formData, servicesIncluded: e.target.value });
                      }}
                      placeholder="Oil Change, Brake Cleaning, Car Wash"
                    />
                    <small>បំបែកដោយសញ្ញា comma (,)</small>
                  </div>
                )}
                <div className="booking-form-group booking-form-full">
                  <label htmlFor="booking-description">ការពិពណ៌នា</label>
                  <textarea
                    id="booking-description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    placeholder="ព័ត៌មានបន្ថែម..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="booking-form-actions">
                <button
                  type="button"
                  className="booking-btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  បោះបង់
                </button>
                <button type="submit" className="booking-btn-submit">
                  បង្កើតការកក់
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageBookingAdmin;
