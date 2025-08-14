import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/wel.jpg'; // Import the welcome image

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started clicked');
    navigate('/option'); // Navigate to role selection page
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-4">
        
        {/* Welcome Image */}
        <div className="mb-8">
          <img 
            src={welcomeImage} 
            alt="Welcome - Teachers and Students"
            className="rounded-[24px]"
            style={{
              width: '312px',
              height: '545px',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* Get Started Button - Same style as submit button */}
        <div className="flex justify-center">
          <button
            onClick={handleGetStarted}
            className="w-[110px] h-[43px] bg-[#42D4BC] border-[3px] border-black rounded-[5px] shadow-md hover:bg-[#3bc4ac] focus:outline-none focus:ring-2 focus:ring-[#42D4BC] focus:ring-offset-2 transition-colors"
          >
            <span className="font-inter text-base font-normal leading-[140%] text-center text-black">
              Get Started
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;