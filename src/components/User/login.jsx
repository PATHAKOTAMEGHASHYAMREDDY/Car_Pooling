import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { authAPI, authUtils } = await import('../../services/api');
      
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.login(credentials);
      
      if (response.token) {
        // Verify user is a passenger
        if (response.role !== 'PASSENGER') {
          alert('Please use the car owner login for your account type.');
          return;
        }

        // Store token and user data
        authUtils.setToken(response.token);
        authUtils.setUser({
          id: response.userId,
          name: response.name,
          email: response.email,
          role: response.role
        });
        
        // Redirect to user dashboard
        navigate('/user/dashboard');
      } else {
        alert(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Ride
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Passenger Sign In
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome back! Find and book affordable rides
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="animate-slideIn">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="animate-slideIn" style={{animationDelay: '0.1s'}}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between animate-slideIn" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="animate-slideIn" style={{animationDelay: '0.3s'}}>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                style={{background: 'linear-gradient(to right, #2563eb, #4f46e5)'}}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find My Rides
              </button>
            </div>

            <div className="text-center space-y-3 animate-slideIn" style={{animationDelay: '0.4s'}}>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/user/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign up as Passenger
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Want to host rides instead?{' '}
                <Link to="/car-owner/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Join as Car Owner
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;