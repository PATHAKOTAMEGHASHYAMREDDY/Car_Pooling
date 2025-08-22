import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import carpoolAnimation from "../assets/carpool.json";

const Landing = () => {
  const navigate = useNavigate();
  const [animationError, setAnimationError] = useState(false);

  const handleAnimationError = () => {
    setAnimationError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center animate-slideIn">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Car Pooling
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Left-Right Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

              {/* Admin Button */}
              <div className="group">
                <button
                  onClick={() => navigate("/admin/login")}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 group-hover:scale-105 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    🛡️
                  </div>
                  Admin
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
                  <p className="text-gray-600">
                    Interactive carpool animation
                  </p>
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

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Car Pooling
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Connecting travelers and making journeys more affordable, sustainable, and social. 
                Join thousands of users who trust us for their daily commute and long-distance travels.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">How it Works</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Safety</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Community Guidelines</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Car Pooling. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">Made with ❤️ for sustainable travel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
