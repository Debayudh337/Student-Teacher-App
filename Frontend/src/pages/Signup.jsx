import React from "react";
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm'; 

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formValues = {
      name: formData.get('fullName'),
      phone_number: formData.get('phone'),
      password: formData.get('password'),
      email: formData.get('email'),
      role: localStorage.getItem('userRole') || 'Student/Parent'  
    };
    
    console.log('Sign up form data:', formValues);

    try {
     
      const response = await axios.post('http://localhost:5000/api/auth/register', formValues, {
        withCredentials: true // cross-origin and using cookies
      });

      console.log(response.data);

      if (response.data.success) {
        // Navigate to OTP page with email and phone
        navigate('/otp', {
          state: {
            email: formValues.email,
            phone: formValues.phone_number
          }
        });
      } else {
        alert(response.data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong! Try again.');
    } 
  };


  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 px-8">
        {/* Title and subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-center mb-2 font-jakarta leading-[150%] text-[#FF3B30]">
            Create new account
          </h1>
          <p className="text-center text-[12px] font-roboto leading-4 tracking-[0.4px] text-black w-[203px] h-4 mx-auto">
            Please fill the form to continue
          </p>
        </div>
        
        {/* AuthForm */}
        <AuthForm onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <AuthForm.Input 
            name="fullName"
            placeholder="Full Name"
            type="text"
            required={true}
          />
          
          {/* Phone Input */}
          <AuthForm.PhoneInput />
          
          {/* Email Input */}
          <AuthForm.EmailInput />
          
          {/* Password Input */}
          <AuthForm.PasswordInput />
          
          {/* Submit Button */}
          <AuthForm.SubmitButton>Sign Up</AuthForm.SubmitButton>
        </AuthForm>
        
        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <span className="font-inter text-base font-normal leading-[140%] text-black">
              Already have an Account ? 
            </span>
            <button
              onClick={() => navigate('/signin')}
              className="font-inter text-base font-normal leading-[140%] text-[#42D4BC] bg-transparent border-none cursor-pointer ml-1 hover:underline"
              style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;