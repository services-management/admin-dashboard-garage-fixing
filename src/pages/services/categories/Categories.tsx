import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../store/category/categoryThunk';
import type { Category } from '../../../store/category/categoryTypes';

export default function Categories() {
  const dispatch = useAppDispatch();
  const { list: categories, loading, error } = useAppSelector((s) => s.category);
  const { products } = useAppSelector((s) => s.product);
  const { list: services } = useAppSelector((s) => s.service);

  // Debug logging
  useEffect(() => {
    console.log('Categories from Redux:', categories);
    console.log('Categories length:', categories?.length);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [categories, loading, error]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    console.log('Dispatching fetchCategories...');
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      category.description.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('សូមបញ្ចូលឈ្មោះ Category');
      return;
    }

    try {
      if (isEditMode && currentCategory) {
        await dispatch(
          updateCategory({
            categoryID: currentCategory.categoryID,
            name: formData.name,
            description: formData.description,
          }),
        ).unwrap();
        toast.success('Category ត្រូវបានកែប្រែជោគជ័យ');
      } else {
        await dispatch(
          createCategory({
            name: formData.name,
            description: formData.description,
          }),
        ).unwrap();
        toast.success('Category ត្រូវបានបង្កើតជោគជ័យ');
      }
      closeModal();
    } catch (err: any) {
      toast.error(err || 'Save failed');
    }
  };

  const isCategoryInUse = (categoryId: number): boolean => {
    const usedInProducts = products.some((p) => p.category?.categoryID === categoryId);
    const usedInServices = services.some((svc) =>
      svc.associations.some((assoc) => assoc.category_id === categoryId),
    );
    return usedInProducts || usedInServices;
  };

  const getProductsUsingCategory = (categoryId: number): string[] => {
    return products.filter((p) => p.category?.categoryID === categoryId).map((p) => p.name);
  };

  const getServicesUsingCategory = (categoryId: number): string[] => {
    return services
      .filter((svc) => svc.associations.some((assoc) => assoc.category_id === categoryId))
      .map((svc) => svc.name);
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteError(null);
    if (isCategoryInUse(category.categoryID)) {
      const productNames = getProductsUsingCategory(category.categoryID);
      const serviceNames = getServicesUsingCategory(category.categoryID);
      let errorMsg = `Cannot delete "${category.name}" because it is used by:`;
      if (productNames.length > 0) {
        errorMsg += `\n- Products: ${productNames.join(', ')}`;
      }
      if (serviceNames.length > 0) {
        errorMsg += `\n- Services: ${serviceNames.join(', ')}`;
      }
      setDeleteError(errorMsg);
    }
    setCurrentCategory(category);
    setDeleteCategoryId(category.categoryID);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return;

    if (deleteError || isCategoryInUse(deleteCategoryId)) {
      toast.error('មិនអាចលុបបានទេ');
      return;
    }

    try {
      await dispatch(deleteCategory(deleteCategoryId)).unwrap();
      toast.success('Category ត្រូវបានលុបជោគជ័យ');
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
      setDeleteError(null);
      setCurrentCategory(null);
    } catch (err: any) {
      toast.error(err || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="service-package-header">
        <h1>ប្រភេទផលិតផល</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + បង្កើតប្រភេទថ្មី
        </button>
      </div>

      {/* Search */}
      <div className="category-search" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="ស្វែងរកប្រភេទ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div
          style={{
            color: 'red',
            padding: '10px',
            background: '#fee',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Category List */}
      <div className="category-grid">
        {filteredCategories.map((category) => (
          <div key={category.categoryID} className="category-card">
            <div className="category-card-content">
              <h3>{category.name}</h3>
              <p>{category.description || 'No description'}</p>
              <div className="category-meta">
                <span className="category-id">ID: #{category.categoryID}</span>
                {isCategoryInUse(category.categoryID) && (
                  <span className="in-use-badge">In Use</span>
                )}
              </div>
            </div>
            <div className="category-card-actions">
              <button className="btn-small btn-edit" onClick={() => openEditModal(category)}>
                កែសម្រួល
              </button>
              {!isCategoryInUse(category.categoryID) && (
                <button
                  className="btn-small btn-delete"
                  onClick={() => handleDeleteClick(category)}
                >
                  លុប
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="no-data">
          {searchKeyword ? 'No categories match your search' : 'No categories found'}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'កែសម្រួលប្រភេទ' : 'បង្កើតប្រភេទថ្មី'}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>{deleteError ? 'Cannot Delete' : 'តើអ្នកចង់លុបមែនទេ'}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                  setCurrentCategory(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              {deleteError && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>
                    ⚠️ Cannot delete this category!
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '14px' }}>{deleteError}</p>
                </div>
              )}
              <p>
                <strong style={{ color: '#ef4444' }}>
                  តើអ្នកចង់លុបមែនទេ {currentCategory?.name || 'Category'}
                </strong>
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                  setCurrentCategory(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteConfirm}
                disabled={!!deleteError}
                style={deleteError ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
