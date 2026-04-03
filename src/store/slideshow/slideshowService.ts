import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE as string;

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Slide {
  id?: number;
  image_url: string;
  service_type: string;
}

export interface SlideInput {
  image_url: string;
  service_type: string;
}

export const SlideshowService = {
  getSlides: async (service_type?: string) => {
    if (service_type) {
      const response = await axios.get(`${API_BASE}/slideshow/${service_type}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    }
    // Fetch both Home and Garage slides and combine
    const [home, garage] = await Promise.all([
      axios.get(`${API_BASE}/slideshow/Home`, { headers: getAuthHeader() }),
      axios.get(`${API_BASE}/slideshow/Garage`, { headers: getAuthHeader() }),
    ]);
    return [
      ...(Array.isArray(home.data) ? home.data : []),
      ...(Array.isArray(garage.data) ? garage.data : []),
    ];
  },

  createSlide: async (payload: SlideInput) => {
    const response = await axios.post(`${API_BASE}/slideshow/`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteSlide: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/slideshow/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  uploadSlideImage: async (slide_id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE}/slideshow/${slide_id}/image`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
