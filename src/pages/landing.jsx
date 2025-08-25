import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import carpoolAnimation from "../assets/carpool.json";
import carpoolImage from "../assets/car-pool.jpg";
import userDashboardImage from "../assets/userDashboard.png";

const Landing = () => {
  const navigate = useNavigate();
  const [animationError, setAnimationError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleAnimationError = () => {
    setAnimationError(true);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  // Back to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show/hide back to top button based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center animate-slideIn">
              <div className="flex-shrink-0">
                <h1
                  className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => scrollToSection("hero")}
                >
                  Car Pooling
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 hover:scale-105 transform"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 hover:scale-105 transform"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 hover:scale-105 transform"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("footer")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 hover:scale-105 transform"
              >
                Contact
              </button>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-fadeIn">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-left text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("footer")}
                  className="text-left text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2"
                >
                  Contact
                </button>

                {/* Mobile Action Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Left-Right Layout */}
      <main id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-6xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className="animate-fadeIn">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl tracking-tight font-extrabold text-gray-900">
                <span className="block animate-slideIn">
                  Share Your Journey
                </span>
                <span
                  className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-slideIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  Save Money & Environment
                </span>
              </h1>

              <p
                className="mt-6 text-lg text-gray-600 sm:text-xl leading-relaxed animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
              >
                Connect with fellow travelers going your way. Share rides, split
                costs, and reduce your carbon footprint.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn"
              style={{ animationDelay: "0.6s" }}
            >
              {/* Host a Ride Button */}
              <div className="group">
                <button
                  onClick={() => navigate("/car-owner/login")}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl group-hover:scale-105 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    🚗
                  </div>
                  Host a Ride
                </button>
              </div>

              {/* Find a Ride Button */}
              <div className="group">
                <button
                  onClick={() => navigate("/user/login")}
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl group-hover:scale-105 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    🔍
                  </div>
                  Find a Ride
                </button>
              </div>


            </div>
          </div>

          {/* Right Side - Carpool Animation */}
          <div
            className="flex justify-center items-center animate-fadeIn pl-4"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-full max-w-lg lg:max-w-xl">
              {!animationError ? (
                <Lottie
                  animationData={carpoolAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: "100%", height: "450px" }}
                  className="drop-shadow-lg"
                  onError={handleAnimationError}
                />
              ) : (
                // Fallback content if animation fails to load
                <div className="w-full h-96 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-custom">
                    <svg
                      className="w-12 h-12 text-white"
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    Carpool Animation
                  </h3>
                  <p className="text-gray-600">Interactive carpool animation</p>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="mt-24 animate-fadeIn"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Smart Ride?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the future of shared mobility
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div
              className="card text-center p-8 group hover:scale-105 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="w-8 h-8"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Save Money
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Split fuel costs and travel expenses with fellow passengers.
                Save up to 70% on your travel costs.
              </p>
            </div>

            <div
              className="card text-center p-8 group hover:scale-105 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Eco Friendly
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Reduce carbon footprint by sharing rides. Help create a
                sustainable future for our planet.
              </p>
            </div>

            <div
              className="card text-center p-8 group hover:scale-105 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="w-8 h-8"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Safe & Secure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Verified users and secure payment system. Your safety and
                security are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* User Dashboard Showcase Section */}
      <section id="dashboard" className="bg-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Experience Our User Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how easy it is to find and book rides with our intuitive user interface. 
              Search for rides, manage bookings, and track your journey all in one place.
            </p>
          </div>

          <div className="relative">
            {/* Dashboard Image Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
              <img
                src={userDashboardImage}
                alt="User Dashboard Interface"
                className="w-full h-auto rounded-xl shadow-lg"
              />

              {/* Static Feature Highlights - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:block absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Live Ride Search</span>
                </div>
              </div>

              <div className="hidden lg:block absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Easy Booking</span>
                </div>
              </div>

              <div className="hidden lg:block absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                </div>
              </div>

              <div className="hidden lg:block absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600 text-sm">Find rides by location, date, and preferences with our intelligent search system.</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600 text-sm">Book your seat in just a few clicks with instant confirmation and notifications.</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm">Monitor your bookings, ride history, and get real-time updates on your journeys.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Car Pooling Section */}
      <section
        id="about"
        className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 mt-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="animate-fadeIn group">
              <div className="relative transform transition-all duration-700 hover:scale-105">
                <img
                  src={carpoolImage}
                  alt="Car Pooling Community"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover transition-all duration-500 group-hover:shadow-3xl group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl transition-all duration-500 group-hover:from-black/10"></div>

                {/* Floating Animation Elements */}
                <div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full opacity-80 animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute top-1/2 -left-6 w-6 h-6 bg-purple-500 rounded-full opacity-60 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute -bottom-2 left-1/4 w-4 h-4 bg-green-500 rounded-full opacity-70 animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Hover Overlay with Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/90 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center">
                  <div className="text-white text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-xl font-bold mb-2">
                      Join the Movement
                    </h4>
                    <p className="text-sm opacity-90">
                      Thousands of happy travelers sharing rides daily
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div
              className="space-y-6 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 transform transition-all duration-500 hover:scale-105">
                The Future of
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 transition-all duration-500">
                  {" "}
                  Shared Mobility
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed transform transition-all duration-300 hover:text-gray-700">
                Car pooling is revolutionizing the way we travel. By sharing
                rides, we're not just saving money - we're building communities,
                reducing traffic congestion, and creating a more sustainable
                future for everyone.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 group cursor-pointer transform transition-all duration-300 hover:translate-x-2 hover:bg-white/50 rounded-lg p-3 -m-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110 group-hover:shadow-lg">
                    <svg
                      className="w-5 h-5 text-green-600 transition-all duration-300 group-hover:scale-110"
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
                  </div>
                  <div className="transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Reduce Carbon Emissions
                    </h4>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Every shared ride means one less car on the road,
                      significantly reducing CO2 emissions.
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-4 group cursor-pointer transform transition-all duration-300 hover:translate-x-2 hover:bg-white/50 rounded-lg p-3 -m-3"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110 group-hover:shadow-lg">
                    <svg
                      className="w-5 h-5 text-blue-600 transition-all duration-300 group-hover:scale-110"
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
                  </div>
                  <div className="transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      Build Communities
                    </h4>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Meet like-minded people, make new friends, and strengthen
                      local communities through shared journeys.
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-4 group cursor-pointer transform transition-all duration-300 hover:translate-x-2 hover:bg-white/50 rounded-lg p-3 -m-3"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110 group-hover:shadow-lg">
                    <svg
                      className="w-5 h-5 text-purple-600 transition-all duration-300 group-hover:scale-110"
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
                  </div>
                  <div className="transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                      Smart Economics
                    </h4>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Split costs intelligently - save money on fuel, tolls, and
                      parking while making travel affordable for everyone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100">
                    <div className="text-2xl font-bold text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-700">
                      50K+
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
                      Happy Users
                    </div>
                    <div className="w-full h-1 bg-indigo-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="text-2xl font-bold text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:text-green-700">
                      2M+
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                      Rides Shared
                    </div>
                    <div className="w-full h-1 bg-green-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                        style={{ transitionDelay: "0.1s" }}
                      ></div>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="text-2xl font-bold text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-700">
                      75%
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                      Cost Savings
                    </div>
                    <div className="w-full h-1 bg-purple-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                        style={{ transitionDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Car Pooling
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Connecting travelers and making journeys more affordable,
                sustainable, and social. Join thousands of users who trust us
                for their daily commute and long-distance travels. Together,
                we're building a greener, more connected world one ride at a
                time.
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-indigo-100 hover:to-purple-100">
                <h5 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                  Why Car Pooling Matters:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="transform transition-all duration-300 hover:translate-x-2 hover:text-gray-800">
                    • Reduces traffic congestion by up to 40%
                  </li>
                  <li
                    className="transform transition-all duration-300 hover:translate-x-2 hover:text-gray-800"
                    style={{ transitionDelay: "0.1s" }}
                  >
                    • Cuts individual travel costs by 50-70%
                  </li>
                  <li
                    className="transform transition-all duration-300 hover:translate-x-2 hover:text-gray-800"
                    style={{ transitionDelay: "0.2s" }}
                  >
                    • Decreases carbon footprint significantly
                  </li>
                  <li
                    className="transform transition-all duration-300 hover:translate-x-2 hover:text-gray-800"
                    style={{ transitionDelay: "0.3s" }}
                  >
                    • Creates meaningful social connections
                  </li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Pricing & Savings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Environmental Impact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Community Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Insurance Coverage
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Dispute Resolution
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Car Pooling Platform. All rights reserved. Building
              sustainable communities through shared mobility.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">
                Made with ❤️ for sustainable travel
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Eco-Friendly Platform
                </span>
              </div>
              {/* Admin Access */}
              <button
                onClick={() => navigate("/admin/login")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-50"
                title="Admin Access"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-fadeIn"
          aria-label="Back to top"
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Floating Action Button for Quick Access */}
      <div className="fixed bottom-8 left-8 z-50">
        <div className="group">
          <button className="bg-white shadow-lg rounded-full p-4 hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Need Help? Contact Support
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
