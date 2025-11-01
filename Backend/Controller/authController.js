import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


import { sendMail } from '../utils/sendMail.js';
import {
  storeTempUser,
  getTempUser,
  updateTempUser,
  deleteTempUser,
} from '../models/redisTempModel.js';

import {
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
} from '../models/userModel.js';

// ========== REGISTER ==========
export const register = async (req, res) => {
  const { name, email, password, phone_number, role } = req.body;

  if (!name || !email || !password) {
    return res.send({ success: false, message: "Incomplete details" });
  }

  try {
    // Check if user already exists in Firestore
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.send({ success: false, message: 'User already exists' });
    }

    // Generate OTP and hash password
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store temporary user in Redis
    const tempUser = {
      name,
      email,
      password: hashedPassword,
      phone_number: phone_number || '',
      role: role || 'Student/Parent',
      otp,
    };

    await storeTempUser(tempUser);
    //print the otp
    console.log('📧 OTP for', email, ':', otp);
    console.log('💡 Use this OTP for verification');

    // Send OTP via email
    await sendMail(
      email,
      'OTP for Student App Registration',
      `<p>Hello <b>${name}</b>,</p>
       <p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`
    );

    return res.send({ success: true, message: "OTP sent to email" });

  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

// ========== VERIFY OTP ==========
export const verifyOTP = async (req, res) => {
  const { email, otp: enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    return res.json({ success: false, message: "Email and OTP required" });
  }

  try {
    const tempUser = await getTempUser(email);

    if (!tempUser) {
      return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (tempUser.otp !== enteredOtp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const newUser = {
      name: tempUser.name,
      email: tempUser.email,
      phone_number: tempUser.phone_number,
      password: tempUser.password,
      role: tempUser.role,
      isVerified: true,
      createdAt: new Date(),
    };

    const userId = await createUser(newUser);

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await deleteTempUser(email);

    return res.json({ success: true, message: "User verified and registered" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ========== RESEND OTP ==========
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const tempUser = await getTempUser(email);

    if (!tempUser) {
      return res.json({
        success: false,
        message: "No registration data found. Please sign up again.",
      });
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    tempUser.otp = newOtp;

    await updateTempUser(email, tempUser);

    await sendMail(
      email,
      'Resent OTP for Student App Registration',
      `<p>Hello <b>${tempUser.name}</b>,</p>
       <p>Your new OTP is <b>${newOtp}</b>. It expires in 15 minutes.</p>`
    );

    return res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.send({ success: false, message: "Email is required" });
  }

  try {
    // Check if user exists
    const user = await findByEmail(email);
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in Redis (just store OTP at this stage)
    await storeTempUser({
      email,
      otp,
      type: "password_reset" // So we know this is not registration OTP
    });

    // Send OTP email
    await sendMail(
      email,
      'Password Reset OTP',
      `<p>Hello,</p>
       <p>Your OTP to reset password is <b>${otp}</b>. It expires in 15 minutes.</p>`
    );

    return res.send({ success: true, message: "OTP sent to email" });

  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};


// ========== VERIFY PASSWORD RESET OTP ==========
export const verifyPasswordResetOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.send({ success: false, message: "All fields are required" });
  }

  try {
    // Get stored OTP from Redis
    const tempData = await getTempUser(email);
    if (!tempData || tempData.type !== "password_reset") {
      return res.send({ success: false, message: "No reset request found or expired" });
    }

    // Check OTP
    if (tempData.otp !== otp) {
      return res.send({ success: false, message: "Invalid OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update Firestore user password
    await updateUser(email, { password: hashedPassword });

    // Delete temp entry
    await deleteTempUser(email);

    return res.send({ success: true, message: "Password reset successfully" });

  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};



// ========== LOGIN ==========
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email or password missing" });
  }

  try {
    const user = await findByEmail(email); // ✅ Correct name

    if (!user) {
      return res.json({ success: false, message: "Incorrect email" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged in successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// ========== LOGOUT ==========
export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: "Logged out successfully" });
};
