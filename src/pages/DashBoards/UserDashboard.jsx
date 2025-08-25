import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ridesAPI, bookingsAPI, authUtils } from "../../services/api";
import BookingModal from "../../components/BookingModal";
import ConfirmModal from "../../components/ConfirmModal";
import DashboardLoader from "../../components/DashboardLoader";
import CarLoader from "../../components/CarLoader";
const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("search");
  const [user, setUser] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    seatsBooked: 1,
    passengerName: "",
    passengerPhone: "",
    bookingNotes: "",
  });

  const [searchForm, setSearchForm] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const [showExpiredRides, setShowExpiredRides] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    const initializeDashboard = async () => {
      const currentUser = authUtils.getUser();
      if (!currentUser || !authUtils.isAuthenticated()) {
        navigate("/user/login");
        return;
      }

      if (currentUser.role !== "PASSENGER") {
        navigate("/car-owner/dashboard");
        return;
      }

      setUser(currentUser);
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || ''
      });
      await loadDashboardData(showExpiredRides);
      setInitialLoading(false);
    };

    initializeDashboard();
  }, [navigate]);

  const loadDashboardData = async (includeExpired = false) => {
    try {
      setLoading(true);

      // Load both data sets in parallel for better performance
      const [ridesResponse, bookingsResponse] = await Promise.all([
        includeExpired ? ridesAPI.getAllRides() : ridesAPI.getActiveRides(),
        bookingsAPI.getMyBookings(),
      ]);

      setAvailableRides(ridesResponse || []);
      setMyBookings(bookingsResponse || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showNotification("Error loading dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      onConfirm: () => {
        authUtils.logout();
        navigate("/");
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
      type: 'warning'
    });
  };

  const handleProfileClick = () => {
    setActiveTab("profile");
    setIsEditingProfile(false);
  };

  const handleProfileFormChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        gender: profileForm.gender,
      };

      // Call API to update profile
      const response = await fetch("http://localhost:8081/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUtils.getToken()}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update profile";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();

      // Update local storage with new user data
      const newUserData = {
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
      };
      
      authUtils.setUser(newUserData);
      setUser(newUserData);
      setIsEditingProfile(false);
      showNotification('Profile updated successfully!');
    } catch (error) {
      console.error("Profile update error:", error);
      showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const searchParams = {
        source: searchForm.source?.trim() || null,
        destination: searchForm.destination?.trim() || null,
        rideDate: searchForm.date || null,
      };

      console.log("Searching with params:", searchParams);

      // Use search if there are search parameters, otherwise load all rides
      const hasSearchParams = searchParams.source || searchParams.destination || searchParams.rideDate;
      const rides = hasSearchParams 
        ? await ridesAPI.searchRides(searchParams)
        : (showExpiredRides ? await ridesAPI.getAllRides() : await ridesAPI.getActiveRides());
      
      setAvailableRides(rides || []);

      if (!rides || rides.length === 0) {
        showNotification("No rides found matching your criteria", "info");
      } else {
        showNotification(`Found ${rides.length} ride(s) matching your search`);
      }
    } catch (error) {
      console.error("Search error details:", error);

      // Fallback: try to load all active rides if search fails
      try {
        console.log("Search failed, loading all rides as fallback...");
        const allRides = showExpiredRides ? await ridesAPI.getAllRides() : await ridesAPI.getActiveRides();
        setAvailableRides(allRides || []);
        showNotification("Search failed, showing all available rides", "info");
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        showNotification(`Error searching rides: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if ride date and time have passed
  const isRideExpired = (rideDate, rideTime) => {
    if (!rideDate || !rideTime) return false;
    
    const now = new Date();
    let rideDateTime;
    
    // Handle different date formats
    if (typeof rideDate === 'string') {
      // If it's in DD/MM format, assume current year
      if (rideDate.match(/^\d{1,2}\/\d{1,2}$/)) {
        const [day, month] = rideDate.split('/');
        rideDateTime = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
      } else {
        rideDateTime = new Date(rideDate);
      }
    } else {
      rideDateTime = new Date(rideDate);
    }
    
    // Add the time to the date
    if (rideTime) {
      const [hours, minutes] = rideTime.split(':');
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    return rideDateTime < now;
  };

  // Get time until ride or time since completion
  const getRideTimeStatus = (rideDate, rideTime) => {
    if (!rideDate || !rideTime) return "";
    
    const now = new Date();
    let rideDateTime = new Date(rideDate);
    const [hours, minutes] = rideTime.split(':');
    rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diffMs = rideDateTime - now;
    const diffHours = Math.abs(diffMs) / (1000 * 60 * 60);
    
    if (diffMs > 0) {
      // Future ride
      if (diffHours < 1) {
        const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
        return `Starts in ${diffMinutes} minutes`;
      } else if (diffHours < 24) {
        return `Starts in ${Math.floor(diffHours)} hours`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }
    } else {
      // Past ride
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffHours * 60);
        return `Completed ${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return `Completed ${Math.floor(diffHours)} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `Completed ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    }
  };

  const handleBookRide = (ride) => {
    // Check if ride has expired
    if (isRideExpired(ride.rideDate, ride.rideTime)) {
      showNotification("This ride has already completed. You cannot book expired rides.", "error");
      return;
    }

    setSelectedRide(ride);
    setBookingForm({
      seatsBooked: 1,
      passengerName: user?.name || "",
      passengerPhone: user?.phone || "",
      bookingNotes: "",
    });
    setShowBookingModal(true);
  };

  const handleBookingFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitBooking = async () => {
    try {
      const bookingData = {
        rideId: selectedRide.id,
        seatsBooked: parseInt(bookingForm.seatsBooked),
        passengerName: bookingForm.passengerName,
        passengerPhone: bookingForm.passengerPhone,
        bookingNotes: bookingForm.bookingNotes,
      };

      const newBooking = await bookingsAPI.createBooking(bookingData);

      // Update local state
      setMyBookings((prev) => [newBooking, ...prev]);

      // Refresh available rides to update seat availability
      loadDashboardData();

      setShowBookingModal(false);
      showNotification(
        "Booking request sent! Your seats are temporarily held pending car owner approval."
      );
    } catch (error) {
      console.error("Booking error:", error);
      showNotification(
        error.message || "Failed to book ride. Please try again.",
        "error"
      );
    }
  };

  const handleCancelBooking = (bookingId, bookingStatus) => {
    const confirmMessage =
      bookingStatus === "CONFIRMED"
        ? "Are you sure you want to cancel this confirmed booking? This will free up the seats for other passengers."
        : "Are you sure you want to cancel this booking request?";

    setConfirmModal({
      isOpen: true,
      title: 'Cancel Booking',
      message: confirmMessage,
      onConfirm: () => performCancelBooking(bookingId, bookingStatus),
      type: 'danger'
    });
  };

  const performCancelBooking = async (bookingId, bookingStatus) => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    try {
      setLoading(true);
      await bookingsAPI.cancelBooking(bookingId);

      // Update local state - update the booking status to CANCELLED
      setMyBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      // Small delay to ensure backend has processed the cancellation
      setTimeout(async () => {
        await loadDashboardData();
      }, 500);

      const successMessage =
        bookingStatus === "CONFIRMED"
          ? "Confirmed booking cancelled successfully! Seats are now available for other passengers."
          : "Booking request cancelled successfully!";

      showNotification(successMessage);
    } catch (error) {
      console.error("Cancel booking error:", error);
      showNotification(
        error.message || "Failed to cancel booking. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Dashboard Loader */}
      <DashboardLoader 
        isLoading={initialLoading}
        userType="PASSENGER"
        minDisplayTime={1500}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center animate-slideIn">
              <Link
                to="/"
                className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                RideShare
              </Link>
            </div>
            <div className="flex items-center space-x-4 animate-slideIn">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.name || "User"}
                  </span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("search")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "search"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Search Rides
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Bookings ({myBookings.length})
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "search" && (
              <div>
                {/* Search Form */}
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl shadow-lg animate-fadeIn">
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-6 h-6 text-indigo-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Find Your Perfect Ride
                    </h3>
                  </div>
                  <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                  >
                    <div className="animate-slideIn">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        From
                      </label>
                      <input
                        type="text"
                        name="source"
                        placeholder="Enter pickup location"
                        className="form-input"
                        value={searchForm.source}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div
                      className="animate-slideIn"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        To
                      </label>
                      <input
                        type="text"
                        name="destination"
                        placeholder="Enter destination"
                        className="form-input"
                        value={searchForm.destination}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div
                      className="animate-slideIn"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4z"
                          />
                        </svg>
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-input"
                        value={searchForm.date}
                        onChange={handleSearchChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div
                      className="flex items-end animate-slideIn"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center"
                      >
                        {loading ? (
                          <svg
                            className="animate-spin h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        )}
                        {loading ? "Searching..." : "Search Rides"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Available Rides */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <svg
                        className="w-6 h-6 text-indigo-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Available Rides ({availableRides.length})
                    </h3>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={showExpiredRides}
                          onChange={(e) => {
                            setShowExpiredRides(e.target.checked);
                            loadDashboardData(e.target.checked);
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Show completed rides</span>
                      </label>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CarLoader 
                        size={120}
                        text="Searching for rides..."
                      />
                    </div>
                  ) : availableRides.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No rides available
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {showExpiredRides 
                          ? "No rides found in the system." 
                          : "No active rides available. Try checking 'Show completed rides' or adjusting your search criteria."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {availableRides.map((ride, index) => (
                        <div
                          key={ride.id}
                          className={`ride-card p-6 animate-fadeIn ${
                            isRideExpired(ride.rideDate, ride.rideTime) 
                              ? "opacity-75 border-red-200 bg-red-50" 
                              : ""
                          }`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-white font-semibold text-sm">
                                        {ride.driverName
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("") || "D"}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-semibold text-gray-900">
                                      {ride.driverName || "Driver"}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {ride.driverPhone || ""}
                                    </p>
                                  </div>
                                </div>
                                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                                  isRideExpired(ride.rideDate, ride.rideTime)
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d={isRideExpired(ride.rideDate, ride.rideTime)
                                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      }
                                    />
                                  </svg>
                                  <span>{getRideTimeStatus(ride.rideDate, ride.rideTime)}</span>
                                </div>
                              </div>

                              {/* Route Display */}
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="font-semibold text-gray-900">
                                    {ride.source}
                                  </span>
                                </div>
                                <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                                  <svg
                                    className="w-5 h-5 text-gray-400 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                  </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <span className="font-semibold text-gray-900">
                                    {ride.destination}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Date
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    {formatDate(ride.rideDate)}
                                  </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Time
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    {formatTime(ride.rideTime)}
                                  </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Seats
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-semibold text-gray-900">
                                      {ride.availableSeatsRemaining ||
                                        ride.availableSeats -
                                          (ride.bookedSeats || 0)}{" "}
                                      available
                                    </p>
                                    <div className="flex space-x-2 text-xs">
                                      {ride.confirmedSeats > 0 && (
                                        <span className="flex items-center text-red-600">
                                          <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                                          {ride.confirmedSeats} booked
                                        </span>
                                      )}
                                      {ride.pendingSeats > 0 && (
                                        <span className="flex items-center text-yellow-600">
                                          <div className="w-2 h-2 bg-yellow-500 rounded mr-1"></div>
                                          {ride.pendingSeats} pending
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Price
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    ₹{ride.pricePerKm}/km
                                  </p>
                                </div>
                              </div>

                              {ride.vehicleModel && (
                                <div className="mb-4 space-y-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM7 9l4-4 4 4M7 9v6a2 2 0 002 2h6a2 2 0 002-2V9M7 9H5a2 2 0 00-2 2v6a2 2 0 002 2h2m10-8V9a2 2 0 00-2-2H9a2 2 0 00-2 2v0"
                                      />
                                    </svg>
                                    {ride.vehicleModel}
                                  </span>
                                  <div className="flex space-x-4 text-sm text-gray-600">
                                    {ride.vehicleColor && (
                                      <span className="flex items-center">
                                        <div
                                          className="w-3 h-3 rounded-full mr-1 border"
                                          style={{
                                            backgroundColor:
                                              ride.vehicleColor.toLowerCase(),
                                          }}
                                        ></div>
                                        {ride.vehicleColor}
                                      </span>
                                    )}
                                    {ride.vehicleFuelType && (
                                      <span className="flex items-center">
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                                          />
                                        </svg>
                                        {ride.vehicleFuelType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="ml-6 flex-shrink-0">
                              {isRideExpired(ride.rideDate, ride.rideTime) ? (
                                <div className="px-6 py-3 rounded-lg font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center space-x-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>Ride Completed</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleBookRide(ride)}
                                  disabled={
                                    loading ||
                                    (ride.availableSeatsRemaining ||
                                      ride.availableSeats -
                                        (ride.bookedSeats || 0)) <= 0
                                  }
                                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    (ride.availableSeatsRemaining ||
                                      ride.availableSeats -
                                        (ride.bookedSeats || 0)) <= 0
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105"
                                  }`}
                                >
                                  {(ride.availableSeatsRemaining ||
                                    ride.availableSeats -
                                      (ride.bookedSeats || 0)) <= 0
                                    ? "Full"
                                    : "Book Ride"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "bookings" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  My Bookings ({myBookings.length})
                </h3>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <CarLoader 
                      size={120}
                      text="Loading your bookings..."
                    />
                  </div>
                ) : myBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No bookings yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by searching and booking your first ride!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === "CONFIRMED"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "CANCELLED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                Booking #{booking.id}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-gray-900">
                                  {booking.source}
                                </span>
                              </div>
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="font-medium text-gray-900">
                                  {booking.destination}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium">
                                  {formatDate(booking.rideDate)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Time:</span>
                                <p className="font-medium">
                                  {formatTime(booking.rideTime)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Driver:</span>
                                <p className="font-medium">
                                  {booking.driverName}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Seats:</span>
                                <p className="font-medium">
                                  {booking.seatsBooked}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6 text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{booking.totalPrice}
                            </p>
                            {(booking.status === "CONFIRMED" ||
                              booking.status === "PENDING") && (
                              <button
                                onClick={() =>
                                  handleCancelBooking(
                                    booking.id,
                                    booking.status
                                  )
                                }
                                disabled={loading}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              >
                                {loading ? (
                                  <>
                                    <svg
                                      className="animate-spin h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    <span>Cancelling...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    <span>Cancel Booking</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "profile" && (
              <div>
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {isEditingProfile ? 'Edit Profile' : 'User Profile'}
                    </h3>
                    <p className="text-gray-600">
                      {isEditingProfile ? 'Update your information' : 'Manage your account details'}
                    </p>
                  </div>

                  {/* Profile Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Full Name
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.name || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        Email Address
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your email address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.email || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Phone Number
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.phone || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Gender
                      </label>
                      {isEditingProfile ? (
                        <select
                          name="gender"
                          value={profileForm.gender}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select your gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.gender ? (
                            user.gender === 'MALE' ? 'Male' : 
                            user.gender === 'FEMALE' ? 'Female' : 'Other'
                          ) : 'Not provided'}
                        </p>
                      )}
                    </div>



                    {/* User Role */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Account Type
                      </label>
                      <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user?.role || 'PASSENGER'}
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      {isEditingProfile ? (
                        <>
                          <button
                            onClick={() => {
                              setIsEditingProfile(false);
                              setProfileForm({
                                name: user?.name || '',
                                email: user?.email || '',
                                phone: user?.phone || '',
                                gender: user?.gender || ''
                              });
                            }}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Booking Modal */}
      {showBookingModal && selectedRide && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-100/80 via-purple-100/80 to-blue-100/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[95vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Book Your Ride
                    </h3>
                    <p className="text-sm text-gray-500">
                      Secure your seat now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Trip Details Card */}
              <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {selectedRide.driverName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "D"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedRide.driverName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedRide.driverPhone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">
                      ₹{selectedRide.pricePerKm}/km
                    </p>
                    {selectedRide.vehicleModel && (
                      <p className="text-xs text-gray-500">
                        {selectedRide.vehicleModel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      {selectedRide.source}
                    </span>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                    <svg
                      className="w-4 h-4 text-gray-400 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      {selectedRide.destination}
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {formatDate(selectedRide.rideDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {formatTime(selectedRide.rideTime)}
                    </span>
                  </div>
                </div>

                {/* Seat Availability */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">
                      {selectedRide.availableSeatsRemaining ||
                        selectedRide.availableSeats -
                          (selectedRide.bookedSeats || 0)}{" "}
                      Available
                    </span>
                  </div>
                  {selectedRide.pendingSeats > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-700">
                        {selectedRide.pendingSeats} Pending
                      </span>
                    </div>
                  )}
                  {selectedRide.confirmedSeats > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-700">
                        {selectedRide.confirmedSeats} Booked
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-5">
                {/* Seat Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <svg
                      className="w-4 h-4 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Number of Seats
                    <span className="text-green-600 font-bold ml-2">
                      (
                      {selectedRide.availableSeatsRemaining ||
                        selectedRide.availableSeats -
                          (selectedRide.bookedSeats || 0)}{" "}
                      available)
                    </span>
                  </label>
                  {(selectedRide.availableSeatsRemaining ||
                    selectedRide.availableSeats -
                      (selectedRide.bookedSeats || 0)) > 0 ? (
                    <select
                      name="seatsBooked"
                      value={bookingForm.seatsBooked}
                      onChange={handleBookingFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      {[
                        ...Array(
                          Math.min(
                            selectedRide.availableSeatsRemaining ||
                              selectedRide.availableSeats -
                                (selectedRide.bookedSeats || 0),
                            4
                          )
                        ),
                      ].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} seat{i > 0 ? "s" : ""} - ₹
                          {(
                            (selectedRide.pricePerKm || 0) *
                            (selectedRide.distanceKm || 10) *
                            (i + 1)
                          ).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <div>
                          <p className="text-red-600 text-sm font-medium">
                            No seats available
                          </p>
                          <p className="text-red-500 text-xs">
                            All seats are booked or pending approval
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg
                        className="w-4 h-4 inline mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="passengerName"
                      value={bookingForm.passengerName}
                      onChange={handleBookingFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg
                        className="w-4 h-4 inline mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      name="passengerPhone"
                      value={bookingForm.passengerPhone}
                      onChange={handleBookingFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <svg
                      className="w-4 h-4 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4 4z"
                      />
                    </svg>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="bookingNotes"
                    value={bookingForm.bookingNotes}
                    onChange={handleBookingFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    rows="3"
                    placeholder="Any special requests or notes for the driver..."
                  />
                </div>

                {/* Price Summary */}
                {bookingForm.seatsBooked && selectedRide.pricePerKm && (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-xl font-bold text-indigo-600">
                        ₹
                        {(
                          (selectedRide.pricePerKm || 0) *
                          (selectedRide.distanceKm || 10) *
                          parseInt(bookingForm.seatsBooked)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {bookingForm.seatsBooked} seat
                      {parseInt(bookingForm.seatsBooked) > 1 ? "s" : ""} × ₹
                      {selectedRide.pricePerKm}/km ×{" "}
                      {selectedRide.distanceKm || 10}km
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  disabled={
                    !bookingForm.passengerName ||
                    !bookingForm.passengerPhone ||
                    (selectedRide.availableSeatsRemaining ||
                      selectedRide.availableSeats -
                        (selectedRide.bookedSeats || 0)) <= 0
                  }
                  className="flex-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {(selectedRide.availableSeatsRemaining ||
                    selectedRide.availableSeats -
                      (selectedRide.bookedSeats || 0)) <= 0
                    ? "No Seats Available"
                    : "Confirm Booking"}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-yellow-800 font-medium">
                      Booking Request
                    </p>
                    <p className="text-xs text-yellow-700">
                      Your booking will be sent to the driver for approval.
                      You'll be notified once confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        type={confirmModal.type}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
      </div>
    </>
  );
};

export default UserDashboard;
