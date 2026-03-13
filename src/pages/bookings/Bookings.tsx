import { useState } from 'react';
import toast from 'react-hot-toast';

import Icon from '../../components/Icons';
import { BookingService } from '../../store/booking/bookingService';

// Interfaces matching API structure
interface Product {
  product_id: number;
  name: string;
  selling_price: number;
  unit_cost?: number;
  category_id?: number;
  quantity?: number;
}

interface Technical {
  technical_id: string;
  username: string;
  name: string;
  phone_number: string;
  role: string;
  status: 'free' | 'busy' | 'off_duty';
}

interface Booking {
  id: number;
  customerName: string;
  vehicle: string;
  service: string;
  serviceCode: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'service' | 'package' | 'product';
  servicePrice: string;
  items: string[];
  servicesIncluded?: string[];
  description?: string;
  // API-aligned fields
  products?: Product[];
  assigned_technical?: Technical;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type TypeFilter = 'all' | 'service' | 'package' | 'product';

export default function Booking() {
  const [bookings, setBookings] = useState<Booking[]>([
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

  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterType, setFilterType] = useState<TypeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    full_name: '',
    car_make: '',
    car_model: '',
    car_year: new Date().getFullYear(),
    car_engine: '',
    appointment_date: '',
    start_time: '',
    service_location: 'garage',
    note: '',
    items: [{ service_id: 0, product_id: 0, quantity: 1 }],
  });

