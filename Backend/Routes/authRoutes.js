import express from 'express';
import { register, login, logout, resendOTP, requestPasswordReset, verifyPasswordResetOTP } from '../controller/authController.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { getUserData } from '../controller/userController.js';
import { verifyOTP } from '../controller/authController.js';



export const authRouter = express.Router();

// ========== Test Route ==========
authRouter.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// ========== Register ==========
authRouter.post('/register', register);

//============ResendOTP===========
authRouter.post('/resendOTP', resendOTP);

// ========== Login ==========
authRouter.post('/login', login);

// ========== Logout ==========
authRouter.post('/logout', logout);

//==========request for forgot password ============
authRouter.post('/request-password-reset',requestPasswordReset);

//==========verify otp for forgot password ============
authRouter.post('/verify-password-resetOTP',verifyPasswordResetOTP);

// ========== Get Profile (Protected) ==========
authRouter.get('/profile', verifyToken, getUserData);


authRouter.post('/verify-otp', verifyOTP);