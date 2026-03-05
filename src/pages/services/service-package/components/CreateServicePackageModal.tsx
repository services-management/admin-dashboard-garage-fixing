import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  createComboService,
  updateComboService,
  uploadComboServiceImage,
  updateComboServiceImage,
} from '../../../../store/package/packageThunk';
import { fetchServices } from '../../../../store/service/serviceThunk';
import type {
  ComboService,
  CreateComboServicePayload,
  UpdateComboServicePayload,
} from '../../../../store/package/packageTypes';
import { getProxiedImageUrl } from '../../../../utils/imageProxy';
import './CreateServicePackageModal.css';

interface CreateServicePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (pkg: ComboService) => void;
  editingPackage?: ComboService | null;
}

export default function CreateServicePackageModal({
  isOpen,
  onClose,
  onSuccess,
  editingPackage,
}: CreateServicePackageModalProps) {
  const dispatch = useAppDispatch();
  const { list: services, loading: servicesLoading } = useAppSelector((state) => state.service);
  const { loading, error } = useAppSelector((state) => state.package);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    service_names: [] as string[],
  });

  const calculateTotalPrice = (serviceNames: string[]) => {
    if (!services || services.length === 0) return 0;

    return serviceNames.reduce((total, serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      return total + (service?.price || 0);
    }, 0);
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    price: '',
    service_names: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Always fetch services when modal opens to ensure fresh data
      dispatch(fetchServices());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        name: editingPackage.name || '',
        description: editingPackage.description || '',
        price: editingPackage.price
          ? editingPackage.price.toString()
          : String(calculateTotalPrice(editingPackage.service_names || [])),
        service_names: editingPackage.service_names || [],
      });
      const packageImage = editingPackage.image_url || editingPackage.image;
      if (packageImage) {
        setImagePreview(packageImage);
      }
    } else {
      resetForm();
    }
  }, [editingPackage, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      service_names: [],
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({
      name: '',
      description: '',
      price: '',
      service_names: '',
    });
  };

  const validateForm = () => {
    const errors = {
      name: '',
      description: '',
      price: '',
      service_names: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Package name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    // Check if price is valid number, but allow 0 if it's auto-calculated
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = 'Valid price is required';
    }

    if (formData.service_names.length < 2) {
      errors.service_names = 'At least 2 services must be selected';
    }

    setFormErrors(errors);
    return Object.values(errors).every((err) => err === '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingPackage) {
        const updatePayload: UpdateComboServicePayload = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          service_names: formData.service_names,
        };
        const result = await dispatch(
          updateComboService({
            id: editingPackage.combo_service_id,
            payload: updatePayload,
          }),
        ).unwrap();

        // Upload image if selected
        if (imageFile) {
          await dispatch(
            updateComboServiceImage({
              id: editingPackage.combo_service_id,
              payload: { file: imageFile },
            }),
          ).unwrap();
        }

        onSuccess?.(result);
      } else {
        // Keep service_names as strings (they come from the select as strings)
        const createPayload: CreateComboServicePayload = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          service_names: formData.service_names, // Keep as strings, don't convert to int
        };
        console.log('Form data:', JSON.stringify(formData, null, 2));
        console.log('Create payload:', JSON.stringify(createPayload, null, 2));
        const result = await dispatch(createComboService(createPayload)).unwrap();

        // Upload image if selected
        if (imageFile) {
          console.log('Uploading image for combo service:', result.combo_service_id);
          await dispatch(
            uploadComboServiceImage({
              id: result.combo_service_id,
              payload: { file: imageFile },
            }),
          ).unwrap();
        }

        onSuccess?.(result);
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const newServiceNames = prev.service_names.includes(serviceId)
        ? prev.service_names.filter((s: string) => s !== serviceId)
        : [...prev.service_names, serviceId];

      const newTotalPrice = calculateTotalPrice(newServiceNames);

      return {
        ...prev,
        service_names: newServiceNames,
        price: newTotalPrice.toFixed(2),
      };
    });
    if (formErrors.service_names) {
      setFormErrors((prev) => ({
        ...prev,
        service_names: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-package-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingPackage ? 'Edit Service Package' : 'Create Service Package'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-package-form">
          <div className="form-section">
            <h3>Package Details</h3>

            <div className="form-group">
              <label htmlFor="name">Package Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter package name"
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter package description"
                rows={3}
                className={formErrors.description ? 'error' : ''}
              />
              {formErrors.description && (
                <span className="error-message">{formErrors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <div className="price-input-container">
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  className={formErrors.price ? 'error' : ''}
                />
              </div>
              {formErrors.price && <span className="error-message">{formErrors.price}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Select Services *</h3>
            {servicesLoading ? (
              <div className="loading-message">
                <p>Loading services...</p>
              </div>
            ) : services && services.length > 0 ? (
              <div>
                <div className="services-select-container">
                  <select
                    multiple
                    value={formData.service_names}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      );
                      const newTotalPrice = calculateTotalPrice(selected);
                      setFormData((prev) => ({
                        ...prev,
                        service_names: selected,
                        price: newTotalPrice.toFixed(2),
                      }));
                      if (formErrors.service_names) {
                        setFormErrors((prev) => ({
                          ...prev,
                          service_names: '',
                        }));
                      }
                    }}
                    className="services-select"
                    aria-label="Select services for the package"
                  >
                    <option value="" disabled>
                      Click to select services (Ctrl/Cmd + Click for multiple)
                    </option>
                    {services.map((service) => (
                      <option key={service.service_id} value={service.name}>
                        [{service.name}] - ${service.price?.toFixed(2) || '0.00'} -{' '}
                        {service.description.substring(0, 50)}
                        {service.description.length > 50 ? '...' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.service_names.length > 0 && (
                  <div className="selected-services-container">
                    <div className="selected-services-header">
                      <span className="selected-count">
                        ✓ {formData.service_names.length} service
                        {formData.service_names.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="selected-services-list">
                      {formData.service_names.map((serviceName) => {
                        const service = services.find((s) => s.name === serviceName);
                        return (
                          <div key={serviceName} className="service-tag">
                            {service?.image_url && (
                              <img
                                src={getProxiedImageUrl(service.image_url)}
                                alt={service.name}
                                className="service-tag-image"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="service-tag-name">{serviceName}</span>
                            <button
                              type="button"
                              className="service-tag-remove"
                              onClick={() => toggleService(serviceName)}
                              title="Remove service"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formData.service_names.length === 0 && (
                  <div className="no-services-selected">
                    <span>No services selected yet (minimum 2 required)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-services-available-message">
                <p>No services available. Please add services first.</p>
              </div>
            )}
            {formErrors.service_names && (
              <span className="error-message">{formErrors.service_names}</span>
            )}
          </div>

          <div className="form-section">
            <h3>Package Image</h3>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Package preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden-file-input"
                  />
                  <div className="upload-icon">📷</div>
                  <p>Click to upload image</p>
                </label>
              )}
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
