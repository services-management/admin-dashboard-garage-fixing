import React, { useState } from 'react';

import ServicePackageCard from './components/ServicePackageCard';

interface ServicePackage {
  id: number;
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
      id: 1,
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
      id: 2,
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    services: [] as string[],
    products: [] as { name: string; quantity: number }[],
  });

  const [errors, setErrors] = useState({
    name: '',
  });

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
    setErrors({ name: '' });
    setShowModal(true);
  };

  const openEditModal = (pkg: ServicePackage) => {
    setIsEditMode(true);
    setCurrentPackage(pkg);
    setImagePreview(pkg.image ?? '');
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      status: pkg.status,
      services: [...pkg.services],
      products: [...pkg.products],
    });
    setErrors({ name: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPackage(null);
    setImagePreview('');
    setErrors({ name: '' });
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
    setErrors({ name: '' });

    let hasError = false;
    const newErrors = { name: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
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
      alert('កញ្ចប់សេវាកម្មត្រូវបានកែប្រែជោគជ័យ!');
    } else {
      const newPackage: ServicePackage = {
        id: Math.max(...packages.map((p) => p.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        status: formData.status,
        services: formData.services,
        products: formData.products,
        image: imagePreview,
      };
      setPackages((prev) => [...prev, newPackage]);
      alert('កញ្ចប់សេវាកម្មត្រូវបានបង្កើតជោគជ័យ!');
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    }
  };

  const autoCalculatePrice = parseFloat(calculateTotalPrice());

  return (
    <div>
      <div className="service-package-header">
        <h1>កញ្ចប់សេវាកម្មទាំងអស់</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បង្កើតកញ្ចប់សេវាកម្មថ្មី
        </button>
      </div>

      <div className="service-grid-two-col">
        {packages.map((pkg) => (
          <ServicePackageCard
            key={pkg.id}
            package={pkg}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Package' : 'Create Package'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-name">
                    Name
                  </label>
                  <input
                    id="sp-name"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                    }}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-price">
                    Price
                  </label>
                  <input
                    id="sp-price"
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, price: e.target.value }));
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-description">
                    Description
                  </label>
                  <textarea
                    id="sp-description"
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, description: e.target.value }));
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-service-input">
                    Services
                  </label>
                  <div className="selected-items">
                    {formData.services.map((s) => (
                      <span key={s} className="item-tag">
                        {s}
                        <button
                          className="btn-remove"
                          onClick={() => {
                            removeService(s);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <input
                      id="sp-service-input"
                      placeholder="Add service"
                      className="form-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = (e.target as HTMLInputElement).value.trim();
                          if (v) {
                            addServiceToPackage(v);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      className="btn-small"
                      type="button"
                      onClick={() => {
                        setShowServiceDialog((s) => !s);
                      }}
                    >
                      Suggestions
                    </button>
                  </div>
                  {showServiceDialog && (
                    <div className="suggestions" style={{ marginTop: 8 }}>
                      {availableServices.map((srv) => (
                        <button
                          key={srv.id}
                          className="btn-small"
                          type="button"
                          onClick={() => {
                            addServiceToPackage(srv.name);
                          }}
                        >
                          {srv.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-product-input">
                    Products
                  </label>
                  <div className="selected-items">
                    {formData.products.map((p) => (
                      <div
                        key={p.name}
                        style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}
                      >
                        <span style={{ minWidth: 160 }}>{p.name}</span>
                        <input
                          type="number"
                          value={p.quantity}
                          onChange={(e) => {
                            updateProductQuantity(p.name, parseInt(e.target.value) || 1);
                          }}
                          style={{ width: 80 }}
                        />
                        <button
                          className="btn-remove"
                          onClick={() => {
                            removeProduct(p.name);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <input
                      id="sp-product-input"
                      className="form-input"
                      placeholder="Add product name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = (e.target as HTMLInputElement).value.trim();
                          if (v) {
                            addProductToPackage(v);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      className="btn-small"
                      type="button"
                      onClick={() => {
                        setShowProductDialog((s) => !s);
                      }}
                    >
                      Suggestions
                    </button>
                    {showProductDialog && (
                      <div className="suggestions" style={{ marginTop: 8 }}>
                        {availableProducts.map((prd) => (
                          <button
                            key={prd.id}
                            className="btn-small"
                            type="button"
                            onClick={() => {
                              addProductToPackage(prd.name);
                            }}
                          >
                            {prd.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sp-image">
                    Image
                  </label>
                  <input id="sp-image" type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Auto Calculated Price</div>
                  <div className="form-input">${autoCalculatePrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'Update Package' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
