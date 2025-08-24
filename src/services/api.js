const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Rides API
export const ridesAPI = {
  createRide: async (rideData) => {
    const response = await fetch(`${API_BASE_URL}/rides`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(rideData),
    });
    return handleResponse(response);
  },

  getMyRides: async () => {
    const response = await fetch(`${API_BASE_URL}/rides/my-rides`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  searchRides: async (searchParams) => {
    const queryParams = new URLSearchParams();
    
    // Only add parameters if they have actual values (not null, undefined, or empty string)
    if (searchParams.source && searchParams.source.trim()) {
      queryParams.append('source', searchParams.source.trim());
    }
    if (searchParams.destination && searchParams.destination.trim()) {
      queryParams.append('destination', searchParams.destination.trim());
    }
    if (searchParams.rideDate) {
      queryParams.append('rideDate', searchParams.rideDate);
    }

    console.log('Search URL:', `${API_BASE_URL}/rides/search?${queryParams}`);
    console.log('Search params:', searchParams);

    const response = await fetch(`${API_BASE_URL}/rides/search?${queryParams}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getActiveRides: async () => {
    const response = await fetch(`${API_BASE_URL}/rides/active`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getAllRides: async () => {
    const response = await fetch(`${API_BASE_URL}/rides/all`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getRideById: async (rideId) => {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  updateRide: async (rideId, rideData) => {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(rideData),
    });
    return handleResponse(response);
  },

  cancelRide: async (rideId) => {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  getDriverBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/driver-bookings`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  getRideBookings: async (rideId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/ride/${rideId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  approveBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/approve`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  rejectBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  cancelBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Vehicles API
export const vehiclesAPI = {
  createOrUpdateVehicle: async (vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  getMyVehicle: async () => {
    const response = await fetch(`${API_BASE_URL}/vehicles/my-vehicle`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  getVehicleById: async (vehicleId) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  deleteVehicle: async (vehicleId) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Auth helper functions
export const authUtils = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};