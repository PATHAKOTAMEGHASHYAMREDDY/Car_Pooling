import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ridesAPI,
  bookingsAPI,
  vehiclesAPI,
  authUtils,
} from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import DashboardLoader from "../../components/DashboardLoader";
import CarLoader from "../../components/CarLoader";
import Profile from "../../components/CarOwner/Profile";

const CarOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rides");
  const [user, setUser] = useState(null);
  const [showRideForm, setShowRideForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [postedRides, setPostedRides] = useState([]);
  const [rideBookings, setRideBookings] = useState([]);
  const [userVehicle, setUserVehicle] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  const [rideForm, setRideForm] = useState({
    source: "",
    destination: "",
    rideDate: "",
    rideTime: "",
    availableSeats: "",
    pricePerKm: "",
    distanceKm: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    car: "",
    model: "",
    year: "",
    licensePlate: "",
    capacity: "",
    color: "",
    fuelType: "Petrol",
  });

  // Check authentication and load user data
  useEffect(() => {
    const initializeDashboard = async () => {
      const currentUser = authUtils.getUser();
      if (!currentUser || !authUtils.isAuthenticated()) {
        navigate("/car-owner/login");
        return;
      }

      if (currentUser.role !== "CAR_OWNER") {
        navigate("/user/dashboard");
        return;
      }

      setUser(currentUser);
      await loadDashboardData();
      setInitialLoading(false);
    };

    initializeDashboard();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user's posted rides
      const rides = await ridesAPI.getMyRides();
      setPostedRides(rides || []);

      // Load bookings for driver's rides
      const bookings = await bookingsAPI.getDriverBookings();
      setRideBookings(bookings || []);

      // Separate pending bookings for approval
      const pending = bookings?.filter((b) => b.status === "PENDING") || [];
      setPendingBookings(pending);

      // Load user's vehicle
      try {
        const vehicle = await vehiclesAPI.getMyVehicle();
        setUserVehicle(vehicle);
        setVehicleForm({
          car: vehicle.car || "",
          model: vehicle.model || "",
          year: vehicle.year || "",
          licensePlate: vehicle.licensePlate || "",
          capacity: vehicle.capacity || "",
          color: vehicle.color || "",
          fuelType: vehicle.fuelType || "Petrol",
        });
      } catch (error) {
        // No vehicle found, that's okay
        setUserVehicle(null);
      }
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

  const handleApproveBooking = async (bookingId) => {
    try {
      await bookingsAPI.approveBooking(bookingId);
      showNotification("Booking approved successfully!");
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error approving booking:", error);
      showNotification(error.message || "Failed to approve booking", "error");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await bookingsAPI.rejectBooking(bookingId);
      showNotification("Booking rejected");
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error rejecting booking:", error);
      showNotification(error.message || "Failed to reject booking", "error");
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const handleRideFormChange = (e) => {
    setRideForm({
      ...rideForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleVehicleFormChange = (e) => {
    setVehicleForm({
      ...vehicleForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRideSubmit = async (e) => {
    e.preventDefault();

    if (!userVehicle) {
      showNotification("Please add your vehicle details first!", "error");
      setActiveTab("vehicle");
      return;
    }

    try {
      setLoading(true);

      const pricePerKm = parseFloat(rideForm.pricePerKm);
      const distanceKm = rideForm.distanceKm
        ? parseFloat(rideForm.distanceKm)
        : 10; // Default 10km if not provided
      const totalPrice = pricePerKm * distanceKm;

      const rideData = {
        ...rideForm,
        availableSeats: parseInt(rideForm.availableSeats),
        pricePerKm: pricePerKm,
        distanceKm: distanceKm,
        totalPrice: totalPrice,
      };

      const newRide = await ridesAPI.createRide(rideData);
      setPostedRides((prev) => [newRide, ...prev]);

      // Reset form
      setRideForm({
        source: "",
        destination: "",
        rideDate: "",
        rideTime: "",
        availableSeats: "",
        pricePerKm: "",
        distanceKm: "",
      });

      setShowRideForm(false);
      showNotification("Ride posted successfully!");
    } catch (error) {
      console.error("Error creating ride:", error);
      showNotification(
        error.message || "Failed to post ride. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const vehicleData = {
        ...vehicleForm,
        capacity: parseInt(vehicleForm.capacity),
      };

      const savedVehicle = await vehiclesAPI.createOrUpdateVehicle(vehicleData);
      setUserVehicle(savedVehicle);

      setShowVehicleForm(false);
      showNotification(
        userVehicle
          ? "Vehicle updated successfully!"
          : "Vehicle added successfully!"
      );
    } catch (error) {
      console.error("Error saving vehicle:", error);
      showNotification(
        error.message || "Failed to save vehicle. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = (rideId) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Ride",
      message:
        "Are you sure you want to cancel this ride? This action cannot be undone.",
      onConfirm: () => performCancelRide(rideId),
      type: "danger",
    });
  };

  const performCancelRide = async (rideId) => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    try {
      await ridesAPI.cancelRide(rideId);
      setPostedRides((prev) => prev.filter((ride) => ride.id !== rideId));
      showNotification("Ride cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling ride:", error);
      showNotification(error.message || "Failed to cancel ride.", "error");
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
        userType="CAR_OWNER"
        minDisplayTime={1500}
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
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
                      {user?.name || "User"}
                    </span>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfile(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
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
                          Edit Profile
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
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
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                  onClick={() => setActiveTab("rides")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "rides"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Rides ({postedRides.length})
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                    activeTab === "pending"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Pending Requests ({pendingBookings.length})
                  {pendingBookings.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingBookings.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "bookings"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Bookings ({rideBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("vehicle")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "vehicle"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Vehicle{" "}
                  {!userVehicle && <span className="text-red-500">*</span>}
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
              {activeTab === "rides" && (
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
                      My Posted Rides ({postedRides.length})
                    </h3>
                    <button
                      onClick={() => setShowRideForm(true)}
                      disabled={!userVehicle}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        !userVehicle
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 inline mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Post New Ride
                    </button>
                  </div>

                  {!userVehicle && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 text-yellow-400 mr-2"
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
                          <h3 className="text-sm font-medium text-yellow-800">
                            Vehicle Required
                          </h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please add your vehicle details in the "My Vehicle"
                            tab before posting rides.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Ride Form Modal */}
                  {showRideForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            Post New Ride
                          </h3>
                          <button
                            onClick={() => setShowRideForm(false)}
                            className="text-gray-400 hover:text-gray-600"
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

                        <form onSubmit={handleRideSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              From
                            </label>
                            <input
                              type="text"
                              name="source"
                              required
                              className="form-input"
                              placeholder="Pickup location"
                              value={rideForm.source}
                              onChange={handleRideFormChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              To
                            </label>
                            <input
                              type="text"
                              name="destination"
                              required
                              className="form-input"
                              placeholder="Destination"
                              value={rideForm.destination}
                              onChange={handleRideFormChange}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                name="rideDate"
                                required
                                className="form-input"
                                value={rideForm.rideDate}
                                onChange={handleRideFormChange}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                              </label>
                              <input
                                type="time"
                                name="rideTime"
                                required
                                className="form-input"
                                value={rideForm.rideTime}
                                onChange={handleRideFormChange}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available Seats
                              </label>
                              <input
                                type="number"
                                name="availableSeats"
                                required
                                min="1"
                                max={userVehicle?.capacity || 8}
                                className="form-input"
                                placeholder="1"
                                value={rideForm.availableSeats}
                                onChange={handleRideFormChange}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price per KM (₹)
                              </label>
                              <input
                                type="number"
                                name="pricePerKm"
                                required
                                min="0.1"
                                step="0.1"
                                className="form-input"
                                placeholder="0.5"
                                value={rideForm.pricePerKm}
                                onChange={handleRideFormChange}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Distance (KM) - Optional
                            </label>
                            <input
                              type="number"
                              name="distanceKm"
                              min="1"
                              step="0.1"
                              className="form-input"
                              placeholder="Estimated distance"
                              value={rideForm.distanceKm}
                              onChange={handleRideFormChange}
                            />
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowRideForm(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 btn-primary"
                            >
                              {loading ? "Posting..." : "Post Ride"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {/* Posted Rides List */}
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CarLoader size={120} text="Loading your rides..." />
                    </div>
                  ) : postedRides.length === 0 ? (
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
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No rides posted
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by posting your first ride.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {postedRides.map((ride, index) => (
                        <div
                          key={ride.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    ride.status === "ACTIVE"
                                      ? "bg-green-100 text-green-800"
                                      : ride.status === "CANCELLED"
                                      ? "bg-red-100 text-red-800"
                                      : ride.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {ride.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Ride #{ride.id}
                                </span>
                              </div>

                              <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="font-medium text-gray-900">
                                    {ride.source}
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
                                    {ride.destination}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <p className="font-medium">
                                    {formatDate(ride.rideDate)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Time:</span>
                                  <p className="font-medium">
                                    {formatTime(ride.rideTime)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Seats:</span>
                                  <p className="font-medium">
                                    {ride.availableSeats -
                                      (ride.bookedSeats || 0)}
                                    /{ride.availableSeats}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Price:</span>
                                  <p className="font-medium">
                                    ₹{ride.pricePerKm}/km
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Bookings:
                                  </span>
                                  <p className="font-medium">
                                    {ride.bookedSeats || 0}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="ml-6 flex space-x-2">
                              {ride.status === "ACTIVE" && (
                                <button
                                  onClick={() => handleCancelRide(ride.id)}
                                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  Cancel
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

              {activeTab === "pending" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 text-orange-600 mr-2"
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
                    Pending Booking Requests ({pendingBookings.length})
                  </h3>

                  {pendingBookings.length === 0 ? (
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
                        No pending requests
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        All booking requests have been processed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingBookings.map((booking, index) => (
                        <div
                          key={booking.id}
                          className="bg-orange-50 border border-orange-200 rounded-lg p-6 animate-fadeIn"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="flex-shrink-0">
                                  <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-semibold text-sm">
                                      {booking.passengerName
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "P"}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {booking.passengerName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {booking.passengerPhone}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white rounded-lg p-3 border">
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
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Route
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {booking.source} → {booking.destination}
                                  </p>
                                </div>

                                <div className="bg-white rounded-lg p-3 border">
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Seats
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    {booking.seatsBooked} seat
                                    {booking.seatsBooked > 1 ? "s" : ""}
                                  </p>
                                </div>

                                <div className="bg-white rounded-lg p-3 border">
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
                                      Amount
                                    </span>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    ₹{booking.totalPrice}
                                  </p>
                                </div>
                              </div>

                              {booking.bookingNotes && (
                                <div className="bg-white rounded-lg p-3 border mb-4">
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
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4 4z"
                                      />
                                    </svg>
                                    <span className="text-xs text-gray-600 font-medium">
                                      Passenger Notes
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {booking.bookingNotes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="ml-6 flex-shrink-0 space-y-2">
                              <button
                                onClick={() => handleApproveBooking(booking.id)}
                                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                              >
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectBooking(booking.id)}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                              >
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    Ride Requests ({rideBookings.length})
                  </h3>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CarLoader
                        size={120}
                        text="Loading booking requests..."
                      />
                    </div>
                  ) : rideBookings.length === 0 ? (
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
                        No booking requests
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Booking requests will appear here when passengers book
                        your rides.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rideBookings.map((booking, index) => (
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

                              {/* Passenger Details Card */}
                              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex-shrink-0">
                                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                      <span className="text-white font-semibold text-sm">
                                        {booking.passengerName
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("") || "P"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                      {booking.passengerName || "N/A"}
                                    </h4>
                                    <div className="flex flex-col space-y-1">
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
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                          {booking.passengerPhone || "N/A"}
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                          {booking.passengerEmail || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                                  <span className="text-gray-500">Seats:</span>
                                  <p className="font-medium">
                                    {booking.seatsBooked} seat
                                    {booking.seatsBooked > 1 ? "s" : ""}
                                  </p>
                                </div>
                              </div>

                              {booking.bookingNotes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-500">
                                    Notes:
                                  </span>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {booking.bookingNotes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="ml-6 text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ₹{booking.totalPrice}
                              </p>
                              <p className="text-sm text-gray-500">Earnings</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "vehicle" && (
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
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM7 9l4-4 4 4M7 9v6a2 2 0 002 2h6a2 2 0 002-2V9M7 9H5a2 2 0 00-2 2v6a2 2 0 002 2h2m10-8V9a2 2 0 00-2-2H9a2 2 0 00-2 2v0"
                        />
                      </svg>
                      My Vehicle
                    </h3>
                    <button
                      onClick={() => setShowVehicleForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 inline mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            userVehicle
                              ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                          }
                        />
                      </svg>
                      {userVehicle ? "Edit Vehicle" : "Add Vehicle"}
                    </button>
                  </div>

                  {userVehicle ? (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-8 h-8 text-white"
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
                        </div>
                        <div className="ml-4">
                          <h4 className="text-2xl font-bold text-gray-900">
                            {userVehicle.carModel}
                          </h4>
                          <p className="text-indigo-600 font-medium">
                            {userVehicle.licensePlate}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-blue-600"
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
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Capacity</p>
                              <p className="font-semibold text-gray-900">
                                {userVehicle.capacity} seats
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a4 4 0 01-4 4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Color</p>
                              <p className="font-semibold text-gray-900">
                                {userVehicle.color || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fuel Type</p>
                              <p className="font-semibold text-gray-900">
                                {userVehicle.fuelType || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM7 9l4-4 4 4M7 9v6a2 2 0 002 2h6a2 2 0 002-2V9M7 9H5a2 2 0 00-2 2v6a2 2 0 002 2h2m10-8V9a2 2 0 00-2-2H9a2 2 0 00-2 2v0"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No vehicle added
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your vehicle details to start posting rides.
                      </p>
                    </div>
                  )}
                  {/* Vehicle Form Modal */}
                  {showVehicleForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            {userVehicle ? "Edit Vehicle" : "Add Vehicle"}
                          </h3>
                          <button
                            onClick={() => setShowVehicleForm(false)}
                            className="text-gray-400 hover:text-gray-600"
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

                        <form
                          onSubmit={handleVehicleSubmit}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Car *
                              </label>
                              <input
                                type="text"
                                name="car"
                                required
                                className="form-input"
                                placeholder="e.g., Toyota"
                                value={vehicleForm.car}
                                onChange={handleVehicleFormChange}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Model *
                              </label>
                              <input
                                type="text"
                                name="model"
                                required
                                className="form-input"
                                placeholder="e.g., Camry"
                                value={vehicleForm.model}
                                onChange={handleVehicleFormChange}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year *
                              </label>
                              <input
                                type="text"
                                name="year"
                                required
                                pattern="[0-9]{4}"
                                className="form-input"
                                placeholder="e.g., 2020"
                                value={vehicleForm.year}
                                onChange={handleVehicleFormChange}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color *
                              </label>
                              <input
                                type="text"
                                name="color"
                                required
                                className="form-input"
                                placeholder="e.g., Silver"
                                value={vehicleForm.color}
                                onChange={handleVehicleFormChange}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              License Plate *
                            </label>
                            <input
                              type="text"
                              name="licensePlate"
                              required
                              className="form-input"
                              placeholder="e.g., ABC-1234"
                              value={vehicleForm.licensePlate}
                              onChange={handleVehicleFormChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Capacity *
                            </label>
                            <input
                              type="number"
                              name="capacity"
                              required
                              min="2"
                              max="8"
                              className="form-input"
                              placeholder="4"
                              value={vehicleForm.capacity}
                              onChange={handleVehicleFormChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fuel Type
                            </label>
                            <select
                              name="fuelType"
                              className="form-input"
                              value={vehicleForm.fuelType}
                              onChange={handleVehicleFormChange}
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Electric">Electric</option>
                              <option value="Hybrid">Hybrid</option>
                              <option value="CNG">CNG</option>
                            </select>
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowVehicleForm(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 btn-primary"
                            >
                              {loading
                                ? "Saving..."
                                : userVehicle
                                ? "Update Vehicle"
                                : "Add Vehicle"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </h3>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl font-semibold">
                            {user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">
                            {user?.name || "User"}
                          </h4>
                          <p className="text-gray-600">Car Owner</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowProfile(true)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Full Name
                          </label>
                          <p className="text-gray-900 font-medium">
                            {user?.name || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email Address
                          </label>
                          <p className="text-gray-900 font-medium">
                            {user?.email || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                          </label>
                          <p className="text-gray-900 font-medium">
                            {user?.phone || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Gender
                          </label>
                          <p className="text-gray-900 font-medium">
                            {user?.gender ? (
                              user.gender === 'MALE' ? 'Male' : 
                              user.gender === 'FEMALE' ? 'Female' : 'Other'
                            ) : 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Account Type
                          </label>
                          <p className="text-gray-900 font-medium">Car Owner</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Member Since
                          </label>
                          <p className="text-gray-900 font-medium">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Recently joined"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Total Rides Posted
                          </label>
                          <p className="text-gray-900 font-medium">
                            {postedRides.length} rides
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          type={confirmModal.type}
          confirmText="Yes, Cancel"
          cancelText="Keep Ride"
        />

        {/* Profile Modal */}
        {showProfile && (
          <Profile
            user={user}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              showNotification("Profile updated successfully!");
            }}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </>
  );
};

export default CarOwnerDashboard;
