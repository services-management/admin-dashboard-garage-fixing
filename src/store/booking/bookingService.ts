import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST as string;

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

export interface AdminCreateBookingPayload {
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
  service_mode: string;
  note?: string;
  internal_note?: string;
  assigned_garage_id?: string;
}

export interface DailyOverview {
  stats: {
    total_bookings: number;
    pending: number;
    approved: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
  };
  bookings: any[];
}

export const BookingService = {
  // GET all bookings (admin) with optional search and filter
  getBookings: async (skip = 0, limit = 100, query?: string, status?: string) => {
    const params: Record<string, any> = { skip, limit };
    if (query) params.query = query;
    if (status) params.status = status;

    const response = await axios.get(`${API_BASE}/admin/bookings`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // GET daily overview with stats and bookings
  getDailyOverview: async (target_date: string): Promise<DailyOverview> => {
    const response = await axios.get(`${API_BASE}/admin/overview`, {
      params: { target_date },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // CREATE booking (guest/customer)
  createBooking: async (payload: CreateBookingPayload) => {
    const response = await axios.post(`${API_BASE}/bookings/`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // CREATE booking (admin - for customer)
  createAdminBooking: async (payload: AdminCreateBookingPayload) => {
    const response = await axios.post(`${API_BASE}/admin/bookings`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // ACCEPT booking (admin - approve pending booking)
  acceptBooking: async (bookingId: number) => {
    const response = await axios.post(
      `${API_BASE}/admin/bookings/${bookingId}/accept`,
      {},
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },

  // REJECT booking (admin - cancel with reason)
  rejectBooking: async (bookingId: number, reason: string) => {
    const response = await axios.post(
      `${API_BASE}/admin/bookings/${bookingId}/reject`,
      { reason },
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },

  // ASSIGN technical team to booking
  assignBooking: async (bookingId: number, technicalTeamId: string) => {
    const response = await axios.post(
      `${API_BASE}/admin/bookings/${bookingId}/assign`,
      { technical_team_id: technicalTeamId },
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },

  // UPLOAD invoice for booking
  uploadInvoice: async (bookingId: number, externalInvoiceUrl: string) => {
    const response = await axios.post(
      `${API_BASE}/admin/bookings/${bookingId}/invoice`,
      { external_invoice_url: externalInvoiceUrl },
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },
};
