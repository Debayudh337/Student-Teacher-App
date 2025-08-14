import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Default to "your mobile phone" if no phone number passed
 const { email, phoneNumber } = state || {};
  const contactMethod = email || phoneNumber || 'your registered contact method';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length === 4) {
      console.log('Entered OTP:', enteredOtp, 'for', email);

      try {
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email,
          otp: enteredOtp
        }, { withCredentials: true });

        if (response.data.success) {
          alert(response.data.message);
          navigate('/dashboard');  // On success
        } else {
          alert(response.data.message);
        }

      } catch (error) {
        console.error('OTP Verification Error:', error);
        alert('Something went wrong, please try again.');
      }

    } else {
      alert('Please enter complete OTP');
    }
  };

const handleResendOtp = async () => {
  console.log('Resending OTP to', email);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/resendOTP', {
      email
    }, { withCredentials: true });

    if (response.data.success) {
      alert(response.data.message);  // OTP resent successfully
      // Reset OTP fields
      setOtp(['', '', '', '']);
      setTimeLeft(60);
      // Focus first input after resend
      setTimeout(() => {
        const firstInput = document.getElementById('otp-input-0');
        if (firstInput) firstInput.focus();
      }, 100);  // Small delay to ensure inputs are mounted
    } else {
      alert(response.data.message);
    }

  } catch (error) {
    console.error('Resend OTP Error:', error);
    alert('Failed to resend OTP. Please try again.');
  }
};


  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-center  px-8">
        
        {/* Title and subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-[18px] font-normal text-center mb-4 font-inter leading-[140%] text-black">
           We have sent OTP to {contactMethod}
          </h1>
          <p className="text-center text-[18px] font-inter leading-[140%] text-black">
            OTP will expire in {timeLeft}s
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-8">
          {/* OTP Input Boxes */}
          <div className="flex justify-center space-x-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[49px] h-[34px] text-xl text-center bg-white border-[3px] border-black rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#42D4BC] transition-colors"
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            ))}
          </div>

          {/* Validate OTP Button - Same style as submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[110px] h-[43px] bg-[#42D4BC] border-[3px] border-black rounded-[5px] shadow-md hover:bg-[#3bc4ac] focus:outline-none focus:ring-2 focus:ring-[#42D4BC] focus:ring-offset-2 transition-colors"
              disabled={otp.some(digit => digit === '')}
            >
              <span className="font-inter text-base font-normal leading-[140%] text-center text-black">
                Validate OTP
              </span>
            </button>
          </div>
        </form>

        {/* Resend OTP Link */}
        <div className="mt-8 text-center">
          <button
            onClick={handleResendOtp}
            disabled={timeLeft > 0}
            className={`font-inter text-base font-normal leading-[140%] bg-transparent border-none cursor-pointer hover:underline ${
              timeLeft > 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-black'
            }`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;