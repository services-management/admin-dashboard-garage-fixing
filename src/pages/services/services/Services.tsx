import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from '../../../store/service/serviceThunk';
import type { Service } from '../../../store/service/serviceTypes';
import { ProductService } from '../../../store/product/productService';

type Product = {
  id: number;
  name: string;
};

export default function Services() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.service.list);

  /* ================= LOCAL UI STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: 60,
    status: 'active' as 'active' | 'inactive',
    products: [] as {
      name: string;
      quantity: number;
      is_optional: boolean;
    }[],
  });

  /* ================= LOAD SERVICES ================= */
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        setProducts(data.items ?? data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };

    loadProducts();
  }, []);

  /* ================= MODAL ================= */
  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentService(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      duration_minutes: 60,
      status: 'active',
      products: [],
    });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setImagePreview(service.image_url || '');

    setFormData({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration_minutes: service.duration_minutes,
      status: service.is_available ? 'active' : 'inactive',
      products: service.associations.map((a) => ({
        name: a.product_name,
        quantity: a.quantity_required,
        is_optional: a.is_optional,
      })),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentService(null);
    setImagePreview('');
  };

  /* ================= IMAGE ================= */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ================= PRODUCTS ================= */
  const addProductToService = () => {
    setFormData((p) => ({
      ...p,
      products: [...p.products, { name: '', quantity: 1, is_optional: false }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((p) => ({
      ...p,
      products: p.products.filter((_, i) => i !== index),
    }));
  };

  const updateProduct = (index: number, key: 'name' | 'quantity' | 'is_optional', value: any) => {
    setFormData((p) => ({
      ...p,
      products: p.products.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.name.trim()) return alert('សូមបញ្ចូលឈ្មោះសេវាកម្ម');
    if (!formData.price || Number(formData.price) <= 0) return alert('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ');

    const payload = {
      name: formData.name,
      description: formData.description,
      image_url: imagePreview,
      price: Number(formData.price),
      duration_minutes: formData.duration_minutes,
      is_available: formData.status === 'active',
      associations: formData.products.map((p) => ({
        product_name: p.name,
        quantity_required: p.quantity,
        is_optional: p.is_optional,
      })),
    };

    if (isEditMode && currentService) {
      await dispatch(
        updateService({
          service_id: currentService.service_id,
          payload,
        }),
      );
      alert('សេវាកម្មត្រូវបានកែប្រែជោគជ័យ!');
    } else {
      await dispatch(createService(payload));
      alert('សេវាកម្មត្រូវបានបង្កើតជោគជ័យ!');
    }

    closeModal();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (confirm('តើអ្នកពិតជាចង់លុបសេវាកម្មនេះមែនទេ?')) {
      await dispatch(deleteService(id));
      alert('សេវាកម្មត្រូវបានលុប!');
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
          <div key={service.service_id} className="service-card-enhanced">
            <div className="service-card-image">
              <img
                src={
                  service.image_url ??
                  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'
                }
                alt={service.name}
              />
              <span
                className={`status-badge-overlay ${service.is_available ? 'active' : 'inactive'}`}
              >
                {service.is_available ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="service-card-body">
              <div className="service-card-title">{service.name}</div>
              <div className="service-card-id">#{String(service.service_id).padStart(4, '0')}</div>

              <div className="service-card-description">{service.description}</div>

              <div className="service-card-content">
                <div className="content-section">
                  <div className="content-label">រយៈពេល</div>
                  <span className="item-tag">{service.duration_minutes} នាទី</span>
                </div>

                <div className="content-section">
                  <div className="content-label">ផលិតផល ({service.associations.length})</div>
                  <div className="content-items">
                    {service.associations.length === 0 ? (
                      <span className="item-tag">មិនមានផលិតផល</span>
                    ) : (
                      service.associations.map((p, i) => (
                        <span key={i} className="item-tag">
                          {p.product_name} × {p.quantity_required}
                          {p.is_optional && ' (Optional)'}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">${service.price.toFixed(2)}</div>
                <div className="card-actions">
                  <button className="btn-small btn-edit" onClick={() => openEditModal(service)}>
                    កែសម្រួល
                  </button>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => handleDelete(service.service_id)}
                  >
                    លុប
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Service' : 'Create Service'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        duration_minutes: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as 'active' | 'inactive',
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Products</label>

                  {formData.products.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <select
                        className="form-input"
                        value={p.name}
                        onChange={(e) => updateProduct(i, 'name', e.target.value)}
                      >
                        <option value="">-- Select Product --</option>
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.name}>
                            {prod.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 90 }}
                        value={p.quantity}
                        onChange={(e) => updateProduct(i, 'quantity', Number(e.target.value) || 1)}
                      />

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={p.is_optional}
                          onChange={(e) => updateProduct(i, 'is_optional', e.target.checked)}
                        />
                        Optional
                      </label>

                      <button className="btn-remove" onClick={() => removeProduct(i)}>
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
