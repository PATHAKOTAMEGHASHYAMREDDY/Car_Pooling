import React, { useState, useEffect } from 'react';
import CarLoader from './CarLoader';

const DashboardLoader = ({ 
  isLoading, 
  onLoadingComplete, 
  userType = "user",
  minDisplayTime = 2000 // Minimum time to show loader (2 seconds)
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [fadeOut, setFadeOut] = useState(false);

  const getLoadingText = () => {
    switch (userType) {
      case "CAR_OWNER":
        return "Loading your car owner dashboard...";
      case "ADMIN":
        return "Loading admin dashboard...";
      case "PASSENGER":
      default:
        return "Loading your dashboard...";
    }
  };

  const getWelcomeText = () => {
    switch (userType) {
      case "CAR_OWNER":
        return "Welcome to Driver Portal";
      case "ADMIN":
        return "Welcome to Admin Portal";
      case "PASSENGER":
      default:
        return "Welcome to RideShare";
    }
  };

  useEffect(() => {
    let timeoutId;
    
    if (!isLoading) {
      // Start fade out after minimum display time
      timeoutId = setTimeout(() => {
        setFadeOut(true);
        // Hide completely after fade animation
        setTimeout(() => {
          setShowLoader(false);
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 500);
      }, minDisplayTime);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, minDisplayTime, onLoadingComplete]);

  if (!showLoader) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center">


        {/* Lottie Animation - Seamless Integration */}
        <div className="relative mx-auto mb-6 animate-slideIn">
          <CarLoader 
            size={280}
            text=""
            showText={false}
            className=""
          />
        </div>


        

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes single-progress {
          0% { 
            width: 0%; 
          }
          100% { 
            width: 100%; 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 1s ease-out 0.3s both;
        }
        
        .animate-single-progress {
          animation: single-progress 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardLoader;