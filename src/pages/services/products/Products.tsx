import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../../store/category/categoryThunk';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { store } from '../../../store';
import { ProductService } from '../../../store/product/productService';
import { fetchProducts, fetchAllProducts } from '../../../store/product/productThunk';
import type { Product } from '../../../store/product/productTypes';
import { fetchServices } from '../../../store/service/serviceThunk';
import { fetchVehicleSpecs } from '../../../store/vehicle/vehicleThunk';
import { getProxiedImageUrl } from '../../../utils/imageProxy';
import type { VehicleSpec } from '../../../store/vehicle/vehicleTypes';

// Component to manage linked vehicles in edit mode
function LinkedVehiclesManager({
  productId,
  vehicleSpecs,
}: {
  productId: number;
  vehicleSpecs: VehicleSpec[];
}) {
  const [linkedVehicles, setLinkedVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newVehicleId, setNewVehicleId] = useState<number | ''>('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newNote, setNewNote] = useState('');

  // Enrich linked vehicles with model/make names from vehicleSpecs
  const enrichVehiclesWithSpecs = (vehicles: any[]) => {
    return vehicles.map((v) => {
      // Find matching vehicle spec
      const spec = vehicleSpecs.find((s) => s.vehicle_id === v.vehicle_id);
      return {
        ...v,
        // Add make/model names from vehicleSpecs if available
        make_name: spec?.model?.make?.name || v.make_name || v.make,
        model_name: spec?.model?.name || v.model_name || v.model,
        // Keep original year from response
        year: v.year,
      };
    });
  };

  const fetchLinkedVehicles = async () => {
    try {
      setLoading(true);
      console.log('Fetching linked vehicles for product:', productId);
      const vehicles = await ProductService.getVehiclesByProduct(productId);
      console.log('Linked vehicles response:', vehicles);
      console.log('Available vehicleSpecs:', vehicleSpecs);

      // Enrich with vehicle spec data
      const enrichedVehicles = enrichVehiclesWithSpecs(vehicles || []);
      console.log('Enriched vehicles:', enrichedVehicles);

      setLinkedVehicles(enrichedVehicles);
    } catch (err) {
      console.error('Failed to fetch linked vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedVehicles();
  }, [productId]);

  const handleUpdate = async (vehicleId: number) => {
    try {
      await ProductService.updateProductVehicleLink(
        productId,
        vehicleId,
        editQuantity || undefined,
        editUnit || undefined,
        editNote || undefined,
      );
      toast.success('ផលិតផលបានភ្ចាប់ជាមួយរថយន្តបានកែប្រែ');
      setEditingVehicle(null);
      fetchLinkedVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update');
    }
  };

  const handleDelete = async (vehicleId: number) => {
    if (!confirm('Are you sure you want to remove this vehicle link?')) return;
    try {
      await ProductService.unlinkProductFromVehicle(productId, vehicleId);
      toast.success('Vehicle link removed');
      fetchLinkedVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to remove');
    }
  };

  const handleAddNew = async () => {
    if (!newVehicleId) {
      toast.error('សូមជ្រើសរើសរថយន្ត');
      return;
    }
    try {
      await ProductService.linkProductToVehicle(
        productId,
        newVehicleId,
        newQuantity || undefined,
        newUnit || undefined,
        newNote || undefined,
      );
      toast.success('រថយន្តបានភ្ចាប់ជាមួយផលិតផលជោគជ័យ');
      setShowAddNew(false);
      setNewVehicleId('');
      setNewQuantity('');
      setNewUnit('');
      setNewNote('');
      fetchLinkedVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to link vehicle');
    }
  };

  if (loading) return <p>Loading linked vehicles...</p>;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Existing Linked Vehicles */}
      {linkedVehicles.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No vehicles linked yet</p>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>Linked Vehicles:</h5>
          {linkedVehicles.map((v: any) => (
            <div
              key={v.vehicle_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              {editingVehicle?.vehicle_id === v.vehicle_id ? (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {v.make_name || v.make?.name || v.make || v.vehicle_make || 'Unknown Make'}{' '}
                      {v.model_name ||
                        v.model?.name ||
                        v.model ||
                        v.vehicle_model ||
                        'Unknown Model'}{' '}
                      ({v.year || 'N/A'})
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input
                        type="text"
                        placeholder="Quantity"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        style={{ width: '100px', padding: '4px 8px' }}
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        style={{ width: '100px', padding: '4px 8px' }}
                      />
                      <input
                        type="text"
                        placeholder="Note"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        style={{ flex: 1, padding: '4px 8px' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdate(v.vehicle_id)}
                    style={{
                      padding: '6px 12px',
                      background: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingVehicle(null)}
                    style={{
                      padding: '6px 12px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {v.make_name || v.make?.name || v.make || v.vehicle_make || 'Unknown Make'}{' '}
                      {v.model_name ||
                        v.model?.name ||
                        v.model ||
                        v.vehicle_model ||
                        'Unknown Model'}{' '}
                      ({v.year || 'N/A'})
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {v.quantity_required && `Qty: ${v.quantity_required}`}
                      {v.unit && ` ${v.unit}`}
                      {v.note && ` • ${v.note}`}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingVehicle(v);
                      setEditQuantity(v.quantity_required || '');
                      setEditUnit(v.unit || '');
                      setEditNote(v.note || '');
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.vehicle_id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Vehicle Link */}
      {!showAddNew ? (
        <button
          onClick={() => setShowAddNew(true)}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          + Link New Vehicle
        </button>
      ) : (
        <div
          style={{
            padding: '16px',
            background: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #86efac',
          }}
        >
          <h5 style={{ fontSize: '14px', marginBottom: '12px' }}>Link New Vehicle:</h5>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={newVehicleId}
              onChange={(e) => setNewVehicleId(Number(e.target.value) || '')}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">Select vehicle</option>
              {vehicleSpecs.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.model?.make?.name} {v.model?.name} ({v.year})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Quantity Required"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Unit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
          </div>
          <input
            type="text"
            placeholder="Note (optional)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddNew}
              style={{
                padding: '8px 16px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Link Vehicle
            </button>
            <button
              onClick={() => setShowAddNew(false)}
              style={{
                padding: '8px 16px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    price_adjustment: '',
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

  // PRODUCT FILTER
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchServices());
    dispatch(fetchVehicleSpecs());
  }, [dispatch]);

  // Fetch products based on filter
  useEffect(() => {
    if (showAllProducts) {
      dispatch(fetchAllProducts());
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, showAllProducts]);

  // ================= CREATE / EDIT =================
  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      selling_price: '',
      price_adjustment: '',
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
      price_adjustment: p.price_adjustment ? String(Number(p.price_adjustment)) : '',
      unit_cost: p.unit_cost,
      description: p.description,
      status: p.status,
      category_name: p.category?.name ?? '',
      initial_stock: Number(p.inventory?.current_stock ?? 0),
      min_stock_level: Number(p.inventory?.min_stock_level ?? 0),
    });
    // Reset vehicle selection for edit mode
    setSelectedVehicleId('');
    setVehicleQuantity('');
    setVehicleUnit('');
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
    // Build payload based on whether it's create or update
    const basePayload = {
      name: formData.name,
      selling_price: String(formData.selling_price),
      price_adjustment: String(formData.price_adjustment || 0),
      unit_cost: String(formData.unit_cost),
      description: formData.description,
      status: formData.status,
      category_name: formData.category_name,
      image_url: isEditMode && currentProduct ? currentProduct.image_url : '',
    };

    // Only include stock fields for new products
    const payload = isEditMode
      ? basePayload
      : {
          ...basePayload,
          initial_stock: Number(formData.initial_stock),
          min_stock_level: Number(formData.min_stock_level),
        };

    console.log('Saving product - isEditMode:', isEditMode);
    console.log('Form data price_adjustment:', formData.price_adjustment);
    console.log('Payload being sent:', payload);

    try {
      if (isEditMode && currentProduct) {
        console.log('Updating product ID:', currentProduct.product_id);
        const updateRes = await ProductService.updateProduct(currentProduct.product_id, payload);
        console.log('Update response:', updateRes);

        if (imageFile) {
          try {
            console.log('Uploading image for product:', currentProduct.product_id);
            console.log('Product object:', currentProduct);
            console.log('Image file:', imageFile.name, imageFile.size, imageFile.type);
            await ProductService.uploadProductImage(currentProduct.product_id, imageFile);
            console.log('Image uploaded successfully');
          } catch (imgErr: any) {
            console.error('Image upload error:', imgErr);
            console.error('Error response:', imgErr.response?.data);
            console.error('Error status:', imgErr.response?.status);
            toast.error(
              'Product updated but image upload failed: ' +
                (imgErr.response?.data?.detail || imgErr.message),
            );
          }
        }

        // Link product to vehicle if selected (for update mode too)
        if (selectedVehicleId) {
          try {
            console.log('Linking product to vehicle (update):', {
              productId: currentProduct.product_id,
              vehicleId: selectedVehicleId,
              quantity: vehicleQuantity,
              unit: vehicleUnit,
            });
            await ProductService.linkProductToVehicle(
              currentProduct.product_id,
              selectedVehicleId,
              vehicleQuantity || undefined,
              vehicleUnit || undefined,
            );
            toast.success('ផលិតបានកែប្រែនិងភ្ជាប់ជាមួយរថយន្តជោគជ័យ');
          } catch (linkErr: any) {
            console.error('Failed to link vehicle:', linkErr);
            toast.error(
              'Product updated but failed to link with vehicle: ' +
                (linkErr.response?.data?.detail || linkErr.message),
            );
          }
        } else {
          toast.success('ផលិតបានកែប្រែជោគជ័យ');
        }
      } else {
        const res = await ProductService.createProduct(payload);
        const createdProduct = res.data;

        if (imageFile) {
          try {
            console.log('Uploading image for new product:', createdProduct.product_id);
            await ProductService.uploadProductImage(createdProduct.product_id, imageFile);
            console.log('Image uploaded successfully');
          } catch (imgErr: any) {
            console.error('Image upload error:', imgErr);
            console.error('Error response:', imgErr.response?.data);
            console.error('Error status:', imgErr.response?.status);
            toast.error(
              'Product created but image upload failed: ' +
                (imgErr.response?.data?.detail || imgErr.message),
            );
          }
        }

        // Link product to vehicle if selected
        if (selectedVehicleId) {
          try {
            console.log('Linking product to vehicle:', {
              productId: createdProduct.product_id,
              vehicleId: selectedVehicleId,
              quantity: vehicleQuantity,
              unit: vehicleUnit,
            });
            await ProductService.linkProductToVehicle(
              createdProduct.product_id,
              selectedVehicleId,
              vehicleQuantity || undefined,
              vehicleUnit || undefined,
            );
            toast.success('Product created and linked to vehicle successfully');
          } catch (linkErr: any) {
            console.error('Failed to link vehicle:', linkErr);
            toast.error(
              'Product created but failed to link with vehicle: ' +
                (linkErr.response?.data?.detail || linkErr.message),
            );
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setShowAllProducts(!showAllProducts)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {showAllProducts ? 'បង្ហាញតែActive' : 'បង្ហាញទាំងអស់'}
          </button>
          <button className="btn-primary" onClick={openCreateModal}>
            + បង្កើតផលិតផលថ្មី
          </button>
        </div>
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
                // Fetch vehicles and ensure vehicleSpecs are loaded
                const [vehicles] = await Promise.all([
                  ProductService.getVehiclesByProduct(prd.product_id),
                  vehicleSpecs.length === 0
                    ? dispatch(fetchVehicleSpecs()).unwrap()
                    : Promise.resolve(),
                ]);

                // Get latest vehicleSpecs after potential fetch
                const latestSpecs =
                  vehicleSpecs.length > 0 ? vehicleSpecs : store.getState().vehicle.vehicleSpecs;

                // Enrich with vehicle spec data (make/model names)
                const enrichedVehicles = (vehicles || []).map((v: any) => {
                  const spec = latestSpecs.find((s: any) => s.vehicle_id === v.vehicle_id);
                  return {
                    ...v,
                    make_name: spec?.model?.make?.name,
                    model_name: spec?.model?.name,
                  };
                });
                setLinkedVehicles(enrichedVehicles);
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400';
                }}
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
                <div className="content-row" style={{ display: 'flex', gap: '24px' }}>
                  <div className="content-section">
                    <div className="content-label">Category</div>
                    <span className="item-tag">{prd.category?.name || 'N/A'}</span>
                  </div>

                  <div className="content-section">
                    <div className="content-label">Stock</div>
                    <span className="item-tag">
                      {Math.trunc(Number(prd.inventory?.current_stock ?? 0))} units
                    </span>
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">
                  ${(Number(prd.selling_price) + Number(prd.price_adjustment || 0)).toFixed(2)}
                </div>

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
                  <label className="form-label">ឈ្មោះផលិតផល</label>
                  <input
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">តម្លៃលក់</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.selling_price}
                    onChange={(e) => {
                      setFormData({ ...formData, selling_price: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">តម្លៃបន្ថែម</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price_adjustment}
                    onChange={(e) => {
                      setFormData({ ...formData, price_adjustment: e.target.value });
                    }}
                    placeholder="e.g., 5 or -2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">តម្លៃសរុប</label>
                  <input
                    type="text"
                    className="form-input final-price-input"
                    value={`$${(Number(formData.selling_price) + Number(formData.price_adjustment || 0)).toFixed(2)}`}
                    readOnly
                    style={{ fontWeight: 'bold' }}
                  />
                </div>
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
                  <label className="form-label">រូបភាព</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && <img src={imagePreview} style={{ maxWidth: 200 }} />}
                </div>
              </div>

              {/* Vehicle Link Section */}
              <div
                style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}
              >
                <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                  {isEditMode ? 'គ្រប់គ្រងការភ្ជាប់ជាមួយរថយន្ត' : 'ត្រូវជាមួយរថយន្ត'}
                </h4>

                {/* Show existing linked vehicles in edit mode */}
                {isEditMode && currentProduct && (
                  <LinkedVehiclesManager
                    productId={currentProduct.product_id}
                    vehicleSpecs={vehicleSpecs}
                  />
                )}

                {/* Add new vehicle link */}
                {!isEditMode && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">រថយន្ត</label>
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
                  </>
                )}
              </div>
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
                    មិនអាចលុបផលិតផលនេះបានទេ!
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
                  <label>Price Adjustment</label>
                  <p>
                    {Number(detailProduct.price_adjustment || 0) !== 0
                      ? `${Number(detailProduct.price_adjustment) > 0 ? '+' : ''}${Number(detailProduct.price_adjustment).toFixed(2)}`
                      : '0.00'}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Final Price</label>
                  <p style={{ fontWeight: 'bold', color: '#059669' }}>
                    $
                    {(
                      Number(detailProduct.selling_price) +
                      Number(detailProduct.price_adjustment || 0)
                    ).toFixed(2)}
                  </p>
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
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'block',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  ត្រូវប្រើជាមួយរថយន្ត
                </div>
                {loadingVehicles ? (
                  <p>Loading vehicles...</p>
                ) : linkedVehicles.length === 0 ? (
                  <p style={{ color: '#6b7280' }}>No vehicles linked to this product</p>
                ) : (
                  <div
                    className="linked-vehicles-list"
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            រថយន្ត
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            ឆ្នាំ
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            Type
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            Engine
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            ប្រេង
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            ចង្កូត
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            Transmission
                          </th>
                          <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb' }}>
                            ចំនួន
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkedVehicles.map((vehicle: any, index: number) => {
                          const vehicleName =
                            vehicle.make_name && vehicle.model_name
                              ? `${vehicle.make_name} ${vehicle.model_name}`
                              : vehicle.make?.name && vehicle.model?.name
                                ? `${vehicle.make.name} ${vehicle.model.name}`
                                : `Vehicle #${vehicle.vehicle_id}`;

                          return (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                                {vehicleName}
                              </td>
                              <td style={{ padding: '10px 12px' }}>{vehicle.year}</td>
                              <td style={{ padding: '10px 12px' }}>
                                {vehicle.vehicle_type || '-'}
                              </td>
                              <td style={{ padding: '10px 12px' }}>{vehicle.engine || '-'}</td>
                              <td style={{ padding: '10px 12px' }}>{vehicle.fuel_type || '-'}</td>
                              <td style={{ padding: '10px 12px' }}>{vehicle.drive_type || '-'}</td>
                              <td style={{ padding: '10px 12px' }}>
                                {vehicle.transmission || '-'}
                              </td>
                              <td
                                style={{ padding: '10px 12px', color: '#dc2626', fontWeight: 600 }}
                              >
                                {vehicle.quantity_required || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
