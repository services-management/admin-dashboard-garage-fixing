import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import Icon from '../../components/Icons';
import { BookingService } from '../../store/booking/bookingService';
import { getMakesApi, getVehicleSpecsApi } from '../../store/vehicle/vehicleService';
import { ProductService } from '../../store/product/productService';
import { ServiceService } from '../../store/service/serviceService';
import { getTechnicalTeamsApi } from '../../store/staff/staffService';
import type { TechnicalTeam } from '../../store/staff/staffTypes';
import type { Make, VehicleSpec } from '../../store/vehicle/vehicleTypes';
import type { Product as ProductType } from '../../store/product/productTypes';
import type { Service } from '../../store/service/serviceTypes';

// Custom Dropdown Component for Technical Selection
function CustomTechnicalDropdown({
  technicals,
  selectedId,
  onSelect,
}: {
  technicals: TechnicalTeam[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTech = technicals.find((t) => t.team_id === selectedId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 10,
          border: '2px solid #d1d5db',
          fontSize: 14,
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ color: selectedTech ? '#374151' : '#9ca3af' }}>
          {selectedTech ? `${selectedTech.team_name}` : '-- ជ្រើសរើសក្រុមបច្ចេកទេស --'}
        </span>
        <span
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          ▼
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {technicals.length === 0 ? (
            <div style={{ padding: 16, color: '#9ca3af', textAlign: 'center' }}>
              មិនមានក្រុមបច្ចេកទេស
            </div>
          ) : (
            technicals.map((tech) => (
              <div
                key={tech.team_id}
                onClick={() => {
                  onSelect(tech.team_id);
                  setIsOpen(false);
                }}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  background: selectedId === tech.team_id ? '#f0fdf4' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== tech.team_id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== tech.team_id) {
                    e.currentTarget.style.background = '#fff';
                  }
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background:
                      selectedId === tech.team_id
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : '#e5e7eb',
                    color: selectedId === tech.team_id ? '#fff' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {tech.team_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: selectedId === tech.team_id ? '#166534' : '#374151',
                    }}
                  >
                    {tech.team_name}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {tech.description || `Members: ${tech.members?.length || 0}`}
                  </div>
                </div>

                {/* Checkmark for selected */}
                {selectedId === tech.team_id && (
                  <span style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>✓</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface Booking {
  id: number;
  booking_id?: number;
  customerName: string;
  full_name?: string;
  vehicle: string;
  service: string;
  serviceCode: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  type: 'service' | 'package' | 'product';
  servicePrice: string;
  items: string[];
  servicesIncluded?: string[];
  description?: string;
  // API-aligned fields from real backend
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_engine?: string;
  contact_phone?: string;
  appointment_date?: string;
  start_time?: string;
  service_location?: string;
  source?: string;
  note?: string;
  internal_note?: string;
  total_price?: number;
  payment_status?: string;
  created_at?: string;
  updated_at?: string;
  customer?: {
    full_name?: string;
    phone?: string;
    user_id?: string;
    role?: string;
  };
  products?: ProductType[];
  assigned_technical?: {
    technical_id?: string;
    name?: string;
    phone_number?: string;
  };
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type TypeFilter = 'all' | 'service' | 'package' | 'product';

export default function Booking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterType, setFilterType] = useState<TypeFilter>('all');
  const [filterAssigned, setFilterAssigned] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch bookings when date changes, view mode changes, or search/filter changes
  useEffect(() => {
    fetchBookings();
  }, [selectedDate, showAllBookings, searchTerm, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      if (showAllBookings) {
        // Get all bookings with search and filter
        const query = searchTerm.trim() || undefined;
        const status = filterStatus !== 'all' ? filterStatus : undefined;
        const data = await BookingService.getBookings(0, 100, query, status);
        console.log('All bookings API response:', data);
        console.log('Bookings count:', Array.isArray(data) ? data.length : 'not array');
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      } else {
        // Use the daily overview endpoint to get bookings for selected date
        const data = await BookingService.getDailyOverview(selectedDate);
        if (data.bookings && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

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

  // Data for dropdowns
  const [makes, setMakes] = useState<Make[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleSpec[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicals, setTechnicals] = useState<TechnicalTeam[]>([]);
  const [selectedTechnicalId, setSelectedTechnicalId] = useState<string>('');
  const [assigningTechnical, setAssigningTechnical] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // TELEGRAM LINK MODAL
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramLink, setTelegramLink] = useState('');
  const [createdCustomerName, setCreatedCustomerName] = useState('');

  // Fetch dropdown data when modal opens
  const isAnyModalOpen = showModal || showDetailModal;
  useEffect(() => {
    if (isAnyModalOpen) {
      fetchDropdownData();
    }
  }, [isAnyModalOpen]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const [makesData, specsData, productsData, servicesData, teamsData] = await Promise.all([
        getMakesApi(),
        getVehicleSpecsApi(),
        ProductService.getProducts(),
        ServiceService.getServices(),
        getTechnicalTeamsApi(),
      ]);
      setMakes(makesData);
      setVehicleSpecs(specsData);
      setProducts(productsData);
      setServices(servicesData);
      console.log('Technical teams data:', teamsData);
      console.log('Teams count:', teamsData?.length || 0);
      // Ensure teamsData is an array
      const teamsArray = Array.isArray(teamsData) ? teamsData : [];
      setTechnicals(teamsArray);
      if (teamsArray.length === 0) {
        toast.error('មិនមានក្រុមបច្ចេកទេសទេ។ សូមបង្កើតក្រុមនៅទំព័របុគ្គលិក (Staff > Teams tab)');
      }
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAssignTechnical = async () => {
    if (!selectedBooking || !selectedTechnicalId) return;

    const bookingId = selectedBooking.booking_id || selectedBooking.id;
    console.log('Assigning technical:', {
      bookingId,
      technicalId: selectedTechnicalId,
      apiUrl: `${import.meta.env.VITE_API_HOST}/admin/bookings/${bookingId}/assign`,
    });

    try {
      setAssigningTechnical(true);
      await BookingService.assignBooking(bookingId, selectedTechnicalId);
      toast.success('បុគ្គលិកបច្ចេកទេសត្រូវបានចាត់តាំងដោយជោគជ័យ');
      setSelectedTechnicalId('');
      await fetchBookings();
      setShowDetailModal(false);
    } catch (error: any) {
      console.error('Failed to assign technical:', error);
      const errorMsg =
        error.response?.status === 404
          ? 'API endpoint not found (404). Please check backend implementation.'
          : error.response?.data?.detail || 'មិនអាចចាត់តាំងបុគ្គលិកបច្ចេកទេសបានទេ';
      toast.error(errorMsg);
    } finally {
      setAssigningTechnical(false);
    }
  };

  // Get unique makes for dropdown
  const uniqueMakes = makes;

  // Get vehicle specs filtered by selected make (through model.make)
  const filteredSpecs = formData.car_make
    ? vehicleSpecs.filter(
        (spec) => spec.model?.make?.name?.toLowerCase() === formData.car_make.toLowerCase(),
      )
    : vehicleSpecs;

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
    const bookingStatus = (booking.status || '').toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    // Map API status values to filter values
    const statusMap: Record<string, string> = {
      confirmed: 'approved',
      pending: 'pending',
      rejected: 'rejected',
      approved: 'approved',
    };
    const normalizedBookingStatus = statusMap[bookingStatus] || bookingStatus;
    const matchesStatus =
      filterStatusLower === 'all' || normalizedBookingStatus === filterStatusLower;
    const matchesType = filterType === 'all' || booking.type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      (booking.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.vehicle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.service || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssigned =
      filterAssigned === 'all' ||
      (filterAssigned === 'assigned' && booking.assigned_technical) ||
      (filterAssigned === 'unassigned' && !booking.assigned_technical);
    return matchesStatus && matchesType && matchesSearch && matchesAssigned;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (bookingId: number, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'approved') {
        await BookingService.acceptBooking(bookingId);
        toast.success('ការកក់ត្រូវបានអនុម័តដោយជោគជ័យ');
      } else {
        await BookingService.rejectBooking(bookingId, 'ការកក់ត្រូវបានបដិសេដោយអ្នកគ្រប់គ្រង');
        toast.success('ការកក់ត្រូវបានបដិសេធ');
      }
      // Refresh bookings list
      await fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពការកក់បានទេ');
    }
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

  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
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

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'កំពុងរង់ចាំ';
      case 'approved':
        return 'បានអនុម័ត';
      case 'rejected':
        return 'បានបដិសេធ';
      default:
        return status || 'Unknown';
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
        start_time: formData.start_time + ':00',
        service_location: formData.service_location,
        service_mode: formData.service_location === 'garage' ? 'Garage' : 'Home',
        note: formData.note || '',
        source: 'Web',
      };

      console.log('Booking payload:', payload);
      const response = await BookingService.createBooking(payload);
      console.log('Booking response:', response);

      // Check if Telegram magic link is returned
      const magicLink = response.telegram_magic_link || response.data?.telegram_magic_link;
      if (magicLink) {
        setTelegramLink(magicLink);
        setCreatedCustomerName(formData.full_name);
        setShowTelegramModal(true);
      }

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
  const countByStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      confirmed: 'approved',
      pending: 'pending',
      rejected: 'rejected',
      approved: 'approved',
    };
    return bookings.filter((b) => {
      const bookingStatus = (b.status || '').toLowerCase();
      const normalizedStatus = statusMap[bookingStatus] || bookingStatus;
      return normalizedStatus === status;
    }).length;
  };

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

        <div className="booking-filter-wrapper" style={{ marginTop: 16, marginBottom: 16 }}>
          <span className="booking-filter-label">Filter by:</span>
          <div
            className="booking-filter-controls"
            style={{ display: 'flex', gap: 12, alignItems: 'center' }}
          >
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
              <option value="all">ស្ថានភាព: ទាំងអស់ ({bookings.length})</option>
              <option value="pending">រង់ចាំ ({countByStatus('pending')})</option>
              <option value="approved">អនុម័ត ({countByStatus('approved')})</option>
              <option value="rejected">បដិសេធ ({countByStatus('rejected')})</option>
            </select>

            <select
              value={filterAssigned}
              onChange={(e) => {
                setFilterAssigned(e.target.value as 'all' | 'assigned' | 'unassigned');
                setCurrentPage(1);
              }}
              className="booking-filter-select"
            >
              <option value="all">បច្ចេកទេស: ទាំងអស់</option>
              <option value="assigned">
                បានចាត់តាំង ({bookings.filter((b) => b.assigned_technical).length})
              </option>
              <option value="unassigned">
                មិនទាន់ចាត់តាំង ({bookings.filter((b) => !b.assigned_technical).length})
              </option>
            </select>

            <button
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
                setFilterAssigned('all');
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

      {/* Main Header with Title, Date Selector and Button */}
      <div
        className="booking-main-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          padding: '20px 24px',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Icon name="booking" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
              គ្រប់គ្រងការកក់
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0 0' }}>
              គ្រប់គ្រងការកក់សេវាកម្ម និងផលិតផល
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* View Toggle Button */}
          <button
            onClick={() => setShowAllBookings(!showAllBookings)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: showAllBookings ? '#3b82f6' : '#fff',
              color: showAllBookings ? '#fff' : '#374151',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{showAllBookings ? '📅' : '📋'}</span>
            {showAllBookings ? 'បង្ហាញតាមថ្ងៃ' : 'បង្ហាញទាំងអស់'}
          </button>

          {/* Date Picker */}
          {!showAllBookings && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: 14, color: '#6b7280' }}>📅</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              />
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 18 }}>+</span>
            បង្កើតការកក់ថ្មី
          </button>
        </div>
      </div>

      {/* Booking Summary for Selected Date */}
      <div
        style={{
          marginBottom: 20,
          padding: 16,
          background: '#f9fafb',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
          {showAllBookings ? 'សង្ខេបការកក់ទាំងអស់:' : `សង្ខេបការកក់សម្រាប់ថ្ងៃ ${selectedDate}:`}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }}
            ></span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>រង់ចាំ:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>
              {countByStatus('pending')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}
            ></span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>អនុម័ត:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>
              {countByStatus('approved')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}
            ></span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>បដិសេធ:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#dc2626' }}>
              {countByStatus('rejected')}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 14, color: '#6b7280' }}>
            សរុប:{' '}
            <span style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>
              {bookings.length}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Table */}
      <div className="booking-table-container">
        {loadingBookings ? (
          <div className="booking-empty">
            <Icon name="booking" size={48} />
            <p>កំពុងផ្ទុកការកក់...</p>
          </div>
        ) : paginatedBookings.length === 0 ? (
          <div className="booking-empty">
            <Icon name="booking" size={48} />
            <p>មិនមានការកក់ទេ</p>
          </div>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>អតិថិជន</th>
                <th>យានយន្ត</th>
                <th>កាលបរិច្ឆេទ</th>
                <th>ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking, idx) => (
                <tr
                  key={`booking-${booking.booking_id || booking.id || idx}`}
                  onClick={() => openDetailModal(booking)}
                  className="booking-row-clickable"
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">
                        {booking.full_name ||
                          booking.customer?.full_name ||
                          booking.customerName ||
                          (booking as any).customer_name ||
                          (booking as any).user?.full_name ||
                          (booking as any).user?.name ||
                          'Unknown'}
                      </div>
                      <div className="customer-vehicle" style={{ fontSize: 12, color: '#6b7280' }}>
                        {booking.contact_phone ||
                          booking.customer?.phone ||
                          (booking as any).phone ||
                          (booking as any).customer_phone ||
                          (booking as any).user?.phone ||
                          ''}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="service-cell">
                      <span className="service-name">
                        {booking.car_make} {booking.car_model}
                      </span>
                      <span className="booking-code" style={{ fontSize: 12, color: '#6b7280' }}>
                        {booking.car_year} • {booking.car_engine}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="service-cell">
                      <span className="service-name">{booking.appointment_date}</span>
                      <span className="booking-code" style={{ fontSize: 12, color: '#6b7280' }}>
                        {booking.start_time}
                      </span>
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
          <div
            className="modal-content-booking"
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: 600, maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-booking">
              <h2>ព័ត៌មានលម្អិតការកក់ #{selectedBooking.booking_id || selectedBooking.id}</h2>
              <button
                className="modal-close-btn"
                onClick={closeDetailModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body-booking">
              {/* Status & Price Header */}
              <div
                className="booking-detail-section"
                style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 20 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <span className="detail-label">ស្ថានភាព:</span>
                  <span
                    className={`status-badge-modal ${getStatusBadgeClass(selectedBooking.status)}`}
                  >
                    {getStatusText(selectedBooking.status)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span className="detail-label">តម្លៃសរុប:</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
                    ${selectedBooking.total_price || 0}
                  </span>
                </div>
                {selectedBooking.payment_status && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <span className="detail-label">ស្ថានភាពទូទាត់:</span>
                    <span style={{ textTransform: 'capitalize', fontSize: 13, color: '#6b7280' }}>
                      {selectedBooking.payment_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="booking-detail-section">
                <h3
                  className="section-title"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Icon name="profile" size={18} />
                  ព័ត៌មានអតិថិជន
                </h3>
                <div className="detail-row">
                  <span className="detail-label">ឈ្មោះ:</span>
                  <span className="detail-value">
                    {selectedBooking.customer?.full_name || selectedBooking.customerName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ទូរស័ព្ទ:</span>
                  <span className="detail-value">
                    {selectedBooking.contact_phone || selectedBooking.customer?.phone}
                  </span>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="booking-detail-section">
                <h3
                  className="section-title"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Icon name="services" size={18} />
                  ព័ត៌មានយានយន្ត
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="detail-row">
                    <span className="detail-label">ម៉ាក:</span>
                    <span className="detail-value">{selectedBooking.car_make}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ម៉ូដែល:</span>
                    <span className="detail-value">{selectedBooking.car_model}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ឆ្នាំ:</span>
                    <span className="detail-value">{selectedBooking.car_year}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ម៉ាស៊ីន:</span>
                    <span className="detail-value">{selectedBooking.car_engine}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="booking-detail-section">
                <h3
                  className="section-title"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Icon name="calendar" size={18} />
                  កាលបរិច្ឆេទ និងទីតាំង
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="detail-row">
                    <span className="detail-label">កាលបរិច្ឆេទ:</span>
                    <span className="detail-value">{selectedBooking.appointment_date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ម៉ោង:</span>
                    <span className="detail-value">{selectedBooking.start_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ទីតាំង:</span>
                    <span className="detail-value">
                      {selectedBooking.service_location === 'garage' ? 'ហ្គារ៉ាស់' : 'ផ្ទះ'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ប្រភព:</span>
                    <span className="detail-value">{selectedBooking.source}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {selectedBooking.note && (
                <div className="booking-detail-section">
                  <h3 className="section-title">ចំណាំ</h3>
                  <p
                    className="detail-description"
                    style={{ background: '#fef3c7', padding: 12, borderRadius: 6 }}
                  >
                    {selectedBooking.note}
                  </p>
                </div>
              )}

              {/* Internal Note */}
              {selectedBooking.internal_note && (
                <div className="booking-detail-section">
                  <h3 className="section-title">ចំណាំផ្ទៃក្នុង</h3>
                  <p
                    className="detail-description"
                    style={{ background: '#fee2e2', padding: 12, borderRadius: 6 }}
                  >
                    {selectedBooking.internal_note}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div
                className="booking-detail-section"
                style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 16 }}
              >
                <div className="detail-row" style={{ fontSize: 12, color: '#9ca3af' }}>
                  <span>បង្កើត:</span>
                  <span>
                    {selectedBooking.created_at
                      ? new Date(selectedBooking.created_at).toLocaleString('km-KH')
                      : '-'}
                  </span>
                </div>
                <div className="detail-row" style={{ fontSize: 12, color: '#9ca3af' }}>
                  <span>ធ្វើបច្ចុប្បន្នភាព:</span>
                  <span>
                    {selectedBooking.updated_at
                      ? new Date(selectedBooking.updated_at).toLocaleString('km-KH')
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedBooking.status?.toLowerCase() === 'pending' && (
                <div className="modal-actions" style={{ marginTop: 24 }}>
                  <button
                    className="btn-modal-approve"
                    onClick={() => {
                      handleStatusChange(
                        selectedBooking.booking_id || selectedBooking.id,
                        'approved',
                      );
                    }}
                  >
                    <Icon name="services" size={18} />
                    អនុម័ត
                  </button>
                  <button
                    className="btn-modal-reject"
                    onClick={() => {
                      handleStatusChange(
                        selectedBooking.booking_id || selectedBooking.id,
                        'rejected',
                      );
                    }}
                  >
                    <Icon name="trash" size={18} />
                    បដិសេធ
                  </button>
                </div>
              )}

              {(selectedBooking.status?.toLowerCase() === 'approved' ||
                selectedBooking.status?.toLowerCase() === 'confirmed') && (
                <div className="modal-status-message success">✓ ការកក់នេះត្រូវបានអនុម័ត</div>
              )}

              {selectedBooking.status?.toLowerCase() === 'rejected' && (
                <div className="modal-status-message error">✕ ការកក់នេះត្រូវបានបដិសេធ</div>
              )}

              {/* Technical Team Assignment - Show for all statuses but only assignable for approved */}
              <div
                className="booking-detail-section"
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: 12,
                  border: '1px solid #86efac',
                }}
              >
                <h3
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#166534',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Icon name="staff" size={16} />
                  </div>
                  ការចាត់តាំងបុគ្គលិកបច្ចេកទេស
                </h3>

                {selectedBooking.assigned_technical ? (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      background: '#fff',
                      borderRadius: 10,
                      border: '2px solid #86efac',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        {selectedBooking.assigned_technical.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>
                          {selectedBooking.assigned_technical.name}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 2,
                          }}
                        >
                          📞 {selectedBooking.assigned_technical.phone_number || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 14,
                      background: '#fef2f2',
                      borderRadius: 10,
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <span style={{ fontSize: 14, color: '#dc2626', fontWeight: 500 }}>
                      មិនទាន់មានបុគ្គលិកបច្ចេកទេសចាត់តាំង
                    </span>
                  </div>
                )}

                {/* Assign Technical Dropdown - Only enabled for approved/confirmed bookings and not already assigned */}
                {(selectedBooking.status?.toLowerCase() === 'approved' ||
                  selectedBooking.status?.toLowerCase() === 'confirmed') &&
                  !selectedBooking.assigned_technical && (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 8,
                            display: 'block',
                          }}
                        >
                          ជ្រើសរើសបុគ្គលិកបច្ចេកទេស
                        </label>
                        {/* Custom Dropdown */}
                        <CustomTechnicalDropdown
                          technicals={technicals}
                          selectedId={selectedTechnicalId}
                          onSelect={setSelectedTechnicalId}
                        />
                      </div>
                      <button
                        onClick={handleAssignTechnical}
                        disabled={!selectedTechnicalId || assigningTechnical}
                        style={{
                          padding: '14px 24px',
                          borderRadius: 10,
                          border: 'none',
                          background: selectedTechnicalId
                            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                            : '#9ca3af',
                          color: '#fff',
                          cursor: selectedTechnicalId ? 'pointer' : 'not-allowed',
                          fontSize: 14,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: selectedTechnicalId
                            ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                            : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {assigningTechnical ? (
                          <>
                            <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                            កំពុង...
                          </>
                        ) : (
                          <>✓ ចាត់តាំង</>
                        )}
                      </button>
                    </div>
                  )}
                {selectedBooking.status?.toLowerCase() !== 'approved' &&
                  selectedBooking.status?.toLowerCase() !== 'confirmed' &&
                  !selectedBooking.assigned_technical && (
                    <div
                      style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic', marginTop: 8 }}
                    >
                      ត្រូវអនុម័តការកក់មុនពេលចាត់តាំងបុគ្គលិក
                    </div>
                  )}
              </div>
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
            <form
              onSubmit={handleSubmit}
              className="booking-form"
              style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 8 }}
            >
              {/* Customer Info Section */}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'var(--brand-red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    1
                  </span>
                  ព័ត៌មានអតិថិជន
                </h3>
                <div className="booking-form-grid">
                  <div className="booking-form-group">
                    <label htmlFor="booking-phone">ទូរស័ព្ទ *</label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                      }}
                      placeholder="+1234567890"
                      style={{ fontSize: 15 }}
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
                      style={{ fontSize: 15 }}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Info Section */}
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'var(--brand-red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    2
                  </span>
                  ព័ត៌មានយានយន្ត
                </h3>
                <div className="booking-form-grid">
                  <div className="booking-form-group">
                    <label htmlFor="booking-car-make">ម៉ាករថយន្ត *</label>
                    <select
                      id="booking-car-make"
                      required
                      value={formData.car_make}
                      onChange={(e) => {
                        setFormData({ ...formData, car_make: e.target.value, car_model: '' });
                      }}
                      disabled={loadingData}
                      style={{ fontSize: 15 }}
                    >
                      <option value="">-- ជ្រើសរើសម៉ាក --</option>
                      {uniqueMakes.map((make, idx) => (
                        <option key={`make-${make.make_id}-${idx}`} value={make.name}>
                          {make.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="booking-form-group">
                    <label htmlFor="booking-car-model">ម៉ូដែល *</label>
                    <select
                      id="booking-car-model"
                      required
                      value={formData.car_model}
                      onChange={(e) => {
                        const selectedSpec = filteredSpecs.find(
                          (s) => s.model?.name === e.target.value,
                        );
                        setFormData({
                          ...formData,
                          car_model: e.target.value,
                          car_year: selectedSpec?.year || formData.car_year,
                          car_engine: selectedSpec?.engine || formData.car_engine,
                        });
                      }}
                      disabled={!formData.car_make || loadingData}
                      style={{ fontSize: 15 }}
                    >
                      <option value="">-- ជ្រើសរើសម៉ូដែល --</option>
                      {filteredSpecs.map((spec, idx) => (
                        <option key={`spec-${spec.vehicle_id}-${idx}`} value={spec.model?.name}>
                          {spec.model?.name} ({spec.year})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="booking-form-group">
                    <label htmlFor="booking-car-year">ឆ្នាំ</label>
                    <input
                      id="booking-car-year"
                      type="number"
                      value={formData.car_year}
                      readOnly
                      style={{ fontSize: 15, background: '#f3f4f6', cursor: 'not-allowed' }}
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
                      style={{ fontSize: 15 }}
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Section */}
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'var(--brand-red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    3
                  </span>
                  កាលបរិច្ឆេទ និងទីតាំង
                </h3>
                <div className="booking-form-grid">
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
                      style={{ fontSize: 15 }}
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
                      style={{ fontSize: 15 }}
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
                      style={{ fontSize: 15 }}
                    >
                      <option value="garage">ហ្គារ៉ាស់ (Garage)</option>
                      <option value="home">ផ្ទះ (Home Service)</option>
                    </select>
                  </div>
                  <div className="booking-form-group">
                    <label htmlFor="booking-note">ចំណាំ</label>
                    <input
                      id="booking-note"
                      type="text"
                      value={formData.note}
                      onChange={(e) => {
                        setFormData({ ...formData, note: e.target.value });
                      }}
                      placeholder="ព័ត៌មានបន្ថែម..."
                      style={{ fontSize: 15 }}
                    />
                  </div>
                </div>
              </div>

              {/* Products/Services Selection */}
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'var(--brand-red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    4
                  </span>
                  ផលិតផល / សេវាកម្ម *
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        items: [...formData.items, { service_id: 0, product_id: 0, quantity: 1 }],
                      });
                    }}
                    style={{
                      marginLeft: 'auto',
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#10b981',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    + បន្ថែម
                  </button>
                </h3>

                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16 }}>
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: index === formData.items.length - 1 ? 0 : 16,
                        paddingBottom: index === formData.items.length - 1 ? 0 : 16,
                        borderBottom:
                          index === formData.items.length - 1 ? 'none' : '1px solid #e5e7eb',
                      }}
                    >
                      {/* Service Selection */}
                      <div style={{ marginBottom: 12 }}>
                        {index === 0 && (
                          <label
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: 6,
                              display: 'block',
                            }}
                          >
                            សេវាកម្ម
                          </label>
                        )}
                        <select
                          value={item.service_id || ''}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            const val = e.target.value;
                            newItems[index] = { ...item, service_id: val ? Number(val) : 0 };
                            setFormData({ ...formData, items: newItems });
                          }}
                          disabled={loadingData}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 6,
                            border: '1px solid #d1d5db',
                            fontSize: 14,
                            background: '#fff',
                          }}
                        >
                          <option value="">-- ជ្រើសរើសសេវាកម្ម --</option>
                          {services.map((service, sidx) => (
                            <option
                              key={`svc-${service.service_id}-${sidx}`}
                              value={service.service_id}
                            >
                              {service.name} - ${service.garage_price}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Selection */}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ flex: 3 }}>
                          {index === 0 && (
                            <label
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: 6,
                                display: 'block',
                              }}
                            >
                              ផលិតផល
                            </label>
                          )}
                          <select
                            value={item.product_id || ''}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              const val = e.target.value;
                              newItems[index] = { ...item, product_id: val ? Number(val) : 0 };
                              setFormData({ ...formData, items: newItems });
                            }}
                            disabled={loadingData}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 6,
                              border: '1px solid #d1d5db',
                              fontSize: 14,
                              background: '#fff',
                            }}
                          >
                            <option value="">-- ជ្រើសរើសផលិតផល --</option>
                            {products.map((product, pidx) => (
                              <option
                                key={`prod-${product.product_id}-${pidx}`}
                                value={product.product_id}
                              >
                                {product.name} - ${product.selling_price}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1, maxWidth: 100 }}>
                          {index === 0 && (
                            <label
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: 6,
                                display: 'block',
                              }}
                            >
                              ចំនួន
                            </label>
                          )}
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index] = { ...item, quantity: Number(e.target.value) || 1 };
                              setFormData({ ...formData, items: newItems });
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 6,
                              border: '1px solid #d1d5db',
                              fontSize: 14,
                              textAlign: 'center',
                            }}
                          />
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = formData.items.filter((_, i) => i !== index);
                              setFormData({ ...formData, items: newItems });
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 6,
                              border: 'none',
                              background: '#ef4444',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-form-actions" style={{ marginTop: 24 }}>
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

      {/* ================= TELEGRAM LINK MODAL ================= */}
      {showTelegramModal && (
        <div
          className="booking-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTelegramModal(false);
            }
          }}
        >
          <div
            className="booking-modal"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="booking-modal-header">
              <h2>ភ្ជាប់ Telegram</h2>
              <button
                className="booking-modal-close"
                onClick={() => {
                  setShowTelegramModal(false);
                  setTelegramLink('');
                  setCreatedCustomerName('');
                }}
              >
                <Icon name="close" size={24} />
              </button>
            </div>

            <div
              className="booking-modal-body"
              style={{ textAlign: 'center', padding: '32px 24px' }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0088cc 0%, #00a8e6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 40,
                }}
              >
                ✈️
              </div>

              <p style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                ការកក់ត្រូវបានបង្កើតជោគជ័យ!
              </p>
              <p style={{ marginBottom: '8px', color: '#374151' }}>
                អតិថិជន <strong>{createdCustomerName}</strong> អាចភ្ជាប់ Telegram
                ដើម្បីទទួលបានការជូនដំណឹង
              </p>
              <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
                ចម្លងតំណខាងក្រោមផ្ញើទៅអតិថិជនតាម Telegram ឬ SMS
              </p>

              {/* Link Display Box */}
              <div
                style={{
                  background: '#f3f4f6',
                  borderRadius: 12,
                  padding: '16px',
                  marginBottom: '24px',
                  wordBreak: 'break-all',
                  fontSize: '14px',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                }}
              >
                {telegramLink}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(telegramLink);
                    toast.success('តំណត្រូវបានចម្លង!');
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  📋 ចម្លងតំណ
                </button>
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#0088cc',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  ✈️ បើក Telegram
                </a>
              </div>
            </div>

            <div
              className="booking-modal-footer"
              style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}
            >
              <button
                className="booking-btn-secondary"
                onClick={() => {
                  setShowTelegramModal(false);
                  setTelegramLink('');
                  setCreatedCustomerName('');
                }}
                style={{ width: '100%' }}
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
