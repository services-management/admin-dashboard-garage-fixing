import React, { useState } from 'react';

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  stock: number;
  categories: string[];
  image?: string;
}

interface AvailableCategory {
  id: string;
  name: string;
}

export default function Product() {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 1,
      name: 'Engine Oil 5W-30',
      description: 'High performance engine oil suitable for most gasoline engines.',
      price: 15.0,
      status: 'active',
      stock: 50,
      categories: ['Oil', 'Engine'],
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Brake Fluid DOT4',
      description: 'High boiling point brake fluid for modern braking systems.',
      price: 8.0,
      status: 'active',
      stock: 120,
      categories: ['Brake'],
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400&fit=crop',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    stock: 1,
    categories: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  const availableCategories: AvailableCategory[] = [
    { id: 'CAT001', name: 'Oil' },
    { id: 'CAT002', name: 'Brake' },
    { id: 'CAT003', name: 'Filter' },
    { id: 'CAT004', name: 'Accessory' },
    { id: 'CAT005', name: 'Cleaning' },
  ];

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      status: 'active',
      stock: 1,
      categories: [],
    });
    setErrors({ name: '' });
    setShowModal(true);
  };

  const openEditModal = (p: ProductItem) => {
    setIsEditMode(true);
    setCurrentProduct(p);
    setImagePreview(p.image || '');
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      status: p.status,
      stock: p.stock,
      categories: [...p.categories],
    });
    setErrors({ name: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
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

  const removeCategory = (categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== categoryName),
    }));
  };

  const addCategoryToProduct = (categoryName: string) => {
    if (!formData.categories.includes(categoryName)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryName],
      }));
    }
    setShowCategoryDialog(false);
  };

  const handleSave = () => {
    // Reset errors
    setErrors({ name: '' });

    // Validate required fields
    let hasError = false;
    const newErrors = { name: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'សូមបញ្ចូលឈ្មោះផលិតផល';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ');
      return;
    }

    const finalPrice = parseFloat(formData.price);

    if (isEditMode && currentProduct) {
      setProducts((prev) =>
        prev.map((prd) =>
          prd.id === currentProduct.id
            ? {
              ...prd,
              name: formData.name,
              description: formData.description,
              price: finalPrice,
              status: formData.status,
              stock: formData.stock,
              categories: formData.categories,
              image: imagePreview || prd.image,
            }
            : prd,
        ),
      );
      alert('ផលិតផលត្រូវបានកែប្រែជោគជ័យ!');
    } else {
      const newProduct: ProductItem = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        status: formData.status,
        stock: formData.stock,
        categories: formData.categories,
        image: imagePreview,
      };
      setProducts((prev) => [...prev, newProduct]);
      alert('ផលិតផលត្រូវបានបង្កើតជោគជ័យ!');
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="service-package-header">
        <h1>ផលិតផលទាំងអស់</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បន្ថែមផលិតផលថ្មី
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="product-grid-ecommerce">
        {products.map((prd) => (
          <div key={prd.id} className="service-card-enhanced">
            <div className="service-card-image">
              <img
                src={
                  prd.image ||
                  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=250&fit=crop'
                }
                alt={prd.name}
              />
              <span className={`status-badge-overlay ${prd.status}`}>
                {prd.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="service-card-body">
              <div className="service-card-header-enhanced">
                <div>
                  <div className="service-card-title">{prd.name}</div>
                  <div className="service-card-id">#{String(prd.id).padStart(4, '0')}</div>
                </div>
              </div>

              <div className="service-card-description">{prd.description}</div>

              <div className="service-card-content">
                <div className="content-section">
                  <div className="content-label">ប្រភេទផលិតផល</div>
                  <div className="content-items">
                    {prd.categories.length === 0 ? (
                      <span className="item-tag">មិនមានប្រភេទបញ្ជាក់</span>
                    ) : (
                      prd.categories.map((c, idx) => (
                        <span key={idx} className="item-tag">
                          {c}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="content-section">
                  <div className="content-label">ស្តុកនៅសល់</div>
                  <div className="content-items">
                    <span className="item-tag">{prd.stock} ឯកតា</span>
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price">${prd.price.toFixed(2)}</div>
                <div className="card-actions">
                  <button
                    className="btn-small btn-edit"
                    onClick={() => {
                      openEditModal(prd);
                    }}
                  >
                    កែសម្រួល
                  </button>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => {
                      handleDelete(prd.id);
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
              <h2>{isEditMode ? 'កែសម្រួលផលិតផល' : 'បង្កើតផលិតផលថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Image Upload */}
              <div className="form-section">
                <h3 className="form-section-title">រូបភាពផលិតផល</h3>
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
                  <label htmlFor="productId" className="form-label">
                    លេខសម្គាល់ផលិតផល
                  </label>
                  <input
                    id="productId"
                    type="text"
                    className="form-input"
                    value={isEditMode ? `#${String(currentProduct?.id).padStart(4, '0')}` : '#AUTO-GENERATED'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName" className="form-label">
                    ឈ្មោះផលិតផល *
                  </label>
                  <input
                    id="productName"
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="បញ្ចូលឈ្មោះផលិតផល"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="productDescription" className="form-label">
                    ពិពណ៌នាផលិតផល
                  </label>
                  <textarea
                    id="productDescription"
                    className="form-textarea"
                    placeholder="បញ្ចូលការពិពណ៌នាផលិតផល..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }));
                    }}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="productPrice" className="form-label">
                      តម្លៃ ($) *
                    </label>
                    <input
                      id="productPrice"
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
                    <label htmlFor="productStatus" className="form-label">
                      ស្ថានភាព *
                    </label>
                    <select
                      id="productStatus"
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="productStock" className="form-label">
                      បរិមាណស្តុក
                    </label>
                    <input
                      id="productStock"
                      type="number"
                      min={0}
                      className="form-input"
                      value={formData.stock}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          stock: parseInt(e.target.value) || 0,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Categories Section */}
              <div className="form-section">
                <h3 className="form-section-title">ប្រភេទផលិតផល</h3>
                <div className="multi-select-container">
                  <div className="select-header">
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      បន្ថែមប្រភេទសម្រាប់ផលិតផលនេះ
                    </span>
                    <button
                      type="button"
                      className="btn-add"
                      onClick={() => {
                        setShowCategoryDialog(true);
                      }}
                    >
                      + បន្ថែមប្រភេទ
                    </button>
                  </div>
                  <div className="selected-items">
                    {formData.categories.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                        មិនទាន់មានប្រភេទ
                      </div>
                    ) : (
                      formData.categories.map((c, idx) => (
                        <div key={idx} className="selected-item">
                          <div className="item-info">
                            <span className="item-name">{c}</span>
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              removeCategory(c);
                            }}
                          >
                            លុប
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
                {isEditMode ? 'កែប្រែផលិតផល' : 'រក្សាទុកផលិតផល'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection Dialog */}
      {showCategoryDialog && (
        <div className="dialog-overlay" onClick={() => { setShowCategoryDialog(false); }}>
          <div className="dialog-box" onClick={(e) => { e.stopPropagation(); }}>
            <div className="dialog-header">
              <h3>ជ្រើសរើសប្រភេទ</h3>
            </div>
            <div className="dialog-body">
              <div className="dialog-list">
                {availableCategories
                  .filter((cat) => !formData.categories.includes(cat.name))
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className="dialog-item"
                      onClick={() => {
                        addCategoryToProduct(cat.name);
                      }}
                    >
                      <span className="dialog-item-name">{cat.name}</span>
                    </div>
                  ))}
                {availableCategories.filter((cat) => !formData.categories.includes(cat.name))
                  .length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                      ប្រភេទទាំងអស់ត្រូវបានបន្ថែមរួចហើយ
                    </div>
                  )}
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn-secondary" onClick={() => { setShowCategoryDialog(false); }}>
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
