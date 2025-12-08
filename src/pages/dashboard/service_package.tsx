import React, { useState } from 'react';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  services: string[];
  products: { name: string; quantity: number }[];
  image?: string;
}

interface AvailableService {
  id: string;
  name: string;
  price: number;
}

interface AvailableProduct {
  id: string;
  name: string;
  price: number;
}

export default function ServicePackage() {
  const [packages, setPackages] = useState<ServicePackage[]>([
    {
      id: 'PKG001',
      name: 'Premium oil change',
      description: 'Complete premium car wash package with interior cleaning and waxing service.',
      price: 89.99,
      status: 'active',
      services: ['Oil Change', 'Brake Cleaning', 'Car Wash'],
      products: [
        { name: 'Engine Oil', quantity: 1 },
        { name: 'Brake Fluid', quantity: 2 },
      ],
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=250&fit=crop',
    },
    {
      id: 'PKG002',
      name: 'កញ្ចប់ថែទាំគ្រឿងក្នុងឡាន',
      description: 'Essential maintenance package for regular vehicle care and performance.',
      price: 45.0,
      status: 'active',
      services: ['Oil Change', 'Filter Check'],
      products: [{ name: 'Engine Oil', quantity: 1 }],
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<ServicePackage | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    services: [] as string[],
    products: [] as { name: string; quantity: number }[],
  });

  // Available services and products
  const availableServices: AvailableService[] = [
    { id: 'SRV001', name: 'Oil Change', price: 25 },
    { id: 'SRV002', name: 'Brake Cleaning', price: 30 },
    { id: 'SRV003', name: 'Car Wash', price: 15 },
    { id: 'SRV004', name: 'Filter Check', price: 20 },
    { id: 'SRV005', name: 'Tire Rotation', price: 35 },
    { id: 'SRV006', name: 'Battery Check', price: 10 },
  ];

  const availableProducts: AvailableProduct[] = [
    { id: 'PRD001', name: 'Engine Oil', price: 15 },
    { id: 'PRD002', name: 'Brake Fluid', price: 8 },
    { id: 'PRD003', name: 'Air Filter', price: 12 },
    { id: 'PRD004', name: 'Oil Filter', price: 10 },
    { id: 'PRD005', name: 'Wax Polish', price: 18 },
    { id: 'PRD006', name: 'Tire Shine', price: 7 },
  ];

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentPackage(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      status: 'active',
      services: [],
      products: [],
    });
    setShowModal(true);
  };

  const openEditModal = (pkg: ServicePackage) => {
    setIsEditMode(true);
    setCurrentPackage(pkg);
    setImagePreview(pkg.image || '');
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      status: pkg.status,
      services: [...pkg.services],
      products: [...pkg.products],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPackage(null);
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

  const removeService = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== serviceName),
    }));
  };

  const removeProduct = (productName: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.name !== productName),
    }));
  };

  const addServiceToPackage = (serviceName: string) => {
    if (!formData.services.includes(serviceName)) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, serviceName],
      }));
    }
    setShowServiceDialog(false);
  };

  const addProductToPackage = (productName: string) => {
    const existingProduct = formData.products.find((p) => p.name === productName);
    if (!existingProduct) {
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, { name: productName, quantity: 1 }],
      }));
    }
    setShowProductDialog(false);
  };

  const updateProductQuantity = (productName: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.name === productName ? { ...p, quantity: Math.max(1, quantity) } : p,
      ),
    }));
  };

  const calculateTotalPrice = () => {
    let total = 0;
    formData.services.forEach((serviceName) => {
      const service = availableServices.find((s) => s.name === serviceName);
      if (service) total += service.price;
    });
    formData.products.forEach((product) => {
      const prod = availableProducts.find((p) => p.name === product.name);
      if (prod) total += prod.price * product.quantity;
    });
    return total.toFixed(2);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a package name');
      return;
    }

    const finalPrice = formData.price
      ? parseFloat(formData.price)
      : parseFloat(calculateTotalPrice());

    if (isEditMode && currentPackage) {
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === currentPackage.id
            ? {
                ...pkg,
                name: formData.name,
                description: formData.description,
                price: finalPrice,
                status: formData.status,
                services: formData.services,
                products: formData.products,
                image: imagePreview || pkg.image,
              }
            : pkg,
        ),
      );
      alert('Package updated successfully!');
    } else {
      const newPackage: ServicePackage = {
        id: `PKG${String(packages.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        status: formData.status,
        services: formData.services,
        products: formData.products,
        image: imagePreview,
      };
      setPackages((prev) => [...prev, newPackage]);
      alert('Package created successfully!');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      alert(`Package ${id} deleted!`);
    }
  };

  const autoCalculatePrice = parseFloat(calculateTotalPrice());

  return (
    <div>
      {/* Header */}
      <div className="service-package-header">
        <h1>កញ្ចប់សេវាកម្មទាំងអស់</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បង្កើតកញ្ចប់សេវាកម្មថ្មី
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="service-grid-two-col">
        {packages.map((pkg) => (
          <div key={pkg.id} className="service-card-enhanced">
            <div className="service-card-image">
              <img
                src={
                  pkg.image ||
                  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop'
                }
                alt={pkg.name}
              />
              <span className={`status-badge-overlay ${pkg.status}`}>
                {pkg.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="service-card-body">
              <div className="service-card-header-enhanced">
                <div>
                  <div className="service-card-title">{pkg.name}</div>
                  <div className="service-card-id">#{pkg.id}</div>
                </div>
              </div>

              <div className="service-card-description">{pkg.description}</div>

              <div className="service-card-content">
                <div className="content-section">
                  <div className="content-label">Services Included</div>
                  <div className="content-items">
                    {pkg.services.map((service, idx) => (
                      <span key={idx} className="item-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="content-section">
                  <div className="content-label">Products Included</div>
                  <div className="content-items">
                    {pkg.products.map((product, idx) => (
                      <span key={idx} className="item-tag">
                        {product.name} × {product.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">${pkg.price.toFixed(2)}</div>
                <div className="card-actions">
                  <button
                    className="btn-small btn-edit"
                    onClick={() => {
                      openEditModal(pkg);
                    }}
                  >
                    កែសម្រួល
                  </button>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => {
                      handleDelete(pkg.id);
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
              <h2>{isEditMode ? 'កែសម្រួលកញ្ចប់សេវាកម្ម' : 'បង្កើតកញ្ចប់សេវាកម្មថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Image Upload */}
              <div className="form-section">
                <h3 className="form-section-title">Package Image</h3>
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
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                  <div className="image-upload-actions">
                    <label htmlFor="imageUpload" className="btn-upload">
                      Choose Image
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
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <h3 className="form-section-title">1. Combo Basic Information</h3>
                <div className="form-group">
                  <label className="form-label">Combo ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={isEditMode ? currentPackage?.id : 'AUTO-GENERATED'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Combo Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Premium Wash Combo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Combo Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Short explanation about what the combo includes..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Combo Price ($) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, price: e.target.value }));
                      }}
                    />
                    <div className="auto-price-note">
                      Leave empty for auto-calculation: ${autoCalculatePrice}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Combo Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as 'active' | 'inactive',
                        }));
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Select Services */}
              <div className="form-section">
                <h3 className="form-section-title">2. Select Services (Multiple Selection)</h3>
                <div className="multi-select-container">
                  <div className="select-header">
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      Add services to this combo
                    </span>
                    <button
                      type="button"
                      className="btn-add"
                      onClick={() => {
                        setShowServiceDialog(true);
                      }}
                    >
                      + Add Service
                    </button>
                  </div>
                  <div className="selected-items">
                    {formData.services.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                        No services added yet
                      </div>
                    ) : (
                      formData.services.map((service, idx) => (
                        <div key={idx} className="selected-item">
                          <div className="item-info">
                            <span className="item-name">{service}</span>
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              removeService(service);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Select Products */}
              <div className="form-section">
                <h3 className="form-section-title">3. Select Products (Multiple Selection)</h3>
                <div className="multi-select-container">
                  <div className="select-header">
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      Add products with quantities
                    </span>
                    <button
                      type="button"
                      className="btn-add"
                      onClick={() => {
                        setShowProductDialog(true);
                      }}
                    >
                      + Add Product
                    </button>
                  </div>
                  <div className="selected-items">
                    {formData.products.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                        No products added yet
                      </div>
                    ) : (
                      formData.products.map((product, idx) => (
                        <div key={idx} className="selected-item">
                          <div className="item-info">
                            <span className="item-name">{product.name}</span>
                            <input
                              type="number"
                              className="quantity-input"
                              value={product.quantity}
                              onChange={(e) => {
                                updateProductQuantity(product.name, parseInt(e.target.value) || 1);
                              }}
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              removeProduct(product.name);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="form-section">
                <h3 className="form-section-title">4. Summary (Auto Display)</h3>
                <div className="summary-box">
                  <div className="summary-section">
                    <div className="summary-label">Selected Services:</div>
                    <ul className="summary-list">
                      {formData.services.length === 0 ? (
                        <li>• No services selected</li>
                      ) : (
                        formData.services.map((service, idx) => <li key={idx}>• {service}</li>)
                      )}
                    </ul>
                  </div>
                  <div className="summary-section">
                    <div className="summary-label">Selected Products:</div>
                    <ul className="summary-list">
                      {formData.products.length === 0 ? (
                        <li>• No products selected</li>
                      ) : (
                        formData.products.map((product, idx) => (
                          <li key={idx}>
                            • {product.name} × {product.quantity}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div className="summary-total">
                    <span className="summary-total-label">Total Price:</span>
                    <span className="summary-total-amount">
                      ${formData.price || autoCalculatePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'Update Package' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Selection Dialog */}
      {showServiceDialog && (
        <div
          className="dialog-overlay"
          onClick={() => {
            setShowServiceDialog(false);
          }}
        >
          <div
            className="dialog-box"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="dialog-header">
              <h3>Select a Service</h3>
            </div>
            <div className="dialog-body">
              <div className="dialog-list">
                {availableServices
                  .filter((service) => !formData.services.includes(service.name))
                  .map((service) => (
                    <div
                      key={service.id}
                      className="dialog-item"
                      onClick={() => {
                        addServiceToPackage(service.name);
                      }}
                    >
                      <span className="dialog-item-name">{service.name}</span>
                      <span className="dialog-item-price">${service.price}</span>
                    </div>
                  ))}
                {availableServices.filter((s) => !formData.services.includes(s.name)).length ===
                  0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    All services have been added
                  </div>
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowServiceDialog(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Dialog */}
      {showProductDialog && (
        <div
          className="dialog-overlay"
          onClick={() => {
            setShowProductDialog(false);
          }}
        >
          <div
            className="dialog-box"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="dialog-header">
              <h3>Select a Product</h3>
            </div>
            <div className="dialog-body">
              <div className="dialog-list">
                {availableProducts
                  .filter((product) => !formData.products.find((p) => p.name === product.name))
                  .map((product) => (
                    <div
                      key={product.id}
                      className="dialog-item"
                      onClick={() => {
                        addProductToPackage(product.name);
                      }}
                    >
                      <span className="dialog-item-name">{product.name}</span>
                      <span className="dialog-item-price">${product.price}</span>
                    </div>
                  ))}
                {availableProducts.filter(
                  (p) => !formData.products.find((fp) => fp.name === p.name),
                ).length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    All products have been added
                  </div>
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowProductDialog(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
