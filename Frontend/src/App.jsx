import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Option from './pages/Option';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Welcome from './pages/Welcome';

 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/option" element={<Option />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
