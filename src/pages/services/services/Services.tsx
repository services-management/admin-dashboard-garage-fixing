import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../../../store';
import { fetchComboServices } from '../../../store/package/packageThunk';
import { ProductService } from '../../../store/product/productService';
import { ServiceService } from '../../../store/service/serviceService';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from '../../../store/service/serviceThunk';
import type { Service } from '../../../store/service/serviceTypes';

interface Product {
  id: number;
  name: string;
}

export default function Services() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.service.list);
  const comboServices = useSelector((state: RootState) => state.package.list);

  /* ================= LOCAL UI STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<{ canDelete: boolean; comboNames: string[] }>({
    canDelete: true,
    comboNames: [],
  });

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
    dispatch(fetchComboServices());
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
    setImageFile(null);
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
    setImageFile(null);
  };

  /* ================= IMAGE ================= */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string); // preview only
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
    if (!formData.name.trim()) {
      alert('សូមបញ្ចូលឈ្មោះសេវាកម្ម');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      image_url: '',
      price: Number(formData.price),
      duration_minutes: formData.duration_minutes,
      is_available: formData.status === 'active',
      associations: formData.products.map((p) => ({
        product_name: p.name,
        quantity_required: p.quantity,
        is_optional: p.is_optional,
      })),
    };

    try {
      if (isEditMode && currentService) {
        const updated = await dispatch(
          updateService({
            service_id: currentService.service_id,
            payload,
          }),
        ).unwrap();

        // ✅ upload image AFTER update
        if (imageFile) {
          await ServiceService.updateServiceImage(updated.service_id, imageFile);
        }

        alert('សេវាកម្មត្រូវបានកែប្រែជោគជ័យ!');
      } else {
        const created = await dispatch(createService(payload)).unwrap();

        // ✅ upload image AFTER create
        if (imageFile) {
          await ServiceService.uploadServiceImage(created.service_id, imageFile);
        }

        alert('សេវាកម្មត្រូវបានបង្កើតជោគជ័យ!');
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការរក្សាទុកសេវាកម្ម');
    }
  };

  /* ================= DELETE ================= */
  const isServiceUsedInCombo = (serviceId: number): { isUsed: boolean; comboNames: string[] } => {
    const usedInCombos: string[] = [];

    // Find the name of the service we want to delete
    const serviceToDelete = services.find((s) => s.service_id === serviceId);
    if (!serviceToDelete) return { isUsed: false, comboNames: [] };

    comboServices.forEach((combo) => {
      let isUsed = false;

      // Check in service_names array (strings)
      if (combo.service_names && combo.service_names.includes(serviceToDelete.name)) {
        isUsed = true;
      }

      // Also check in services array (objects) if it exists
      if (!isUsed && combo.services && Array.isArray(combo.services)) {
        isUsed = combo.services.some(
          (s) => s.service_id === serviceId || s.name === serviceToDelete.name,
        );
      }

      if (isUsed) {
        usedInCombos.push(combo.name);
      }
    });

    return {
      isUsed: usedInCombos.length > 0,
      comboNames: usedInCombos,
    };
  };

  const handleDeleteClick = (id: number) => {
    const { isUsed, comboNames } = isServiceUsedInCombo(id);
    setDeleteServiceId(id);
    setDeleteWarning({
      canDelete: !isUsed,
      comboNames: comboNames,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteServiceId) return;

    try {
      await dispatch(deleteService(deleteServiceId));
      setShowDeleteModal(false);
      setDeleteServiceId(null);
      alert('សេវាកម្មត្រូវបានលុប!');
    } catch {
      alert('មានបញ្ហាក្នុងការលុបសេវាកម្ម');
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
                      handleDeleteClick(service.service_id);
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
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, price: e.target.value }));
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.duration_minutes}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        duration_minutes: Number(e.target.value) || 0,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }));
                    }}
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
                        onChange={(e) => {
                          updateProduct(i, 'name', e.target.value);
                        }}
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
                        onChange={(e) => {
                          updateProduct(i, 'quantity', Number(e.target.value) || 1);
                        }}
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
                          onChange={(e) => {
                            updateProduct(i, 'is_optional', e.target.checked);
                          }}
                        />
                        Optional
                      </label>

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

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>{deleteWarning.canDelete ? 'បញ្ជាក់ការលុប' : 'មិនអាចលុបបានទេ'}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              {deleteWarning.canDelete ? (
                <p>
                  តើអ្នកប្រាកដជាចង់លុបសេវាកម្មនេះមែនទេ?
                  <br />
                  <strong style={{ color: '#ef4444' }}>សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</strong>
                </p>
              ) : (
                <div>
                  <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '12px' }}>
                    ⚠️ មិនអាចលុបសេវាកម្មនេះបានទេ!
                  </p>
                  <p style={{ marginBottom: '12px' }}>
                    សេវាកម្មនេះកំពុងត្រូវបានប្រើប្រាស់ក្នុងកញ្ចប់សេវាកម្មទាំងនេះ:
                  </p>
                  <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                    {deleteWarning.comboNames.map((name, index) => (
                      <li key={index} style={{ marginBottom: '4px', color: '#ef4444' }}>
                        <strong>{name}</strong>
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    សូមដកសេវាកម្មចេញពីកញ្ចប់សេវាកម្មជាមុនសិន។
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ width: '100%' }}>
              {deleteWarning.canDelete ? (
                <>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                  >
                    បោះបង់
                  </button>
                  <button className="btn-danger" onClick={handleDeleteConfirm}>
                    លុប
                  </button>
                </>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  យល់ព្រម
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
