import axios from 'axios';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface BookingItem {
  service_id?: number;
  product_id?: number;
  quantity: number;
}

export interface CreateBookingPayload {
  phone: string;
  full_name: string;
  vehicle_id?: number;
  car_make: string;
  car_model: string;
  car_year: number;
  car_engine: string;
  items: BookingItem[];
  appointment_date: string;
  start_time: string;
  service_location: string;
  note?: string;
  source?: string;
}

export const BookingService = {
  // GET bookings
  getBookings: async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_BASE}/bookings/`, {
      params: { skip, limit },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // CREATE booking
  createBooking: async (payload: CreateBookingPayload) => {
    const response = await axios.post(`${API_BASE}/bookings/`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
