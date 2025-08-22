import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLoader from "../../components/DashboardLoader";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Initialize admin dashboard
    const initializeDashboard = async () => {
      // Check admin authentication
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        navigate("/admin/login");
        return;
      }
      
      // Simulate loading time
      setTimeout(() => {
        setInitialLoading(false);
      }, 1000);
    };

    initializeDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/");
  };

  return (
    <>
      {/* Dashboard Loader */}
      <DashboardLoader 
        isLoading={initialLoading}
        userType="ADMIN"
        minDisplayTime={1500}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RideShare Admin
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Dashboard content will be added here...
          </p>
        </div>
      </main>
      </div>
    </>
  );
};

export default AdminDashboard;
