import React from 'react';
import StyledInput from '../UI/StyledInput';
import indianFlag from '../assets/Flag.png';

// AuthForm component with attached sub-components
const AuthForm = ({ children, onSubmit }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={onSubmit} className="space-y-6 flex flex-col items-center">
        {children}
      </form>
    </div>
  );
};

// Phone input with +91 prefix and Indian flag
AuthForm.PhoneInput = ({
  countryCode = "+91",
  name = "phone",
  placeholder = "Phone number",
  required = true
}) => (
 <div className="mb-6">
    <StyledInput>
      {/* Indian Flag Image */}
      <div className="w-14 h-[55px] ml-2 flex items-center justify-center">
        <img 
          src={indianFlag} 
          alt="Indian Flag"
          className="w-14 h-[55px] object-cover"
          style={{
            width: '56px',
            height: '55px'
          }}
        />
      </div>
      
      {/* Country Code */}
      <span className="text-gray-700 font-medium px-2">
        {countryCode}
      </span>
      
      {/* Phone Input */}
      <input
        type="tel"
        name={name}
        className="flex-1 h-full bg-transparent border-none outline-none px-2 text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        required={required}
      />
    </StyledInput>
  </div>
);

// Password input
AuthForm.PasswordInput = ({
  name = "password",
  placeholder = "Password",
  required = true
}) => (
  <div className="mb-6">
    <StyledInput>
      <input
        type="password"
        name={name}
        className="flex-1 h-full bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        required={required}
      />
      {/* Eye icon for password visibility toggle */}
      <div className="w-6 h-6 mr-4 text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    </StyledInput>
  </div>
);

// Email Input
AuthForm.EmailInput = ({
  name = "email",
  placeholder = "Email Address",
  required = true
}) => (
  <div className="mb-6">
    <StyledInput>
      <input
        type="email"
        name={name}
        className="flex-1 h-full bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        required={required}
      />
    </StyledInput>
  </div>
);

// Regular input component
AuthForm.Input = ({ 
  name, 
  placeholder, 
  type = "text",
  required = true 
}) => (
  <div className="mb-6">
    <StyledInput>
      <input
        type={type}
        name={name}
        className="flex-1 h-full bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        required={required}
      />
    </StyledInput>
  </div>
);

// Submit button
AuthForm.SubmitButton = ({ children }) => (
  <div className="flex justify-center mb-6">
    <button
      type="submit"
      className="w-[110px] h-[43px] bg-[#42D4BC] border-[3px] border-black rounded-[5px] shadow-md hover:bg-[#3bc4ac] focus:outline-none focus:ring-2 focus:ring-[#42D4BC] focus:ring-offset-2 transition-colors"
    >
      <span className="font-inter text-base font-normal leading-[140%] text-center text-black">
        {children}
      </span>
    </button>
  </div>
);

export default AuthForm;