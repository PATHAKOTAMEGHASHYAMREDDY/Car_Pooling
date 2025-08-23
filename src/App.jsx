import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import CarOwnerLogin from "./components/CarOwner/login";
import CarOwnerSignup from "./components/CarOwner/signup";
import UserLogin from "./components/User/login";
import UserSignup from "./components/User/signup";
import AdminLogin from "./components/Admin/AdminLogin";
import CarOwnerDashboard from "./pages/DashBoards/CarOwnerDashboard";
import UserDashboard from "./pages/DashBoards/UserDashboard";
import AdminDashboard from "./pages/DashBoards/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/car-owner/login" element={<CarOwnerLogin />} />
          <Route path="/car-owner/signup" element={<CarOwnerSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/car-owner/dashboard" element={<CarOwnerDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
