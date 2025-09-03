import express from 'express';
import { register, login, logout, resendOTP, requestPasswordReset, verifyPasswordResetOTP } from '../controller/authController.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { getUserData } from '../controller/userController.js';
import { verifyOTP } from '../controller/authController.js';

const router = express.Router();

// ========== Test Route ==========
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// ========== Register ==========
router.post('/register', register);

// =========== Resend OTP ===========
router.post('/resend-otp', resendOTP); // Changed to lowercase

// ========== Login ==========
router.post('/login', login);

// ========== Logout ==========
router.post('/logout', logout);

// ========== Request for forgot password ============
router.post('/request-password-reset', requestPasswordReset);

// ========== Verify OTP for forgot password ============
router.post('/verify-password-reset-otp', verifyPasswordResetOTP); // FIXED: Changed to lowercase

// ========== Get Profile (Protected) ==========
router.get('/profile', verifyToken, getUserData);

// ========== Verify OTP ==========
router.post('/verify-otp', verifyOTP);

export default router;