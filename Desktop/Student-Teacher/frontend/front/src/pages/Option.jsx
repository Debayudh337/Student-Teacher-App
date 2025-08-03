import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoleCard from '../components/RoleCard';

const Option = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Store selected role in localStorage for later use
    localStorage.setItem('userRole', role);
    console.log('Role selected:', role);
    // Navigate to sign-in page when a role is selected
    navigate('/signin');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Title with red color and custom styling */}
      <h1 className="text-2xl font-bold text-[#FF3B30] mb-12 text-center  px-4 py-2 font-jakarta">
        Who am I?
      </h1>
      
      {/* Role cards container with vertical spacing */}
      <div className="flex flex-col gap-8">
        <RoleCard 
          title="Student / Parent" 
          onClick={() => handleRoleSelect('student')}
        />
        <RoleCard 
          title="Teacher" 
          onClick={() => handleRoleSelect('teacher')}
        />
      </div>
    </div>
  );
};

export default Option;