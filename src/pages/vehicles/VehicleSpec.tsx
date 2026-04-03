import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Icon from '../../components/Icons';
import {
  fetchVehicleSpecs,
  createVehicleSpec,
  updateVehicleSpec,
  deleteVehicleSpec,
  fetchModels,
} from '../../store/vehicle/vehicleThunk';
import { clearError, clearSuccessMessage } from '../../store/vehicle/vehicleSlice';
import { uploadVehicleImageApi } from '../../store/vehicle/vehicleService';
import type { VehicleSpec, VehicleSpecInput } from '../../store/vehicle/vehicleTypes';
import { getProxiedImageUrl } from '../../utils/imageProxy';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Truck',
  'Van',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Wagon',
];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', '4WD'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];

export default function VehicleSpec() {
  const dispatch = useAppDispatch();
  const { vehicleSpecs, models, loading, error, successMessage } = useAppSelector(
    (state) => state.vehicle,
  );

  const [showForm, setShowForm] = useState(false);
  const [editingSpec, setEditingSpec] = useState<VehicleSpec | null>(null);
  const [formData, setFormData] = useState<VehicleSpecInput>({
    model_id: 0,
    year: new Date().getFullYear(),
    engine: '',
    vehicle_type: 'Sedan',
    fuel_type: 'Gasoline',
    drive_type: 'FWD',
    transmission: 'Manual',
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Detail modal state
  const [detailSpec, setDetailSpec] = useState<VehicleSpec | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchVehicleSpecs());
    dispatch(fetchModels());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      setShowForm(false);
      setEditingSpec(null);
      resetForm();
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch]);

  const resetForm = () => {
    setFormData({
      model_id: models.length > 0 ? models[0].model_id : 0,
      year: new Date().getFullYear(),
      engine: '',
      vehicle_type: 'Sedan',
      fuel_type: 'Gasoline',
      drive_type: 'FWD',
      transmission: 'Manual',
    });
  };

  const handleCreate = () => {
    setEditingSpec(null);
    resetForm();
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const handleEdit = (spec: VehicleSpec) => {
    setEditingSpec(spec);
    setFormData({
      model_id: spec.model_id,
      year: spec.year,
      engine: spec.engine,
      vehicle_type: spec.vehicle_type,
      fuel_type: spec.fuel_type,
      drive_type: spec.drive_type,
      transmission: spec.transmission,
    });
    setImageFile(null);
    setImagePreview(spec.img_url || '');
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openDeleteModal = (vehicleId: number) => {
    setDeleteVehicleId(vehicleId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteVehicleId(null);
  };

  const confirmDelete = async () => {
    if (!deleteVehicleId) return;
    try {
      await dispatch(deleteVehicleSpec(deleteVehicleId)).unwrap();
      toast.success('Vehicle spec deleted successfully');
      closeDeleteModal();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete vehicle spec');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model_id || formData.model_id === 0) {
      toast.error('Please select a model');
      return;
    }
    try {
      let vehicleId: number;

      if (editingSpec) {
        await dispatch(
          updateVehicleSpec({ vehicleId: editingSpec.vehicle_id, payload: formData }),
        ).unwrap();
        vehicleId = editingSpec.vehicle_id;
        toast.success('Vehicle spec updated successfully');
      } else {
        const created = await dispatch(createVehicleSpec(formData)).unwrap();
        vehicleId = created.vehicle_id;
        toast.success('Vehicle spec created successfully');
      }

      // Upload image if selected
      if (imageFile && vehicleId) {
        try {
          await uploadVehicleImageApi(vehicleId, imageFile);
          toast.success('Vehicle image uploaded successfully');
          dispatch(fetchVehicleSpecs()); // Refresh to get updated image URL
        } catch (err: any) {
          toast.error('Failed to upload vehicle image');
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save vehicle spec');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSpec(null);
    resetForm();
  };

  const getModelName = (modelId: number) => {
    const model = models.find((m) => (m as any).id === modelId || m.model_id === modelId);
    return model ? `${model.name} (${model.make?.name || '-'})` : '-';
  };

  const openDetailModal = (spec: VehicleSpec) => {
    setDetailSpec(spec);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setDetailSpec(null);
    setShowDetailModal(false);
  };

  return (
    <div className="vehicle-spec-page full-width-page">
      {/* Search Bar */}
      <div className="search-container">
        <input type="text" placeholder="Search vehicle specs..." className="search-input" />
      </div>

      {/* Main Card */}
      <div className="card-container">
        <div className="card-header">
          <h2 className="page-title">All Vehicle Specs ({vehicleSpecs.length})</h2>

          {!showForm && (
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              + Add Vehicle Spec
            </button>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingSpec ? 'Edit Vehicle Spec' : 'Add New Vehicle Spec'}</h3>
                <button className="modal-close" onClick={handleCancel}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="modelId">Model *</label>
                    <select
                      id="modelId"
                      className="form-select"
                      value={formData.model_id}
                      onChange={(e) => {
                        console.log('Selected model_id:', e.target.value);
                        setFormData({ ...formData, model_id: parseInt(e.target.value) });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      required
                      style={{ cursor: 'pointer', minHeight: '40px' }}
                    >
                      <option value="">Select Model</option>
                      {models.map((model) => {
                        const modelId = (model as any).id || model.model_id;
                        return (
                          <option key={modelId} value={modelId}>
                            {model.name} ({model.make?.name || '-'})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="year">Year *</label>
                    <input
                      type="number"
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="engine">Engine *</label>
                  <input
                    type="text"
                    id="engine"
                    value={formData.engine}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    placeholder="e.g., 2.5L 4-Cylinder"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicleType">Vehicle Type *</label>
                    <select
                      id="vehicleType"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      required
                    >
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fuelType">Fuel Type *</label>
                    <select
                      id="fuelType"
                      value={formData.fuel_type}
                      onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                      required
                    >
                      {FUEL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="driveType">Drive Type *</label>
                    <select
                      id="driveType"
                      value={formData.drive_type}
                      onChange={(e) => setFormData({ ...formData, drive_type: e.target.value })}
                      required
                    >
                      {DRIVE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="transmission">Transmission *</label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      required
                    >
                      {TRANSMISSIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label htmlFor="vehicleImage">Vehicle Image</label>
                  <input
                    type="file"
                    id="vehicleImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingSpec ? 'Update Spec' : 'Create Spec'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Model</th>
                <th>Year</th>
                <th>Engine</th>
                <th>Type</th>
                <th>Fuel</th>
                <th>Drive</th>
                <th>Transmission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleSpecs.length > 0 ? (
                vehicleSpecs.map((spec, index) => (
                  <tr key={`spec-${spec.vehicle_id}-${index}`}>
                    <td>{spec.vehicle_id}</td>
                    <td>
                      {spec.img_url ? (
                        <img
                          src={getProxiedImageUrl(spec.img_url)}
                          alt={`${getModelName(spec.model_id)}`}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                          onClick={() => openDetailModal(spec)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            background: '#e5e7eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#9ca3af',
                            cursor: 'pointer',
                          }}
                          onClick={() => openDetailModal(spec)}
                        >
                          No Image
                        </div>
                      )}
                    </td>
                    <td>{getModelName(spec.model_id)}</td>
                    <td>{spec.year}</td>
                    <td>{spec.engine}</td>
                    <td>{spec.vehicle_type}</td>
                    <td>{spec.fuel_type}</td>
                    <td>{spec.drive_type}</td>
                    <td>{spec.transmission}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleEdit(spec)}>
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => openDeleteModal(spec.vehicle_id)}
                          title="Delete"
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-data">
                  <td colSpan={10} className="no-data">
                    No vehicle specifications available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {showDetailModal && detailSpec && (
          <div className="modal-overlay" onClick={closeDetailModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Vehicle Details</h3>
                <button className="modal-close" onClick={closeDetailModal}>
                  ×
                </button>
              </div>
              <div className="vehicle-detail-content">
                <div className="vehicle-detail-image">
                  {detailSpec.img_url ? (
                    <img
                      src={getProxiedImageUrl(detailSpec.img_url)}
                      alt={getModelName(detailSpec.model_id)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400';
                      }}
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"
                      alt="Default vehicle"
                    />
                  )}
                </div>
                <div className="vehicle-detail-info">
                  <h2>{getModelName(detailSpec.model_id)}</h2>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Vehicle ID</label>
                      <p>#{detailSpec.vehicle_id}</p>
                    </div>
                    <div className="detail-item">
                      <label>Year</label>
                      <p>{detailSpec.year}</p>
                    </div>
                    <div className="detail-item">
                      <label>Engine</label>
                      <p>{detailSpec.engine}</p>
                    </div>
                    <div className="detail-item">
                      <label>Type</label>
                      <p>{detailSpec.vehicle_type}</p>
                    </div>
                    <div className="detail-item">
                      <label>Fuel</label>
                      <p>{detailSpec.fuel_type}</p>
                    </div>
                    <div className="detail-item">
                      <label>Drive</label>
                      <p>{detailSpec.drive_type}</p>
                    </div>
                    <div className="detail-item">
                      <label>Transmission</label>
                      <p>{detailSpec.transmission}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div
              className="modal-content"
              style={{ maxWidth: '400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Confirm Delete</h3>
                <button className="modal-close" onClick={closeDeleteModal}>
                  ×
                </button>
              </div>
              <div className="modal-body" style={{ padding: '24px' }}>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Are you sure you want to delete this vehicle specification?
                </p>
                <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#ef4444' }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-actions" style={{ padding: '0 24px 24px' }}>
                <button type="button" className="btn-secondary" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
