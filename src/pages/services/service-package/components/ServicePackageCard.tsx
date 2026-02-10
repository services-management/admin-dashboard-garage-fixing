interface ServicePackage {
  id: number;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  services: string[]; // This will be service names
  products: { name: string; quantity: number }[];
  image?: string;
  // Add the actual service details from the API response
  serviceDetails?: {
    name: string;
    image_url: string;
    price: number | string;
  }[];
}

interface ServicePackageCardProps {
  package: ServicePackage;
  onEdit: (pkg: ServicePackage) => void;
  onDelete: (id: number) => void;
}

export default function ServicePackageCard({
  package: pkg,
  onEdit,
  onDelete,
}: ServicePackageCardProps) {
  return (
    <div className="service-card-enhanced">
      <div className="service-card-image">
        <img
          src={
            pkg.image ??
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop'
          }
          alt={pkg.name}
        />
        <span className={`status-badge-overlay ${pkg.status}`}>
          {pkg.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="service-card-body">
        <div className="service-card-header-enhanced">
          <div>
            <div className="service-card-title">{pkg.name}</div>
            <div className="service-card-id">#{String(pkg.id).padStart(4, '0')}</div>
          </div>
        </div>

        <div className="service-card-description">{pkg.description}</div>

        <div className="service-card-content">
          <div className="content-section">
            <div className="content-label">Services Included</div>
            <div className="content-items">
              {pkg.services.length > 0 ? (
                pkg.services.map((name, index) => (
                  <span key={`${name}-${index}`} className="item-tag">
                    {name}
                  </span>
                ))
              ) : (
                <div className="no-services">No services included</div>
              )}
            </div>
          </div>

          <div className="content-section">
            <div className="content-label">Products Included</div>
            <div className="content-items">
              {pkg.products.length > 0 ? (
                pkg.products.map((product) => (
                  <span key={product.name} className="item-tag">
                    {product.name} × {product.quantity}
                  </span>
                ))
              ) : (
                <div className="no-services">No products included</div>
              )}
            </div>
          </div>
        </div>

        <div className="service-card-footer">
          <div className="service-total-price">${(pkg.price || 0).toFixed(2)}</div>
          <div className="card-actions">
            <button
              className="btn-small btn-edit"
              onClick={() => {
                onEdit(pkg);
              }}
            >
              កែសម្រួល
            </button>
            <button
              className="btn-small btn-delete"
              onClick={() => {
                onDelete(pkg.id);
              }}
            >
              លុប
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
