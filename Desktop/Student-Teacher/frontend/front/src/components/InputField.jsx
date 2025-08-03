import React from 'react';
const InputField = ({ type = "text", name, placeholder, className = "", required = false }) => (
  <div className={`mb-4 ${className}`}>
    <input
      type={type}
      name={name}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      placeholder={placeholder}
      required={required}
    />
  </div>
);
export default InputField;