  const itemsPerPage = 6;

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
  };

  // Filter bookings
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
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (bookingId: number, newStatus: 'approved' | 'rejected') => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking,
      ),
    );
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const openDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const getStatusBadgeClass = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'status-badge-pending';
      case 'approved':
        return 'status-badge-approved';
      case 'rejected':
        return 'status-badge-rejected';
      default:
        return '';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'កំពុងរង់ចាំ';
      case 'approved':
        return 'បានអនុម័ត';
      case 'rejected':
        return 'បានបដិសេធ';
      default:
        return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.phone.trim()) {
      toast.error('សូមបញ្ចូលលេខទូរស័ព្ទ');
      return;
    }
    if (!formData.full_name.trim()) {
      toast.error('សូមបញ្ចូលឈ្មោះ');
      return;
    }
    if (!formData.appointment_date) {
      toast.error('សូមជ្រើសរើសកាលបរិច្ឆេទ');
      return;
    }
    if (!formData.start_time) {
      toast.error('សូមជ្រើសរើសម៉ោង');
      return;
    }

    // Filter valid items
    const validItems = formData.items.filter((item) => item.service_id > 0 || item.product_id > 0);

    if (validItems.length === 0) {
      toast.error('សូមបញ្ចូលយ៉ាងតិចមួយសេវាកម្មឬផលិតផល');
      return;
    }

    try {
      const payload = {
        phone: formData.phone,
        full_name: formData.full_name,
        car_make: formData.car_make || 'Unknown',
        car_model: formData.car_model || 'Unknown',
        car_year: Number(formData.car_year) || new Date().getFullYear(),
        car_engine: formData.car_engine || 'Unknown',
        items: validItems.map((item) => ({
          service_id: item.service_id > 0 ? item.service_id : undefined,
          product_id: item.product_id > 0 ? item.product_id : undefined,
          quantity: Number(item.quantity) || 1,
        })),
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        service_location: formData.service_location,
        note: formData.note || '',
        source: 'web',
      };

      console.log('Booking payload:', payload);
      await BookingService.createBooking(payload);
      toast.success('ការកក់ត្រូវបានបង្កើតជោគជ័យ!');
      setShowModal(false);

      // Reset form
      setFormData({
        phone: '',
        full_name: '',
        car_make: '',
        car_model: '',
        car_year: new Date().getFullYear(),
        car_engine: '',
        appointment_date: '',
        start_time: '',
        service_location: 'garage',
        note: '',
        items: [{ service_id: 0, product_id: 0, quantity: 1 }],
      });
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      toast.error(error.response?.data?.detail || 'មានបញ្ហាក្នុងការបង្កើតការកក់');
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
            <span className="booking-stat-badge booking-stat-total">សរុប: {stats.total}</span>
            <span className="booking-stat-badge booking-stat-pending">
              កំពុងរង់ចាំ: {stats.pending}
            </span>
            <span className="booking-stat-badge booking-stat-approved">
              បានអនុម័ត: {stats.approved}
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
                setFilterType(e.target.value as TypeFilter);
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
                setFilterStatus(e.target.value as StatusFilter);
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

      {/* Booking Table */}
      <div className="booking-table-container">
        {paginatedBookings.length === 0 ? (
          <div className="booking-empty">
            <Icon name="booking" size={48} />
            <p>មិនមានការកក់ទេ</p>
          </div>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>អតិថិជន</th>
                <th>សេវាកម្ម</th>
                <th>ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => openDetailModal(booking)}
                  className="booking-row-clickable"
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{booking.customerName}</div>
                      <div className="customer-vehicle">{booking.vehicle}</div>
                    </div>
                  </td>
                  <td>
                    <div className="service-cell">
                      <span className="booking-code">{booking.serviceCode}</span>
                      <span className="service-name">{booking.service}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge-table ${getStatusBadgeClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="booking-pagination">
          <button
            className="booking-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
            }}
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
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
            }}
          >
            បន្ទាប់ ›
          </button>
        </div>
      )}

      {filteredBookings.length > 0 && (
        <div className="booking-pagination-info">
          កំពុងបង្ហាញពី {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredBookings.length)} ក្នុងចំណោម{' '}
          {filteredBookings.length} ធាតុ
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={closeDetailModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeDetailModal();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close detail modal"
        >
          <div className="modal-content-booking" role="dialog" aria-modal="true">
            <div className="modal-header-booking">
              <h2>ព័ត៌មានលម្អិតការកក់</h2>
              <button
                className="modal-close-btn"
                onClick={closeDetailModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body-booking">
              <div className="booking-detail-section">
                <div className="detail-row">
                  <span className="detail-label">លេខកូដ:</span>
                  <span className="detail-value booking-code">{selectedBooking.serviceCode}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ស្ថានភាព:</span>
                  <span
                    className={`status-badge-modal ${getStatusBadgeClass(selectedBooking.status)}`}
                  >
                    {getStatusText(selectedBooking.status)}
                  </span>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3 className="section-title">ព័ត៌មានអតិថិជន</h3>
                <div className="detail-row">
                  <span className="detail-label">ឈ្មោះ:</span>
                  <span className="detail-value">{selectedBooking.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">យានយន្ត:</span>
                  <span className="detail-value">{selectedBooking.vehicle}</span>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3 className="section-title">ព័ត៌មានសេវាកម្ម</h3>
                <div className="detail-row">
                  <span className="detail-label">សេវាកម្ម:</span>
                  <span className="detail-value">{selectedBooking.service}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ប្រភេទ:</span>
                  <span className="detail-value">{selectedBooking.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">តម្លៃ:</span>
                  <span className="detail-value">{selectedBooking.servicePrice}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">កាលបរិច្ឆេទ:</span>
                  <span className="detail-value">{selectedBooking.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ម៉ោង:</span>
                  <span className="detail-value">{selectedBooking.time}</span>
                </div>
              </div>

              {selectedBooking.items.length > 0 && (
                <div className="booking-detail-section">
                  <h3 className="section-title">សម្ភារៈ/ផលិតផល</h3>
                  <ul className="detail-list">
                    {selectedBooking.items.map((item) => (
                      <li key={`item-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedBooking.servicesIncluded && selectedBooking.servicesIncluded.length > 0 && (
                <div className="booking-detail-section">
                  <h3 className="section-title">សេវាកម្មរួមបញ្ចូល</h3>
                  <ul className="detail-list">
                    {selectedBooking.servicesIncluded.map((service) => (
                      <li key={`service-${service}`}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedBooking.description && (
                <div className="booking-detail-section">
                  <h3 className="section-title">ការពិពណ៌នា</h3>
                  <p className="detail-description">{selectedBooking.description}</p>
                </div>
              )}

              {selectedBooking.status === 'pending' && (
                <div className="modal-actions">
                  <button
                    className="btn-modal-approve"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'approved');
                    }}
                  >
                    <Icon name="services" size={18} />
                    អនុម័ត
                  </button>
                  <button
                    className="btn-modal-reject"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'rejected');
                    }}
                  >
                    <Icon name="trash" size={18} />
                    បដិសេធ
                  </button>
                </div>
              )}

              {selectedBooking.status === 'approved' && (
                <div className="modal-status-message success">✓ ការកក់នេះត្រូវបានអនុម័ត</div>
              )}

              {selectedBooking.status === 'rejected' && (
                <div className="modal-status-message error">✕ ការកក់នេះត្រូវបានបដិសេធ</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showModal && (
        <div
          className="booking-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowModal(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
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
                  <label htmlFor="booking-phone">ទូរស័ព្ទ *</label>
                  <input
                    id="booking-phone"
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                    }}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-fullname">ឈ្មោះពេញ *</label>
                  <input
                    id="booking-fullname"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => {
                      setFormData({ ...formData, full_name: e.target.value });
                    }}
                    placeholder="បញ្ចូលឈ្មោះពេញ"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-car-make">ម៉ាករថយន្ត *</label>
                  <input
                    id="booking-car-make"
                    type="text"
                    required
                    value={formData.car_make}
                    onChange={(e) => {
                      setFormData({ ...formData, car_make: e.target.value });
                    }}
                    placeholder="ឧ. Toyota"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-car-model">ម៉ូដែល *</label>
                  <input
                    id="booking-car-model"
                    type="text"
                    required
                    value={formData.car_model}
                    onChange={(e) => {
                      setFormData({ ...formData, car_model: e.target.value });
                    }}
                    placeholder="ឧ. Camry"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-car-year">ឆ្នាំ *</label>
                  <input
                    id="booking-car-year"
                    type="number"
                    required
                    value={formData.car_year}
                    onChange={(e) => {
                      setFormData({ ...formData, car_year: Number(e.target.value) });
                    }}
                    placeholder="2023"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-car-engine">ម៉ាស៊ីន *</label>
                  <input
                    id="booking-car-engine"
                    type="text"
                    required
                    value={formData.car_engine}
                    onChange={(e) => {
                      setFormData({ ...formData, car_engine: e.target.value });
                    }}
                    placeholder="ឧ. 2.5L Hybrid"
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-date">កាលបរិច្ឆេទ *</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => {
                      setFormData({ ...formData, appointment_date: e.target.value });
                    }}
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-time">ម៉ោង *</label>
                  <input
                    id="booking-time"
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => {
                      setFormData({ ...formData, start_time: e.target.value });
                    }}
                  />
                </div>
                <div className="booking-form-group">
                  <label htmlFor="booking-location">ទីតាំងសេវាកម្ម *</label>
                  <select
                    id="booking-location"
                    value={formData.service_location}
                    onChange={(e) => {
                      setFormData({ ...formData, service_location: e.target.value });
                    }}
                    required
                  >
                    <option value="garage">ហ្គារ៉ាស់</option>
                    <option value="home">ផ្ទះ</option>
                  </select>
                </div>
                <div className="booking-form-group booking-form-full">
                  <label htmlFor="booking-note">ចំណាំ</label>
                  <textarea
                    id="booking-note"
                    value={formData.note}
                    onChange={(e) => {
                      setFormData({ ...formData, note: e.target.value });
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
}
