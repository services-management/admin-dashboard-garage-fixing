import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Icon from '../../components/Icons';
import {
  fetchModels,
  createModel,
  updateModel,
  deleteModel,
  fetchMakes,
} from '../../store/vehicle/vehicleThunk';
import { clearError, clearSuccessMessage } from '../../store/vehicle/vehicleSlice';
import type { Model, ModelInput } from '../../store/vehicle/vehicleTypes';
import toast from 'react-hot-toast';

export default function VehicleModel() {
  const dispatch = useAppDispatch();
  const { models, makes, loading, error, successMessage } = useAppSelector(
    (state) => state.vehicle,
  );

  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState<ModelInput>({ name: '', make_id: 0 });

  useEffect(() => {
    dispatch(fetchModels());
    dispatch(fetchMakes());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      setShowForm(false);
      setEditingModel(null);
      setFormData({ name: '', make_id: 0 });
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch]);

  const handleCreate = () => {
    setEditingModel(null);
    const firstMakeId = makes.length > 0 ? makes[0].make_id || (makes[0] as any).id : 0;
    setFormData({ name: '', make_id: firstMakeId });
    setShowForm(true);
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setFormData({ name: model.name, make_id: model.make?.make_id || 0 });
    setShowForm(true);
  };

  const handleDelete = async (modelId: number) => {
    if (confirm('Are you sure you want to delete this model?')) {
      try {
        await dispatch(deleteModel(modelId)).unwrap();
        toast.success('Model deleted successfully');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete model');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make_id || formData.make_id === 0) {
      toast.error('Please select a make');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a model name');
      return;
    }
    try {
      if (editingModel) {
        await dispatch(updateModel({ modelId: editingModel.model_id, payload: formData })).unwrap();
        toast.success('Model updated successfully');
      } else {
        await dispatch(createModel(formData)).unwrap();
        toast.success('Model created successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save model');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingModel(null);
    setFormData({ name: '', make_id: 0 });
  };

  return (
    <div className="vehicle-model-page full-width-page">
      {/* Search Bar */}
      <div className="search-container">
        <input type="text" placeholder="Search models by name..." className="search-input" />
      </div>

      {/* Main Card */}
      <div className="card-container">
        <div className="card-header">
          <h2 className="page-title">All Models ({models.length})</h2>

          {!showForm && (
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              + Add Model
            </button>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingModel ? 'Edit Model' : 'Add New Model'}</h3>
                <button className="modal-close" onClick={handleCancel}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="modelName">ឈ្មោះModel </label>
                  <input
                    id="modelName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter model name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="makeSelect">ប្រភេទ</label>
                  <select
                    id="makeSelect"
                    value={formData.make_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        make_id: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  >
                    <option value="">Select Make</option>
                    {makes.map((make) => {
                      const makeId = make.make_id || (make as any).id;
                      return (
                        <option key={makeId} value={makeId}>
                          {make.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingModel ? 'Update Model' : 'Create Model'}
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
                <th>Model Name</th>
                <th>Make</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.length > 0 ? (
                [...models]
                  .sort((a, b) => {
                    const idA = (a as any).id || a.model_id;
                    const idB = (b as any).id || b.model_id;
                    return idA - idB;
                  })
                  .map((model, index) => {
                    const modelId = (model as any).id || model.model_id;
                    return (
                      <tr key={modelId || index}>
                        <td>{modelId}</td>
                        <td>{model.name}</td>
                        <td>
                          <span className="badge">{model.make?.name || '-'}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="icon-btn" onClick={() => handleEdit(model)}>
                              ✏️
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() => handleDelete(model.model_id)}
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
                  <td colSpan={4} className="no-data">
                    No models available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
