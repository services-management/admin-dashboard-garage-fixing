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
    setErrors({ name: '' });

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
        id: Math.max(...products.map((p) => p.id), 0) + 1,
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

  // Modal UI
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData((p) => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categories</label>
                  <div className="categories-input">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="form-input"
                        placeholder="Add category"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const v = (e.target as HTMLInputElement).value.trim();
                            if (v) {
                              addCategoryToProduct(v);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button
                        className="btn-small"
                        onClick={() => setShowCategoryDialog((s) => !s)}
                        type="button"
                      >
                        Suggestions
                      </button>
                    </div>
                    <div className="selected-items">
                      {formData.categories.map((c, i) => (
                        <span key={i} className="item-tag">
                          {c}
                          <button className="btn-remove" onClick={() => removeCategory(c)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {showCategoryDialog && (
                      <div className="suggestions">
                        {availableCategories.map((cat) => (
                          <button
                            key={cat.id}
                            className="btn-small"
                            onClick={() => addCategoryToProduct(cat.name)}
                            type="button"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: 200 }} />}
                </div>
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
    </div>
  );
}

