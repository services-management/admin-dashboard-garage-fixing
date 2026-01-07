import React, { useState } from 'react';

// TODO: For API integration, products should reference productId instead of name
// Current: { name: string; quantity: number }
// Future: { productId: number; quantity: number } + lookup table for display
interface ServiceProduct {
  name: string; // For mock data - will be replaced by productId
  quantity: number;
  productId?: number; // Prepare for API: actual product reference
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  products: ServiceProduct[];
  image?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'ការផ្លាស់ប្តូរប្រេងម៉ាស៊ីន',
      description: 'ផ្លាស់ប្តូរប្រេងម៉ាស៊ីនដោយប្រើប្រេងដែលមានគុណភាពខ្ពស់',
      price: 25.0,
      status: 'active',
      products: [{ name: 'Engine Oil', quantity: 1 }],
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      name: 'សម្អាតខាងក្នុង',
      description: 'សម្អាតខាងក្នុងរថយន្តឱ្យស្អាតស្អំ',
      price: 15.0,
      status: 'active',
      products: [],
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=250&fit=crop',
    },
    {
      id: 3,
      name: 'ពិនិត្យប្រេកង់',
      description: 'ពិនិត្យនិងជួសជុលប្រព័ន្ធប្រេកង់',
      price: 30.0,
      status: 'active',
      products: [{ name: 'Brake Fluid', quantity: 1 }],
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=250&fit=crop',
    },
    {
      id: 4,
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    products: [] as ServiceProduct[],
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
        id: Math.max(...services.map((s) => s.id), 0) + 1,
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

  const handleDelete = (id: number) => {
    if (confirm('តើអ្នកពិតជាចង់លុបសេវាកម្មនេះមែនទេ?')) {
      setServices((prev) => prev.filter((srv) => srv.id !== id));
      alert(`សេវាកម្ម ${String(id)} ត្រូវបានលុប!`);
    }
  };

  return (
    <div>
      <div className="service-package-header">
        <h1>សេវាកម្មទាំងអស់</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បន្ថែមសេវាកម្មថ្មី
        </button>
      </div>

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
                  <div className="service-card-id">#{String(service.id).padStart(4, '0')}</div>
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
                      service.products.map((product, idx) => (
                        <span key={`${product.name}-${String(idx)}`} className="item-tag">
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

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Service' : 'Create Service'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="service-name">
                    Name
                  </label>
                  <input
                    id="service-name"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="service-price">
                    Price
                  </label>
                  <input
                    id="service-price"
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
                  <label className="form-label" htmlFor="service-description">
                    Description
                  </label>
                  <textarea
                    id="service-description"
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
                  <label className="form-label" htmlFor="service-status">
                    Status
                  </label>
                  <select
                    id="service-status"
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as 'active' | 'inactive',
                      }));
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="service-image">
                    Image
                  </label>
                  <input
                    id="service-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Products</div>
                  {/* TODO: For API integration:
                      - Replace text input with dropdown/autocomplete of available products
                      - Store productId instead of name
                      - Display product name from lookup table/API response
                      Example: <select onChange={e => updateProductId(i, parseInt(e.target.value))}>
                               {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                             </select>
                  */}
                  <div>
                    {formData.products.map((p, i) => (
                      <div
                        key={`${p.name}-${String(i)}`}
                        style={{ display: 'flex', gap: 8, marginBottom: 6 }}
                      >
                        <input
                          value={p.name}
                          className="form-input"
                          onChange={(e) => {
                            updateProductName(i, e.target.value);
                          }}
                          placeholder="Product name"
                        />
                        <input
                          type="number"
                          className="form-input"
                          value={p.quantity}
                          onChange={(e) => {
                            updateProductQuantity(i, parseInt(e.target.value) || 1);
                          }}
                          style={{ width: 80 }}
                        />
                        <button
                          className="btn-remove"
                          onClick={() => {
                            removeProduct(i);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn-small" onClick={addProductToService}>
                      + Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'Update Service' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
