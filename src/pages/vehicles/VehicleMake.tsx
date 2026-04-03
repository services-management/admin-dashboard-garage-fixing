import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Icon from '../../components/Icons';
import { fetchMakes, createMake, updateMake, deleteMake } from '../../store/vehicle/vehicleThunk';
import { clearError, clearSuccessMessage } from '../../store/vehicle/vehicleSlice';
import type { Make, MakeInput } from '../../store/vehicle/vehicleTypes';
import toast from 'react-hot-toast';

export default function VehicleMake() {
  const dispatch = useAppDispatch();
  const { makes, loading, error, successMessage } = useAppSelector((state) => state.vehicle);

  const [showForm, setShowForm] = useState(false);
  const [editingMake, setEditingMake] = useState<Make | null>(null);
  const [formData, setFormData] = useState<MakeInput>({ name: '' });

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMakeId, setDeleteMakeId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMakes());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      setShowForm(false);
      setEditingMake(null);
      setFormData({ name: '' });
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch]);

  const handleCreate = () => {
    setEditingMake(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const handleEdit = (make: Make) => {
    setEditingMake(make);
    setFormData({ name: make.name });
    setShowForm(true);
  };

  const openDeleteModal = (makeId: number) => {
    setDeleteMakeId(makeId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteMakeId(null);
  };

  const confirmDelete = async () => {
    if (!deleteMakeId) return;
    try {
      await dispatch(deleteMake(deleteMakeId)).unwrap();
      toast.success('Make deleted successfully');
      closeDeleteModal();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete make');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMake) {
        const makeId = (editingMake as any).id || editingMake.make_id;
        await dispatch(updateMake({ makeId, payload: formData })).unwrap();
        toast.success('Make updated successfully');
      } else {
        await dispatch(createMake(formData)).unwrap();
        toast.success('Make created successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save make');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMake(null);
    setFormData({ name: '' });
  };

  return (
    <div className="vehicle-make-page full-width-page">
      {/* Search Bar */}
      <div className="search-container">
        <input type="text" placeholder="Search makes by name..." className="search-input" />
      </div>

      {/* Main Card */}
      <div className="card-container">
        <div className="card-header">
          <h2>ឈ្មោះរថយន្ត ({makes.length})</h2>

          {!showForm && (
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              + ឈ្មោះរថយន្ត
            </button>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingMake ? 'Edit Make' : 'Add New Make'}</h3>
                <button className="modal-close" onClick={handleCancel}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="makeName">ឈ្មោះរថយន្ត</label>
                  <input
                    id="makeName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="បញ្ចូលឈ្មោះប្រភេទរថយន្ត (ឧ. Toyota)"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingMake ? 'Update Make' : 'Create Make'}
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
                <th>ឈ្មោះរថយន្ត</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {makes.length > 0 ? (
                [...makes]
                  .sort((a, b) => {
                    const idA = (a as any).id || a.make_id;
                    const idB = (b as any).id || b.make_id;
                    return idA - idB;
                  })
                  .map((make, index) => {
                    const makeId = make.make_id || (make as any).id;
                    return (
                      <tr key={`make-${makeId}-${index}`}>
                        <td>{makeId}</td>
                        <td>{make.name}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="icon-btn" onClick={() => handleEdit(make)}>
                              ✏️
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() => openDeleteModal(makeId)}
                              title="Delete"
                            >
                              <Icon name="trash" size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr key="no-data">
                  <td colSpan={3} className="no-data">
                    គ្មានឈ្មោះរថយន្ត
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                  Are you sure you want to delete this make?
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
