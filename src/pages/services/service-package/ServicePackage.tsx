import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchComboServices, deleteComboService } from '../../../store/package/packageThunk';
import ServicePackageCard from './components/ServicePackageCard';
import CreateServicePackageModal from './components/CreateServicePackageModal';
import type { ComboService } from '../../../store/package/packageTypes';

interface ServicePackage {
  id: number;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  services: string[];
  products: { name: string; quantity: number }[];
  image?: string;
}

export default function ServicePackage() {
  const dispatch = useAppDispatch();
  const { list: comboServices, loading } = useAppSelector((state) => state.package);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ComboService | null>(null);

  useEffect(() => {
    dispatch(fetchComboServices());
  }, [dispatch]);

  const handleCreateClick = () => {
    setEditingPackage(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (pkg: ComboService) => {
    setEditingPackage(pkg);
    setShowCreateModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await dispatch(deleteComboService(id)).unwrap();
        alert('Package deleted successfully!');
      } catch (error) {
        alert('Failed to delete package');
      }
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingPackage(null);
  };

  const handleModalSuccess = () => {
    dispatch(fetchComboServices());
  };

  return (
    <div>
      <div className="service-package-header">
        <h1>កញ្ចប់សេវាកម្មទាំងអស់</h1>
        <button className="btn-primary" onClick={handleCreateClick}>
          + បង្កើតកញ្ចប់សេវាកម្មថ្មី
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      ) : comboServices && comboServices.length > 0 ? (
        <div className="service-grid-two-col">
          {comboServices.map((pkg) => (
            <ServicePackageCard
              key={pkg.combo_service_id}
              package={{
                id: parseInt(pkg.combo_service_id),
                name: pkg.name,
                description: pkg.description,
                price: pkg.total_price ? parseFloat(pkg.total_price) : pkg.price,
                status: pkg.is_available ? 'active' : 'inactive',
                services: pkg.service_names || pkg.services?.map((s) => s.name) || [],
                serviceDetails:
                  pkg.services?.map((s) => ({
                    name: s.name,
                    image_url: s.image_url,
                    price: s.price,
                  })) || [],
                products:
                  pkg.services?.reduce(
                    (acc, s) => {
                      s.associations?.forEach((assoc) => {
                        const existing = acc.find((p) => p.name === assoc.product_name);
                        if (existing) {
                          existing.quantity += assoc.quantity_required;
                        } else {
                          acc.push({
                            name: assoc.product_name,
                            quantity: assoc.quantity_required,
                          });
                        }
                      });
                      return acc;
                    },
                    [] as { name: string; quantity: number }[],
                  ) || [],
                image: pkg.image_url || pkg.image,
              }}
              onEdit={() => handleEditClick(pkg)}
              onDelete={() => handleDeleteClick(pkg.combo_service_id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No service packages available. Create one to get started!</p>
        </div>
      )}

      <CreateServicePackageModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingPackage={editingPackage}
      />
    </div>
  );
}
