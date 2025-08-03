import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate, Link } from 'react-router-dom'; 

const SignIn = () => {
  const navigate = useNavigate(); // Initialize navigate
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      phone: formData.get('phone'),
      password: formData.get('password')
    };
    
    console.log('Signing in with:', credentials);
    // Replace with actual authentication logic
    // alert(`Signing in with credentials`);
     navigate('/signup');

  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 px-8">
        {/* Title and subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-center mb-2 font-jakarta leading-[150%] text-[#FF3B30]">
            Welcome Back !!
          </h1>
          <p className="text-center text-[12px] font-roboto leading-4 tracking-[0.4px] text-black w-[203px] h-4 mx-auto">
            Please sign in to your account
          </p>
        </div>
        
        {/* AuthForm */}
        <AuthForm onSubmit={handleSubmit}>
          <AuthForm.PhoneInput />
          <AuthForm.PasswordInput />
          
          {/* Forgot Password Link */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => alert('Navigate to forgot password page')}
              className="font-inter text-base font-normal leading-[140%] text-black bg-transparent border-none cursor-pointer hover:underline"
            >
              Forgot Password ?
            </button>
          </div>
          
          <AuthForm.SubmitButton>Sign In</AuthForm.SubmitButton>
        </AuthForm>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <span className="font-inter text-base font-normal leading-[140%] text-black">
              Don't have an Account ? 
            </span>
            <Link
              to="/signup"
              className="font-inter text-base font-normal leading-[140%] text-[#42D4BC] bg-transparent border-none cursor-pointer ml-1 hover:underline"
              style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;