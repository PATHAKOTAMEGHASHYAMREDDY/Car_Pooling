import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Notification from '../Notification';
import carAnimation from '../../assets/car.json';

const CarOwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), type === 'error' ? 7000 : 5000);
  };

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
        // Verify user is a car owner
        if (response.role !== 'CAR_OWNER') {
          showNotification('Please use the Car Owner login for your account type.', 'warning');
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
        
        // Redirect to car owner dashboard
        navigate('/car-owner/dashboard');
      } else {
        showNotification(response.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Notification notification={notification} onClose={() => setNotification(null)} />
      <div className="flex items-center justify-center w-full max-w-6xl mx-auto gap-6">
        {/* Left side - Lottie Animation */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-start pl-4">
          <div className="w-[550px] h-[550px] xl:w-[650px] xl:h-[650px]">
            <Lottie 
              animationData={carAnimation} 
              loop={true} 
              autoplay={true}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:max-w-lg lg:mx-0">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Ride
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Car Owner Sign In
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome back! Host rides and earn money
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
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-input pr-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between animate-slideIn" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="animate-slideIn" style={{animationDelay: '0.3s'}}>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Dashboard
              </button>
            </div>

            <div className="text-center space-y-3 animate-slideIn" style={{animationDelay: '0.4s'}}>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/car-owner/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Sign up as Car Owner
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Looking for a ride instead?{' '}
                <Link to="/user/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200">
                  Join as Passenger
                </Link>
              </p>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CarOwnerLogin;