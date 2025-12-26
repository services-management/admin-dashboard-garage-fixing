import { useState } from 'react';

import Icon from '../../components/Icons';

// TypeScript Types
type InvoiceStatus = 'draft' | 'paid' | 'cancelled';
type ModalMode = 'create' | 'view' | 'edit';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  plateNumber: string;
  vehicle: string;
  issueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  bookingId?: string;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  plateNumber: string;
  vehicle: string;
  issueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  notes: string;
}

type StatusFilter = 'all' | 'draft' | 'paid' | 'cancelled';

export default function Invoices() {
  // Sample Data - 5 invoices with plate numbers
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2025-001',
      customerName: 'សុខ ចន្ទា',
      customerEmail: 'chantha@email.com',
      customerPhone: '012-345-678',
      plateNumber: 'PP-1234',
      vehicle: 'Toyota Camry 2020',
      issueDate: '2025-12-20',
      status: 'paid',
      bookingId: 'BK-001',
      items: [
        { id: '1', description: 'ប្រេងម៉ាស៊ីន', quantity: 4, unitPrice: 12.5, total: 50 },
        { id: '2', description: 'ការធ្វើសេវាកម្មប្រេង', quantity: 1, unitPrice: 25, total: 25 },
      ],
      subtotal: 75,
      taxRate: 10,
      taxAmount: 7.5,
      discount: 5,
      total: 77.5,
      notes: 'អតិថិជនប្រចាំ',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-002',
      customerName: 'វិចិត្រា ឃុន',
      customerEmail: 'vichitra@email.com',
      customerPhone: '011-222-333',
      plateNumber: 'PP-5678',
      vehicle: 'Honda Civic 2019',
      issueDate: '2025-12-21',
      status: 'draft',
      bookingId: 'BK-002',
      items: [
        { id: '1', description: 'ប្រេកខាងមុខ', quantity: 2, unitPrice: 45, total: 90 },
        { id: '2', description: 'ប្រេកខាងក្រោយ', quantity: 2, unitPrice: 40, total: 80 },
        { id: '3', description: 'ការដំឡើង', quantity: 1, unitPrice: 30, total: 30 },
      ],
      subtotal: 200,
      taxRate: 10,
      taxAmount: 20,
      discount: 0,
      total: 220,
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-003',
      customerName: 'ប៉ូលីន ហេង',
      customerEmail: 'polin@email.com',
      customerPhone: '015-444-555',
      plateNumber: 'PP-9012',
      vehicle: 'Mazda 3 2021',
      issueDate: '2025-12-22',
      status: 'paid',
      items: [
        { id: '1', description: 'សម្អាតឡានពេញលេញ', quantity: 1, unitPrice: 50, total: 50 },
        { id: '2', description: 'ជ័រខាងក្នុង', quantity: 1, unitPrice: 30, total: 30 },
      ],
      subtotal: 80,
      taxRate: 10,
      taxAmount: 8,
      discount: 10,
      total: 78,
      notes: 'បញ្ចុះតម្លៃ 10%',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-004',
      customerName: 'រតនា សុវណ្ណ',
      customerEmail: 'ratana@email.com',
      customerPhone: '017-666-777',
      plateNumber: 'PP-3456',
      vehicle: 'BMW 320i 2022',
      issueDate: '2025-12-23',
      status: 'cancelled',
      bookingId: 'BK-004',
      items: [
        { id: '1', description: 'ការពិនិត្យម៉ាស៊ីន', quantity: 1, unitPrice: 100, total: 100 },
      ],
      subtotal: 100,
      taxRate: 10,
      taxAmount: 10,
      discount: 0,
      total: 110,
      notes: 'លុបចោលដោយអតិថិជន',
    },
    {
      id: 5,
      invoiceNumber: 'INV-2025-005',
      customerName: 'ម៉េងលី ផាន',
      customerEmail: 'mengly@email.com',
      customerPhone: '012-888-999',
      plateNumber: 'PP-7890',
      vehicle: 'Lexus RX350 2023',
      issueDate: '2025-12-24',
      status: 'draft',
      items: [
        { id: '1', description: 'កញ្ចប់ថែទាំពេញលេញ', quantity: 1, unitPrice: 200, total: 200 },
        {
          id: '2',
          description: 'ផ្លាស់ប្តូរថ្នាំបញ្ចេញសម្បុរ',
          quantity: 1,
          unitPrice: 80,
          total: 80,
        },
        { id: '3', description: 'ពិនិត្យប្រព័ន្ធត្រជាក់', quantity: 1, unitPrice: 50, total: 50 },
      ],
      subtotal: 330,
      taxRate: 10,
      taxAmount: 33,
      discount: 20,
      total: 343,
      notes: 'សេវាកម្មពិសេស',
    },
    {
      id: 6,
      invoiceNumber: 'INV-2025-006',
      customerName: 'ចន្ទ្រា អ៊ុក',
      customerEmail: 'chandra@email.com',
      customerPhone: '016-111-222',
      plateNumber: 'PP-1122',
      vehicle: 'Mercedes-Benz E-Class 2022',
      issueDate: '2025-12-25',
      status: 'paid',
      bookingId: 'BK-006',
      items: [
        { id: '1', description: 'ផ្លាស់ប្តូរសំបកកង់', quantity: 4, unitPrice: 60, total: 240 },
        { id: '2', description: 'ការតម្រឹមកង់', quantity: 4, unitPrice: 15, total: 60 },
      ],
      subtotal: 300,
      taxRate: 10,
      taxAmount: 30,
      discount: 15,
      total: 315,
      notes: 'បានបង់គ្រប់ជាមួយលក់',
    },
    {
      id: 7,
      invoiceNumber: 'INV-2025-007',
      customerName: 'ពិសី យឹម',
      customerEmail: 'pisey@email.com',
      customerPhone: '093-333-444',
      plateNumber: 'PP-3344',
      vehicle: 'Audi A4 2020',
      issueDate: '2025-12-26',
      status: 'draft',
      items: [
        { id: '1', description: 'ពិនិត្យម៉ាស៊ីនរថយន្ត', quantity: 1, unitPrice: 120, total: 120 },
        { id: '2', description: 'ជំនួសទឹកម៉ាស៊ីន', quantity: 5, unitPrice: 8, total: 40 },
      ],
      subtotal: 160,
      taxRate: 10,
      taxAmount: 16,
      discount: 0,
      total: 176,
    },
    {
      id: 8,
      invoiceNumber: 'INV-2025-008',
      customerName: 'សុភ័ក្រា លី',
      customerEmail: 'sophea@email.com',
      customerPhone: '077-555-666',
      plateNumber: 'PP-5566',
      vehicle: 'Volvo XC90 2023',
      issueDate: '2025-12-27',
      status: 'paid',
      bookingId: 'BK-008',
      items: [
        { id: '1', description: 'ការថែទាំប្រចាំឆ្នាំ', quantity: 1, unitPrice: 350, total: 350 },
        { id: '2', description: 'ពិនិត្យសុវត្ថិភាព', quantity: 1, unitPrice: 80, total: 80 },
      ],
      subtotal: 430,
      taxRate: 10,
      taxAmount: 43,
      discount: 30,
      total: 443,
      notes: 'កញ្ចប់ប្រចាំឆ្នាំ VIP',
    },
  ]);

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('view');
  const [currentPage, setCurrentPage] = useState(1);

  const initialFormData: FormData = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    plateNumber: '',
    vehicle: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 10,
    discount: 0,
    notes: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Calculate totals from formData.items
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount - formData.discount;
    return { subtotal, taxAmount, total };
  };

  // Update item total when quantity or unitPrice changes
  const updateItemTotal = (
    itemId: string,
    field: 'description' | 'quantity' | 'unitPrice',
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  // Add new empty item row
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  // Remove item (keep minimum 1)
  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormData);
    setSelectedInvoice(null);
    setShowModal(true);
  };

  // Open view modal
  const openViewModal = (invoice: Invoice) => {
    setModalMode('view');
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = () => {
    if (selectedInvoice) {
      setModalMode('edit');
      setFormData({
        customerName: selectedInvoice.customerName,
        customerEmail: selectedInvoice.customerEmail,
        customerPhone: selectedInvoice.customerPhone,
        plateNumber: selectedInvoice.plateNumber || '',
        vehicle: selectedInvoice.vehicle,
        issueDate: selectedInvoice.issueDate,
        status: selectedInvoice.status,
        items: selectedInvoice.items,
        taxRate: selectedInvoice.taxRate,
        discount: selectedInvoice.discount,
        notes: selectedInvoice.notes ?? '',
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
    setFormData(initialFormData);
    setModalMode('view');
  };

  // Handle save (create or edit)
  const handleSave = (markAsPaid = false) => {
    const { subtotal, taxAmount, total } = calculateTotals();
    const finalStatus = markAsPaid ? 'paid' : formData.status;

    if (modalMode === 'create') {
      const newInvoice: Invoice = {
        id: invoices.length + 1,
        invoiceNumber: `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        plateNumber: formData.plateNumber,
        vehicle: formData.vehicle,
        issueDate: formData.issueDate,
        status: finalStatus,
        items: formData.items,
        subtotal,
        taxRate: formData.taxRate,
        taxAmount,
        discount: formData.discount,
        total,
        notes: formData.notes,
      };
      setInvoices([...invoices, newInvoice]);
    } else if (modalMode === 'edit' && selectedInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === selectedInvoice.id
            ? {
                ...inv,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                plateNumber: formData.plateNumber,
                vehicle: formData.vehicle,
                issueDate: formData.issueDate,
                status: finalStatus,
                items: formData.items,
                subtotal,
                taxRate: formData.taxRate,
                taxAmount,
                discount: formData.discount,
                total,
                notes: formData.notes,
              }
            : inv,
        ),
      );
    }
    closeModal();
  };

  // Mark as paid
  const handleMarkAsPaid = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.map((inv) => (inv.id === selectedInvoice.id ? { ...inv, status: 'paid' } : inv)),
      );
      closeModal();
    }
  };

  // Cancel invoice
  const handleCancelInvoice = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === selectedInvoice.id ? { ...inv, status: 'cancelled' } : inv,
        ),
      );
      closeModal();
    }
  };

  // Filter and search
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === 'draft').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    cancelled: invoices.filter((i) => i.status === 'cancelled').length,
  };

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  const countByStatus = (status: string) => invoices.filter((i) => i.status === status).length;

  return (
    <div className="booking-admin-container">
      {/* Header */}
      <div className="booking-page-header">
        <div className="booking-page-header-content">
          <div className="booking-page-header-left">
            <h2 className="booking-page-title">វិក្កយបត្រ</h2>
            <p className="booking-page-subtitle">គ្រប់គ្រងវិក្កយបត្រទាំងអស់</p>
          </div>
          <div className="booking-header-stats">
            <span className="booking-stat-badge booking-stat-total">សរុប: {stats.total}</span>
            <span className="booking-stat-badge booking-stat-pending">ព្រាង: {stats.draft}</span>
            <span className="booking-stat-badge booking-stat-approved">បានបង់: {stats.paid}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="booking-stats-container">
        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>វិក្កយបត្រសរុប</h3>
            <p>{stats.total}</p>
          </div>
          <div className="booking-stat-icon booking-icon-service">
            <Icon name="invoices" size={28} />
          </div>
        </div>
        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>ព្រាង</h3>
            <p>{stats.draft}</p>
          </div>
          <div className="booking-stat-icon booking-icon-package">
            <Icon name="box" size={28} />
          </div>
        </div>
        <div className="booking-stat-box">
          <div className="booking-stat-info">
            <h3>បានបង់</h3>
            <p>{stats.paid}</p>
          </div>
          <div className="booking-stat-icon booking-icon-product">
            <Icon name="services" size={28} />
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
              placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ, ឈ្មោះអតិថិជន, ឬរថយន្ត..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="booking-search-input"
            />
          </div>
        </div>

        <div className="booking-filter-wrapper">
          <span className="booking-filter-label">Filter by:</span>
          <div className="booking-filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              className="booking-filter-select"
            >
              <option value="all">ស្ថានភាព: ទាំងអស់</option>
              <option value="draft">ព្រាង ({countByStatus('draft')})</option>
              <option value="paid">បានបង់ ({countByStatus('paid')})</option>
              <option value="cancelled">បានលុបចោល ({countByStatus('cancelled')})</option>
            </select>

            <button onClick={resetFilters} className="booking-filter-reset">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Header with Create Button */}
      <div className="booking-main-header">
        <h1>គ្រប់គ្រងវិក្កយបត្រ</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បង្កើតវិក្កយបត្រថ្មី
        </button>
      </div>

      {/* Table */}
      <div className="booking-table-container">
        {paginatedInvoices.length === 0 ? (
          <div className="booking-empty">
            <Icon name="invoices" size={48} />
            <p>មិនមានវិក្កយបត្រទេ</p>
          </div>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>លេខវិក្កយបត្រ</th>
                <th>អតិថិជន</th>
                <th>ផ្លាកលេខ</th>
                <th>ការកក់</th>
                <th>ថ្ងៃចេញវិក្កយបត្រ</th>
                <th>តម្លៃ</th>
                <th>ស្ថានភាព</th>
                <th>សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <span className="booking-code">{invoice.invoiceNumber}</span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{invoice.customerName}</div>
                      <div className="customer-vehicle">{invoice.vehicle}</div>
                    </div>
                  </td>
                  <td>
                    <span className="booking-code">{invoice.plateNumber}</span>
                  </td>
                  <td>{invoice.bookingId ?? '-'}</td>
                  <td>{invoice.issueDate}</td>
                  <td>
                    <strong>${invoice.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span
                      className={`status-badge-table ${
                        invoice.status === 'paid'
                          ? 'status-badge-approved'
                          : invoice.status === 'draft'
                            ? 'status-badge-pending'
                            : 'status-badge-cancelled'
                      }`}
                    >
                      {invoice.status === 'paid'
                        ? 'បានបង់'
                        : invoice.status === 'draft'
                          ? 'កំពុងបង្កើត'
                          : 'បានលុបចោល'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-detail"
                      onClick={() => {
                        openViewModal(invoice);
                      }}
                    >
                      មើល
                    </button>
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

      {filteredInvoices.length > 0 && (
        <div className="booking-pagination-info">
          កំពុងបង្ហាញពី {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} ក្នុងចំណោម{' '}
          {filteredInvoices.length} ធាតុ
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="booking-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div className="booking-modal" role="dialog" aria-modal="true">
            <div className="modal-header-booking">
              <h2>
                {modalMode === 'view'
                  ? 'លម្អិតវិក្កយបត្រ'
                  : modalMode === 'create'
                    ? 'បង្កើតវិក្កយបត្រថ្មី'
                    : 'កែប្រែវិក្កយបត្រ'}
              </h2>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                ×
              </button>
            </div>
            <div className="modal-body-booking">
              {modalMode === 'view' && selectedInvoice ? (
                /* VIEW MODE */
                <>
                  <div className="booking-detail-section">
                    <div className="detail-row">
                      <span className="detail-label">លេខវិក្កយបត្រ:</span>
                      <span className="detail-value">{selectedInvoice.customerName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">អ៊ីមែល:</span>
                      <span className="detail-value">{selectedInvoice.customerEmail}</span>
                    </div>
                  </div>

                  <div className="booking-detail-section">
                    <div className="detail-row">
                      <span className="detail-label">ទូរស័ព្ទ:</span>
                      <span className="detail-value">{selectedInvoice.customerPhone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">រថយន្ត:</span>
                      <span className="detail-value">{selectedInvoice.vehicle}</span>
                    </div>
                  </div>

                  {selectedInvoice.bookingId && (
                    <div className="booking-detail-section">
                      <div className="detail-row">
                        <span className="detail-label">ការកក់:</span>
                        <span className="detail-value">#{selectedInvoice.bookingId}</span>
                      </div>
                    </div>
                  )}

                  <div className="booking-detail-section">
                    <h3 className="section-title">ទំនិញ/សេវាកម្ម</h3>
                    <table className="invoice-items-table">
                      <thead>
                        <tr>
                          <th>ពិពណ៌នា</th>
                          <th>បរិមាណ</th>
                          <th>តម្លៃឯកតា</th>
                          <th>សរុប</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>${item.unitPrice.toFixed(2)}</td>
                            <td>${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="booking-detail-section">
                    <div className="invoice-totals">
                      <div className="invoice-total-row">
                        <span>សរុបរង:</span>
                        <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="invoice-total-row">
                        <span>ពន្ធ ({selectedInvoice.taxRate}%):</span>
                        <span>${selectedInvoice.taxAmount.toFixed(2)}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="invoice-total-row">
                          <span>បញ្ចុះតម្លៃ:</span>
                          <span>-${selectedInvoice.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="invoice-total-row invoice-grand-total">
                        <strong>សរុបសរុប:</strong>
                        <strong>${selectedInvoice.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {selectedInvoice.notes && (
                    <div className="booking-detail-section">
                      <h3 className="section-title">ចំណាំ</h3>
                      <p className="detail-description">{selectedInvoice.notes}</p>
                    </div>
                  )}

                  {selectedInvoice.status === 'draft' && (
                    <div className="modal-actions">
                      <button className="btn-modal-edit" onClick={openEditModal}>
                        <Icon name="edit" size={18} />
                        កែប្រែវិក្កយបត្រ
                      </button>
                      <button className="btn-modal-approve" onClick={handleMarkAsPaid}>
                        <Icon name="services" size={18} />
                        សម្គាល់ថាបានបង់
                      </button>
                      <button className="btn-modal-reject" onClick={handleCancelInvoice}>
                        <Icon name="trash" size={18} />
                        លុបចោល
                      </button>
                    </div>
                  )}

                  {selectedInvoice.status === 'paid' && (
                    <div className="modal-status-message success">
                      ✓ វិក្កយបត្រនេះត្រូវបានបង់រួចរាល់
                    </div>
                  )}

                  {selectedInvoice.status === 'cancelled' && (
                    <div className="modal-status-message error">✕ វិក្កយបត្រនេះត្រូវបានលុបចោល</div>
                  )}
                </>
              ) : (
                /* CREATE/EDIT MODE */
                <div className="booking-form">
                  <div className="booking-form-section">
                    <h4>ព័ត៌មានអតិថិជន</h4>
                    <div className="booking-form-grid">
                      <div className="booking-form-group">
                        <label htmlFor="invoice-customer-name">ឈ្មោះអតិថិជន *</label>
                        <input
                          id="invoice-customer-name"
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => {
                            setFormData({ ...formData, customerName: e.target.value });
                          }}
                          placeholder="បញ្ចូលឈ្មោះ"
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-customer-email">អ៊ីមែល *</label>
                        <input
                          id="invoice-customer-email"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => {
                            setFormData({ ...formData, customerEmail: e.target.value });
                          }}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-customer-phone">លេខទូរស័ព្ទ *</label>
                        <input
                          id="invoice-customer-phone"
                          type="text"
                          value={formData.customerPhone}
                          onChange={(e) => {
                            setFormData({ ...formData, customerPhone: e.target.value });
                          }}
                          placeholder="012-xxx-xxx"
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-plate-number">ផ្លាកលេខ *</label>
                        <input
                          id="invoice-plate-number"
                          type="text"
                          value={formData.plateNumber}
                          onChange={(e) => {
                            setFormData({ ...formData, plateNumber: e.target.value });
                          }}
                          placeholder="PP-1234"
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-vehicle">រថយន្ត *</label>
                        <input
                          id="invoice-vehicle"
                          type="text"
                          value={formData.vehicle}
                          onChange={(e) => {
                            setFormData({ ...formData, vehicle: e.target.value });
                          }}
                          placeholder="Toyota Camry 2020"
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-issue-date">ថ្ងៃចេញវិក្កយបត្រ *</label>
                        <input
                          id="invoice-issue-date"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => {
                            setFormData({ ...formData, issueDate: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="booking-form-section">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <h4>ទំនិញ/សេវាកម្ម</h4>
                      <button className="booking-btn-secondary" onClick={addItem}>
                        + បន្ថែមទំនិញ
                      </button>
                    </div>
                    <table className="invoice-items-edit-table">
                      <thead>
                        <tr>
                          <th>ពិពណ៌នា</th>
                          <th style={{ width: '100px' }}>បរិមាណ</th>
                          <th style={{ width: '120px' }}>តម្លៃឯកតា</th>
                          <th style={{ width: '120px' }}>សរុប</th>
                          <th style={{ width: '60px' }} />
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => {
                                  updateItemTotal(item.id, 'description', e.target.value);
                                }}
                                placeholder="ពិពណ៌នាទំនិញ"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  updateItemTotal(item.id, 'quantity', Number(e.target.value));
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  updateItemTotal(item.id, 'unitPrice', Number(e.target.value));
                                }}
                              />
                            </td>
                            <td>
                              <strong>${item.total.toFixed(2)}</strong>
                            </td>
                            <td>
                              <button
                                className="booking-btn-danger-small"
                                onClick={() => {
                                  removeItem(item.id);
                                }}
                                disabled={formData.items.length === 1}
                              >
                                <Icon name="trash" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="booking-form-section">
                    <div
                      className="booking-form-grid"
                      style={{ gridTemplateColumns: '1fr 1fr 2fr' }}
                    >
                      <div className="booking-form-group">
                        <label htmlFor="invoice-tax-rate">អត្រាពន្ធ (%)</label>
                        <input
                          id="invoice-tax-rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.taxRate}
                          onChange={(e) => {
                            setFormData({ ...formData, taxRate: Number(e.target.value) });
                          }}
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="invoice-discount">បញ្ចុះតម្លៃ ($)</label>
                        <input
                          id="invoice-discount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.discount}
                          onChange={(e) => {
                            setFormData({ ...formData, discount: Number(e.target.value) });
                          }}
                        />
                      </div>
                      <div className="invoice-calculation-summary">
                        <div className="invoice-calc-row">
                          <span>សរុបរង:</span>
                          <span>${calculateTotals().subtotal.toFixed(2)}</span>
                        </div>
                        <div className="invoice-calc-row">
                          <span>ពន្ធ ({formData.taxRate}%):</span>
                          <span>${calculateTotals().taxAmount.toFixed(2)}</span>
                        </div>
                        {formData.discount > 0 && (
                          <div className="invoice-calc-row">
                            <span>បញ្ចុះតម្លៃ:</span>
                            <span>-${formData.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="invoice-calc-row invoice-calc-total">
                          <strong>សរុបសរុប:</strong>
                          <strong>${calculateTotals().total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-form-section">
                    <div className="booking-form-group">
                      <label htmlFor="invoice-notes">ចំណាំ</label>
                      <textarea
                        id="invoice-notes"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => {
                          setFormData({ ...formData, notes: e.target.value });
                        }}
                        placeholder="បញ្ចូលចំណាំបន្ថែម..."
                      />
                    </div>
                  </div>

                  <div className="booking-form-actions">
                    <button type="button" className="booking-btn-cancel" onClick={closeModal}>
                      បោះបង់
                    </button>
                    <button
                      type="button"
                      className="booking-btn-submit"
                      onClick={() => {
                        handleSave(false);
                      }}
                    >
                      {modalMode === 'create' ? 'បង្កើតវិក្កយបត្រ' : 'រក្សាទុក'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
