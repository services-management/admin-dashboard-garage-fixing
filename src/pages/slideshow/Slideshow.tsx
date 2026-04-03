import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../components/Icons';
import {
  SlideshowService,
  type Slide,
  type SlideInput,
} from '../../store/slideshow/slideshowService';

export default function Slideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'All' | 'Home' | 'Garage'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SlideInput>({
    image_url: '',
    service_type: 'Home',
  });

  useEffect(() => {
    fetchSlides();
  }, [filterType]);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await SlideshowService.getSlides(filterType === 'All' ? undefined : filterType);
      setSlides(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({ image_url: '', service_type: 'Home' });
    setImageFile(null);
    setImagePreview('');
    setImageTab('url');
    setModalOpen(true);
  };

  const closeModal = () => {
    setImageFile(null);
    setImagePreview('');
    setModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageTab === 'url' && !form.image_url.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    if (imageTab === 'upload' && !imageFile) {
      toast.error('Please select an image file');
      return;
    }
    try {
      setSubmitting(true);
      // Create the slide first (with empty image_url if uploading file)
      const payload: SlideInput = {
        image_url: imageTab === 'url' ? form.image_url : '',
        service_type: form.service_type,
      };
      const created = await SlideshowService.createSlide(payload);
      // If file upload tab, upload the image to the created slide
      if (imageTab === 'upload' && imageFile && created?.id) {
        await SlideshowService.uploadSlideImage(created.id, imageFile);
      }
      toast.success('Slide created successfully');
      closeModal();
      fetchSlides();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create slide');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteSlideId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteSlideId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteSlideId) return;
    try {
      await SlideshowService.deleteSlide(deleteSlideId);
      toast.success('Slide deleted successfully');
      closeDeleteModal();
      fetchSlides();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete slide');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Slideshow</h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            គ្រប់គ្រងរូបភាព Slideshow
          </p>
        </div>
        <button className="btn-primary" onClick={openModal}>
          + បន្ថែម Slide
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['All', 'Home', 'Garage'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: filterType === type ? 'var(--brand-red, #c23127)' : 'var(--card-bg)',
              color: filterType === type ? '#fff' : 'var(--text-primary)',
              transition: 'all 0.2s',
            }}
          >
            {type === 'All' ? 'ទាំងអស់' : type}
            {type !== 'All' && (
              <span
                style={{
                  marginLeft: 6,
                  padding: '1px 8px',
                  borderRadius: 10,
                  fontSize: 11,
                  background:
                    filterType === type
                      ? 'rgba(255,255,255,0.25)'
                      : type === 'Home'
                        ? '#dbeafe'
                        : '#dcfce7',
                  color: filterType === type ? '#fff' : type === 'Home' ? '#1d4ed8' : '#15803d',
                }}
              >
                {type}
              </span>
            )}
          </button>
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 13,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {slides.length} slides
        </span>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Loading...
        </div>
      ) : slides.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            color: 'var(--text-secondary)',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '2px dashed var(--border-color)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🖼️</div>
          <p>គ្មាន Slide ទេ</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>ចុច "បន្ថែម Slide" ដើម្បីបន្ថែមរូបភាពថ្មី</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
            marginTop: 20,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={`slide-${slide.id ?? index}`}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f3f4f6' }}>
                <img
                  src={slide.image_url}
                  alt={`Slide ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Service Type</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontSize: 12,
                        fontWeight: 600,
                        background: slide.service_type === 'Home' ? '#dbeafe' : '#dcfce7',
                        color: slide.service_type === 'Home' ? '#1d4ed8' : '#15803d',
                      }}
                    >
                      {slide.service_type}
                    </span>
                  </div>
                </div>
                {slide.id && (
                  <button
                    className="icon-btn delete"
                    onClick={() => openDeleteModal(slide.id!)}
                    title="Delete Slide"
                    style={{
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Slide Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 480 }}
          >
            <div className="modal-header">
              <h2>បន្ថែម Slide ថ្មី</h2>
              <button className="modal-close" onClick={closeModal}>
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Image Tab Switcher */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                      background: imageTab === 'url' ? 'var(--primary)' : 'var(--card-bg)',
                      color: imageTab === 'url' ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    🔗 Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                      background: imageTab === 'upload' ? 'var(--primary)' : 'var(--card-bg)',
                      color: imageTab === 'upload' ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    📁 Upload File
                  </button>
                </div>

                {imageTab === 'url' ? (
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://example.com/slide1.jpg"
                      value={form.image_url}
                      onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                    />
                    {form.image_url && (
                      <div
                        style={{
                          marginTop: 8,
                          borderRadius: 8,
                          overflow: 'hidden',
                          aspectRatio: '16/9',
                          background: '#f3f4f6',
                        }}
                      >
                        <img
                          src={form.image_url}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Image File *</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 8,
                        padding: '24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--input-bg, #f9fafb)',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            maxHeight: 180,
                            objectFit: 'cover',
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        <>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            ចុចដើម្បីជ្រើសរើសរូបភាព
                          </p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>
                            JPG, PNG, WEBP
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {imageFile && (
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                        📄 {imageFile.name}
                      </p>
                    )}
                  </div>
                )}

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Service Type *</label>
                  <select
                    className="form-input"
                    value={form.service_type}
                    onChange={(e) => setForm((p) => ({ ...p, service_type: e.target.value }))}
                  >
                    <option value="Home">Home</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  បោះបង់
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400 }}
          >
            <div className="modal-header">
              <h2>បញ្ជាក់ការលុប</h2>
              <button className="modal-close" onClick={closeDeleteModal}>
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                តើអ្នកពិតជាចង់លុប Slide នេះមែនទេ? សកម្មភាពនេះមិនអាចមិនធ្វើវិញបានទេ។
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeDeleteModal}>
                បោះបង់
              </button>
              <button
                className="btn-primary"
                style={{ background: '#ef4444' }}
                onClick={confirmDelete}
              >
                លុប
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
