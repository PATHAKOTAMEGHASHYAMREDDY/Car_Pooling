import React from 'react';
import Lottie from 'lottie-react';
import carLoaderAnimation from '../assets/CarLoader.json';

const CarLoader = ({ 
  size = 200, 
  showText = true, 
  text = "Loading...", 
  className = "",
  loop = false,
  autoplay = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <Lottie 
          animationData={carLoaderAnimation}
          loop={loop}
          autoplay={autoplay}
          style={{ 
            width: '100%', 
            height: '100%' 
          }}
        />
      </div>
      {showText && (
        <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default CarLoader;