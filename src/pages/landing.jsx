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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
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
                    <svg
                      className="w-4 h-4 text-indigo-600"
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
                  </div>
                  Find a Ride
                </button>
                
              </div>
            </div>

            {/* Quick Features */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 animate-fadeIn"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-600"
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
                <div>
                  <h3 className="font-semibold text-gray-900">Save Money</h3>
                  <p className="text-sm text-gray-600">Up to 70% savings</p>
                </div>
              </div>

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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Eco Friendly</h3>
                  <p className="text-sm text-gray-600">Reduce emissions</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                <div>
                  <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">Verified users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Carpool Animation */}
          <div
            className="flex justify-center items-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-full max-w-lg">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
                {!animationError ? (
                  <Lottie
                    animationData={carpoolAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: "100%", height: "400px" }}
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
    </div>
  );
};

export default Landing;
