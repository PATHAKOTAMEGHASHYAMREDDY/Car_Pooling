import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import Notification from '../Notification';
import carBookingAnimation from '../../assets/carBooking.json';

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const verifyEmail = async () => {
    if (!formData.email) {
      setEmailError("Please enter an email address first");
      return;
    }

    // Basic email format validation first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email format");
      return;
    }

    setIsVerifyingEmail(true);
    setEmailError("");

    const options = {
      method: "GET",
      url: "https://validect-email-verification-v1.p.rapidapi.com/v1/verify",
      params: {
        email: formData.email,
      },
      headers: {
        "x-rapidapi-key": "f84d6701fcmshdbebcbe929333f4p157408jsn684aad0a8a07",
        "x-rapidapi-host": "validect-email-verification-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("API Response:", response.data);

      // Handle different possible response structures
      if (response.data && response.data.valid === true) {
        setIsEmailVerified(true);
        setEmailError("");
      } else if (response.data && response.data.valid === false) {
        setEmailError("Email address is not valid. Please check and try again.");
        setIsEmailVerified(false);
      } else if (response.data && response.data.status === "valid") {
        setIsEmailVerified(true);
        setEmailError("");
      } else if (response.data && response.data.status === "invalid") {
        setEmailError("Email address is not valid. Please check and try again.");
        setIsEmailVerified(false);
      } else if (response.status === 200) {
        // If API returns 200 but unclear response, assume valid for now
        setIsEmailVerified(true);
        setEmailError("");
      } else {
        setEmailError("Unable to verify email. Please check the format and try again.");
        setIsEmailVerified(false);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      if (error.response) {
        // API responded with error status
        console.log("Error response:", error.response.data);
        if (error.response.status === 429) {
          setEmailError("Too many requests. Please wait a moment and try again.");
        } else if (error.response.status === 401) {
          setEmailError("API authentication failed. Please try again later.");
        } else {
          setEmailError("Email verification service is temporarily unavailable.");
        }
      } else if (error.request) {
        // Network error
        setEmailError("Network error. Please check your connection and try again.");
      } else {
        // For development/testing purposes, allow manual verification
        // Remove this in production
        if (emailRegex.test(formData.email)) {
          console.log("Using fallback verification for development");
          setIsEmailVerified(true);
          setEmailError("");
        } else {
          setEmailError("Please enter a valid email address.");
        }
      }
      setIsEmailVerified(false);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      showNotification('Please verify your email address first!', 'warning');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    try {
      const { authAPI, authUtils } = await import('../../services/api');
      
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        password: formData.password,
        role: 'PASSENGER'
      };

      const response = await authAPI.register(userData);
      
      if (response.token) {
        // Store token and user data
        authUtils.setToken(response.token);
        authUtils.setUser({
          id: response.userId,
          name: response.name,
          email: response.email,
          phone: response.phone,
          gender: response.gender,
          role: response.role
        });
        
        // Redirect to user dashboard
        navigate('/user/dashboard');
      } else {
        showNotification(response.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification(error.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Notification notification={notification} onClose={() => setNotification(null)} />
      <div className="flex items-center justify-center w-full max-w-6xl mx-auto gap-6">
        {/* Left side - Lottie Animation */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-start pl-4">
          <div className="w-[450px] h-[450px] xl:w-[500px] xl:h-[500px]">
            <Lottie 
              animationData={carBookingAnimation} 
              loop={true} 
              autoplay={true}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Right side - Signup Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:max-w-lg lg:mx-0">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Ride
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Passenger Sign Up
            </h2>
            <p className="mt-2 text-gray-600">
              Join us to find affordable rides
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="animate-slideIn">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="animate-slideIn" style={{animationDelay: '0.1s'}}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <div className="flex space-x-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`form-input flex-1 ${isEmailVerified ? 'border-green-500' : emailError ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={verifyEmail}
                    disabled={isVerifyingEmail || !formData.email}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isEmailVerified 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : isVerifyingEmail 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isVerifyingEmail ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isEmailVerified ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
                {isEmailVerified && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email verified successfully!
                  </p>
                )}
              </div>

              <div className="animate-slideIn" style={{animationDelay: '0.2s'}}>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="animate-slideIn" style={{animationDelay: '0.25s'}}>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="form-input"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select your gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="animate-slideIn" style={{animationDelay: '0.3s'}}>
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
                    placeholder="Create a strong password"
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

              <div className="animate-slideIn" style={{animationDelay: '0.35s'}}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="form-input pr-10"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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

            <div className="animate-slideIn" style={{animationDelay: '0.4s'}}>
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200 mt-1"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div className="animate-slideIn" style={{animationDelay: '0.45s'}}>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                style={{background: 'linear-gradient(to right, #2563eb, #4f46e5)'}}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Passenger Account
              </button>
            </div>

            <div className="text-center space-y-3 animate-slideIn" style={{animationDelay: '0.5s'}}>
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/user/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Want to host rides instead?{' '}
                <Link to="/car-owner/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Join as Car Owner
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

export default UserSignup;