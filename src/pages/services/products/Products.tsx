import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../../store/category/categoryThunk';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { ProductService } from '../../../store/product/productService';
import { fetchProducts } from '../../../store/product/productThunk';
import type { Product } from '../../../store/product/productTypes';
import { fetchServices } from '../../../store/service/serviceThunk';
import { fetchVehicleSpecs } from '../../../store/vehicle/vehicleThunk';
import { getProxiedImageUrl } from '../../../utils/imageProxy';

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((s) => s.product);
  const { list: categories } = useAppSelector((s) => s.category);
  const { list: services } = useAppSelector((s) => s.service);
  const { vehicleSpecs } = useAppSelector((s) => s.vehicle);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // IMAGE UPLOAD
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<{
    canDelete: boolean;
    serviceNames: string[];
  }>({
    canDelete: true,
    serviceNames: [],
  });

  // DETAIL MODAL
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [linkedVehicles, setLinkedVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',
    unit_cost: '',
    description: '',
    status: 'Active',
    category_name: '',
    initial_stock: 0,
    min_stock_level: 0,
  });

  // VEHICLE LINK
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | ''>('');
  const [vehicleQuantity, setVehicleQuantity] = useState('');
  const [vehicleUnit, setVehicleUnit] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchServices());
    dispatch(fetchVehicleSpecs());
  }, [dispatch]);

  // ================= CREATE / EDIT =================
  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      selling_price: '',
      unit_cost: '',
      description: '',
      status: 'Active',
      category_name: '',
      initial_stock: 0,
      min_stock_level: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setIsEditMode(true);
    setCurrentProduct(p);
    setImageFile(null);
    setImagePreview(p.image_url || '');
    setFormData({
      name: p.name,
      selling_price: p.selling_price,
      unit_cost: p.unit_cost,
      description: p.description,
      status: p.status,
      category_name: p.category?.name ?? '',
      initial_stock: Number(p.inventory?.current_stock ?? 0),
      min_stock_level: Number(p.inventory?.min_stock_level ?? 0),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setImageFile(null);
    setImagePreview('');
    setSelectedVehicleId('');
    setVehicleQuantity('');
    setVehicleUnit('');
  };

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file); // ✅ IMPORTANT

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file); // preview only
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const payload = {
      name: formData.name,
      selling_price: Number(formData.selling_price),
      unit_cost: Number(formData.unit_cost),
      description: formData.description,
      status: formData.status,
      category_name: formData.category_name,
      image_url: isEditMode && currentProduct ? currentProduct.image_url : '',
      initial_stock: Number(formData.initial_stock),
      min_stock_level: Number(formData.min_stock_level),
      price_adjustment: 0,
    };

    try {
      if (isEditMode && currentProduct) {
        await ProductService.updateProduct(currentProduct.product_id, payload);

        if (imageFile) {
          await ProductService.uploadProductImage(currentProduct.product_id, imageFile);
        }

        toast.success('Product updated successfully');
      } else {
        const res = await ProductService.createProduct(payload);
        const createdProduct = res.data;

        if (imageFile) {
          await ProductService.uploadProductImage(createdProduct.product_id, imageFile);
        }

        // Link product to vehicle if selected
        if (selectedVehicleId) {
          try {
            await ProductService.linkProductToVehicle(
              createdProduct.product_id,
              selectedVehicleId,
              vehicleQuantity || undefined,
              vehicleUnit || undefined,
            );
            toast.success('Product created and linked to vehicle successfully');
          } catch (linkErr: any) {
            toast.success('Product created but failed to link with vehicle');
          }
        } else {
          toast.success('Product created successfully');
        }
      }

      closeModal();
      dispatch(fetchProducts());
    } catch (err: any) {
      console.error('Product save error:', err.response?.data);
      const errorMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        'Save failed';
      toast.error(errorMsg);
    }
  };

  // ================= DELETE =================
  const isProductUsedInService = (
    productId: number,
  ): { isUsed: boolean; serviceNames: string[] } => {
    const usedInServices: string[] = [];

    services.forEach((service) => {
      if (service.associations && service.associations.length > 0) {
        const productName = products.find((p) => p.product_id === productId)?.name;
        if (productName) {
          const isUsed = service.associations.some((assoc) => assoc.product_name === productName);
          if (isUsed) {
            usedInServices.push(service.name);
          }
        }
      }
    });

    return {
      isUsed: usedInServices.length > 0,
      serviceNames: usedInServices,
    };
  };

  const handleDeleteClick = (id: number) => {
    const { isUsed, serviceNames } = isProductUsedInService(id);
    setDeleteProductId(id);
    setDeleteWarning({
      canDelete: !isUsed,
      serviceNames: serviceNames,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return;

    try {
      await ProductService.deleteProduct(deleteProductId);
      setShowDeleteModal(false);
      setDeleteProductId(null);
      dispatch(fetchProducts());
    } catch {
      alert('Delete failed');
    }
  };

  // ================= UI =================
  return (
    <div>
      <div className="service-package-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បង្កើតផលិតផលថ្មី
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* ================= PRODUCT CARDS ================= */}
      <div className="product-grid-ecommerce">
        {products.map((prd) => (
          <div
            key={prd.product_id}
            className="service-card-enhanced"
            onClick={async () => {
              setDetailProduct(prd);
              setShowDetailModal(true);
              setLoadingVehicles(true);
              try {
                const vehicles = await ProductService.getVehiclesByProduct(prd.product_id);
                setLinkedVehicles(vehicles || []);
              } catch (err) {
                setLinkedVehicles([]);
              } finally {
                setLoadingVehicles(false);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-card-image">
              <img
                src={
                  getProxiedImageUrl(prd.image_url) ||
                  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'
                }
                alt={prd.name}
              />
              <span
                className={`status-badge-overlay ${prd.status === 'Active' ? 'active' : 'inactive'}`}
              >
                {prd.status}
              </span>
            </div>

            <div className="service-card-body">
              <div className="service-card-header-enhanced">
                <div>
                  <div className="service-card-title">{prd.name}</div>
                  <div className="service-card-id">#{String(prd.product_id).padStart(4, '0')}</div>
                </div>
              </div>

              <div className="service-card-description">{prd.description}</div>

              <div className="service-card-content">
                <div className="content-section">
                  <div className="content-label">Category</div>
                  <span className="item-tag">{prd.category?.name || 'N/A'}</span>
                </div>

                <div className="content-section">
                  <div className="content-label">Stock</div>
                  <span className="item-tag">
                    {' '}
                    {Math.trunc(Number(prd.inventory?.min_stock_level ?? 0))} units
                  </span>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">${Number(prd.selling_price).toFixed(2)}</div>

                <div className="card-actions">
                  <button
                    className="btn-small btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(prd);
                    }}
                  >
                    កែសម្រួល
                  </button>

                  <button
                    className="btn-small btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(prd.product_id);
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

      {/* ================= CREATE / UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'កែសម្រួលផលិតផល' : 'បង្កើតផលិតផលថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Form Fields (unchanged) */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Selling Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.selling_price}
                    onChange={(e) => {
                      setFormData({ ...formData, selling_price: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Unit Cost</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.unit_cost}
                    onChange={(e) => {
                      setFormData({ ...formData, unit_cost: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value });
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category_name}
                    onChange={(e) => {
                      setFormData({ ...formData, category_name: e.target.value });
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.categoryID} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.initial_stock}
                    onChange={(e) => {
                      setFormData({ ...formData, initial_stock: Number(e.target.value) });
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Min Stock Level</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.min_stock_level}
                    onChange={(e) => {
                      setFormData({ ...formData, min_stock_level: Number(e.target.value) });
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && <img src={imagePreview} style={{ maxWidth: 200 }} />}
                </div>
              </div>

              {/* Vehicle Link Section */}
              {!isEditMode && (
                <div
                  style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}
                >
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                    Link to Vehicle (Optional)
                  </h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Vehicle</label>
                      <select
                        className="form-select"
                        value={selectedVehicleId}
                        onChange={(e) => setSelectedVehicleId(Number(e.target.value) || '')}
                      >
                        <option value="">Select vehicle</option>
                        {vehicleSpecs.map((v) => (
                          <option key={v.vehicle_id} value={v.vehicle_id}>
                            {v.model?.make?.name} {v.model?.name} ({v.year})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity Required</label>
                      <input
                        type="text"
                        className="form-input"
                        value={vehicleQuantity}
                        onChange={(e) => setVehicleQuantity(e.target.value)}
                        placeholder="e.g., 4"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Unit</label>
                      <input
                        type="text"
                        className="form-input"
                        value={vehicleUnit}
                        onChange={(e) => setVehicleUnit(e.target.value)}
                        placeholder="e.g., liters, pieces"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'Update Product' : 'Save Product'}
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
                  តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះមែនទេ?
                  <br />
                  <strong style={{ color: '#ef4444' }}>សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</strong>
                </p>
              ) : (
                <div>
                  <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '12px' }}>
                    ⚠️ មិនអាចលុបផលិតផលនេះបានទេ!
                  </p>
                  <p style={{ marginBottom: '12px' }}>
                    ផលិតផលនេះកំពុងត្រូវបានប្រើប្រាស់ក្នុងសេវាកម្ម:
                  </p>
                  <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                    {deleteWarning.serviceNames.map((name, index) => (
                      <li key={index} style={{ marginBottom: '4px', color: '#ef4444' }}>
                        <strong>{name}</strong>
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    សូមដកផលិតផលចេញពីសេវាកម្មជាមុនសិន។
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

      {/* ================= DETAIL MODAL ================= */}
      {showDetailModal && detailProduct && (
        <div className="modal active" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ព័ត៌មានផលិតផល</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src={
                    getProxiedImageUrl(detailProduct.image_url) ||
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'
                  }
                  alt={detailProduct.name}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div className="detail-section">
                <h3>{detailProduct.name}</h3>
                <p className="product-id">
                  ID: #{String(detailProduct.product_id).padStart(4, '0')}
                </p>
                <span
                  className={`status-badge ${detailProduct.status === 'Active' ? 'active' : 'inactive'}`}
                >
                  {detailProduct.status}
                </span>
              </div>

              <div
                className="detail-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <div className="detail-item">
                  <label>Category</label>
                  <p>{detailProduct.category?.name || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Selling Price</label>
                  <p>${Number(detailProduct.selling_price).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Unit Cost</label>
                  <p>${Number(detailProduct.unit_cost).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Stock Level</label>
                  <p>{Math.trunc(Number(detailProduct.inventory?.current_stock ?? 0))} units</p>
                </div>
                <div className="detail-item">
                  <label>Min Stock</label>
                  <p>{Math.trunc(Number(detailProduct.inventory?.min_stock_level ?? 0))} units</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginTop: '16px' }}>
                <label>Description</label>
                <p>{detailProduct.description || 'No description'}</p>
              </div>

              {/* Linked Vehicles Section */}
              <div
                className="detail-item"
                style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}
              >
                <label
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  Linked Vehicles
                </label>
                {loadingVehicles ? (
                  <p>Loading vehicles...</p>
                ) : linkedVehicles.length === 0 ? (
                  <p style={{ color: '#6b7280' }}>No vehicles linked to this product</p>
                ) : (
                  <div
                    className="linked-vehicles-list"
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    {linkedVehicles.map((vehicle: any, index: number) => (
                      <div
                        key={index}
                        className="vehicle-tag"
                        style={{
                          background: '#f3f4f6',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>
                          {vehicle.make?.name || vehicle.make}{' '}
                          {vehicle.model?.name || vehicle.model} ({vehicle.year})
                        </span>
                        {(vehicle.quantity_required || vehicle.unit) && (
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>
                            {vehicle.quantity_required} {vehicle.unit}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
                បិទ
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(detailProduct);
                }}
              >
                កែសម្រួល
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
