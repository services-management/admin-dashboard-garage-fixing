import React, { useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  products: { name: string; quantity: number }[];
  image?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '0001',
      name: 'ការផ្លាស់ប្តូរប្រេងម៉ាស៊ីន',
      description: 'ផ្លាស់ប្តូរប្រេងម៉ាស៊ីនដោយប្រើប្រេងដែលមានគុណភាពខ្ពស់',
      price: 25.0,
      status: 'active',
      products: [{ name: 'Engine Oil', quantity: 1 }],
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=250&fit=crop',
    },
    {
      id: '0002',
      name: 'សម្អាតខាងក្នុង',
      description: 'សម្អាតខាងក្នុងរថយន្តឱ្យស្អាតស្អំ',
      price: 15.0,
      status: 'active',
      products: [],
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=250&fit=crop',
    },
    {
      id: '0003',
      name: 'ពិនិត្យប្រេកង់',
      description: 'ពិនិត្យនិងជួសជុលប្រព័ន្ធប្រេកង់',
      price: 30.0,
      status: 'active',
      products: [{ name: 'Brake Fluid', quantity: 1 }],
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=250&fit=crop',
    },
    {
      id: '0004',
      name: 'ផ្លាស់ប្តូរកង់',
      description: 'ផ្លាស់ប្តូរកង់ទៅកង់ថ្មី',
      price: 80.0,
      status: 'inactive',
      products: [],
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    products: [] as { name: string; quantity: number }[],
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentService(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      status: 'active',
      products: [],
    });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setImagePreview(service.image ?? '');
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      status: service.status,
      products: [...service.products],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentService(null);
    setImagePreview('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProductToService = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 1 }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateProductName = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p, i) => (i === index ? { ...p, name } : p)),
    }));
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, quantity: Math.max(1, quantity) } : p,
      ),
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('សូមបញ្ចូលឈ្មោះសេវាកម្ម');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ');
      return;
    }

    const finalPrice = parseFloat(formData.price);

    if (isEditMode && currentService) {
      setServices((prev) =>
        prev.map((srv) =>
          srv.id === currentService.id
            ? {
                ...srv,
                name: formData.name,
                description: formData.description,
                price: finalPrice,
                status: formData.status,
                products: formData.products,
                image: imagePreview || srv.image,
              }
            : srv,
        ),
      );
      alert('សេវាកម្មត្រូវបានកែប្រែជោគជ័យ!');
    } else {
      const newService: Service = {
        id: String(services.length + 1).padStart(4, '0'),
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        status: formData.status,
        products: formData.products,
        image: imagePreview,
      };
      setServices((prev) => [...prev, newService]);
      alert('សេវាកម្មត្រូវបានបង្កើតជោគជ័យ!');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុបសេវាកម្មនេះមែនទេ?')) {
      setServices((prev) => prev.filter((srv) => srv.id !== id));
      alert(`សេវាកម្ម ${id} ត្រូវបានលុប!`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="service-package-header">
        <h1>សេវាកម្មទាំងអស់</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បន្ថែមសេវាកម្មថ្មី
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="service-grid-two-col">
        {services.map((service) => (
          <div key={service.id} className="service-card-enhanced">
            <div className="service-card-image">
              <img
                src={
                  service.image ??
                  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop'
                }
                alt={service.name}
              />
              <span className={`status-badge-overlay ${service.status}`}>
                {service.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="service-card-body">
              <div className="service-card-header-enhanced">
                <div>
                  <div className="service-card-title">{service.name}</div>
                  <div className="service-card-id">#{service.id}</div>
                </div>
              </div>

              <div className="service-card-description">{service.description}</div>

              <div className="service-card-content">
                <div className="content-section">
                  <div className="content-label">ផលិតផលប្រើប្រាស់</div>
                  <div className="content-items">
                    {service.products.length === 0 ? (
                      <span className="item-tag">មិនមានផលិតផលបញ្ជាក់</span>
                    ) : (
                      service.products.map((product) => (
                        <span key={product.name} className="item-tag">
                          {product.name} × {product.quantity}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">${service.price.toFixed(2)}</div>
                <div className="card-actions">
                  <button
                    className="btn-small btn-edit"
                    onClick={() => {
                      openEditModal(service);
                    }}
                  >
                    កែសម្រួល
                  </button>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => {
                      handleDelete(service.id);
                    }}
                  >
                    លុប
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Modal */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'កែសម្រួលសេវាកម្ម' : 'បង្កើតសេវាកម្មថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Image Upload */}
              <div className="form-section">
                <h3 className="form-section-title">រូបភាពសេវាកម្ម</h3>
                <div className="image-upload-container">
                  <div className="image-preview-box">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="image-placeholder">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>គ្មានរូបភាព</span>
                      </div>
                    )}
                  </div>
                  <div className="image-upload-actions">
                    <label htmlFor="imageUpload" className="btn-upload">
                      ជ្រើសរើសរូបភាព
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => {
                          setImagePreview('');
                        }}
                      >
                        លុបរូបភាព
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <h3 className="form-section-title">ព័ត៌មានមូលដ្ឋាន</h3>
                <div className="form-group">
                  <label htmlFor="serviceId" className="form-label">
                    លេខសម្គាល់សេវាកម្ម
                  </label>
                  <input
                    id="serviceId"
                    type="text"
                    className="form-input"
                    value={isEditMode ? `#${currentService?.id}` : '#AUTO-GENERATED'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serviceName" className="form-label">
                    ឈ្មោះសេវាកម្ម *
                  </label>
                  <input
                    id="serviceName"
                    type="text"
                    className="form-input"
                    placeholder="បញ្ចូលឈ្មោះសេវាកម្ម"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serviceDescription" className="form-label">
                    ពិពណ៌នាសេវាកម្ម
                  </label>
                  <textarea
                    id="serviceDescription"
                    className="form-textarea"
                    placeholder="បញ្ចូលការពិពណ៌នាសេវាកម្ម..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="servicePrice" className="form-label">
                      តម្លៃ ($) *
                    </label>
                    <input
                      id="servicePrice"
                      type="number"
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, price: e.target.value }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="serviceStatus" className="form-label">
                      ស្ថានភាព *
                    </label>
                    <select
                      id="serviceStatus"
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as 'active' | 'inactive',
                        }));
                      }}
                    >
                      <option value="active">សកម្ម</option>
                      <option value="inactive">អសកម្ម</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Select Products */}
              <div className="form-section">
                <h3 className="form-section-title">ផលិតផលប្រើប្រាស់</h3>
                <div className="multi-select-container">
                  <div className="select-header">
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      បន្ថែមផលិតផលដែលប្រើក្នុងសេវាកម្ម
                    </span>
                    <button type="button" className="btn-add" onClick={addProductToService}>
                      + បន្ថែមផលិតផល
                    </button>
                  </div>
                  <div className="selected-items">
                    {formData.products.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                        មិនទាន់មានផលិតផល
                      </div>
                    ) : (
                      formData.products.map((product, idx) => (
                        <div key={`product-${idx}-${product.name}`} className="selected-item">
                          <div className="item-info">
                            <input
                              type="text"
                              className="item-name-input"
                              placeholder="ឈ្មោះផលិតផល"
                              value={product.name}
                              onChange={(e) => {
                                updateProductName(idx, e.target.value);
                              }}
                              style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                fontSize: '14px',
                                width: '200px',
                              }}
                            />
                            <input
                              type="number"
                              className="quantity-input"
                              value={product.quantity}
                              onChange={(e) => {
                                updateProductQuantity(idx, parseInt(e.target.value) || 1);
                              }}
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              removeProduct(idx);
                            }}
                          >
                            លុបផលិតផល
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={closeModal}>
                បោះបង់
              </button>
              <button type="button" className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'រក្សាទុក' : 'បង្កើត'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
