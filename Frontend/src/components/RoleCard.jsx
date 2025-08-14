import React from 'react'

const RoleCard = ({ title, onClick }) => {
  return (
   <button
      onClick={onClick}
      className="w-72 h-11 bg-white rounded-[18px] border border-black flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      style={{ boxShadow: '0px 4px 4px 0px #00000040' }}
    >
      <span className="text-2xl font-semibold text-center tracking-tight text-black font-inter leading-tight">
        {title}
      </span>
    </button>
  );
};

export default RoleCard;