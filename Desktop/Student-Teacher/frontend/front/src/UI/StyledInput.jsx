import React from 'react';

const StyledInput = ({ 
  children, 
  className = "", 
  style = {},
  ...props 
}) => {
  const baseStyle = {
    boxShadow: '0px 4px 4px 0px #00000040'
  };

  const combinedStyle = { ...baseStyle, ...style };

  return (
    <div 
      className={`relative w-[311px] h-[57px] bg-white border border-black rounded-[18px] flex items-center ${className}`}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default StyledInput;