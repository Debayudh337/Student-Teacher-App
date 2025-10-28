import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getUserProfiles
} from '../models/profileModel.js';

import multer from 'multer';
import { bucket } from '../config/firebase.js'; // Add this
import fs from 'fs/promises'; // For async file ops
import path from 'path';

// Configure multer for file uploads
// Update storage to TEMP folder (we'll delete after upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'temp-uploads/'), // Temp!
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Keep this
});

// Create a new profile
export const createProfileHandler = async (req, res) => {
  try {
    const { userId, basicInfo, subjects, introduction, outcomes, markSheets, certificates, profileSummary } = req.body;
    const files = req.files || {};
    const profileImageFile = files.profileImage ? files.profileImage[0] : null;
    const documentFiles = files.documents || [];

    // Helper: Upload a single file to Storage and return URL
    const uploadToStorage = async (file, subfolder = '') => {
      if (!file) return null;
      const tempPath = file.path;
      const fileName = file.filename;
      const filePathInStorage = `${subfolder}${userId}/${fileName}`; // e.g., 'profiles/john/avatar-123.jpg'
      
      const storageFile = bucket.file(filePathInStorage);
      await bucket.upload(tempPath, {
        destination: filePathInStorage,
        metadata: { contentType: file.mimetype }
      });
      await storageFile.makePublic(); // Or use signed URLs for private
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePathInStorage}`;
      
      // Clean temp
      await fs.unlink(tempPath);
      return publicUrl;
    };

    // Upload files
    const profileImageUrl = await uploadToStorage(profileImageFile, 'profiles/');
    const documentUrls = await Promise.all(documentFiles.map(doc => uploadToStorage(doc, 'profiles/docs/')));

    const profileData = {
      userId,
      basicInfo: basicInfo || '{}',
      subjects: subjects || '[]',
      introduction,
      outcomes: outcomes || '[]',
      markSheets: markSheets || '[]',
      certificates: certificates || '[]',
      profileSummary,
      profileImage: profileImageUrl, // Now a URL!
      documents: documentUrls.filter(url => url), // Array of URLs
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const profileId = await createProfile(profileData); // Your model unchanged
    
    res.status(201).json({ success: true, message: 'Profile created successfully', profileId });
  } catch (error) {
    console.error('Error creating profile:', error);
    // Cleanup temps on error
    if (req.files) {
      const temps = [...(req.files.profileImage || []), ...(req.files.documents || [])].map(f => f.path);
      await Promise.all(temps.map(p => fs.unlink(p).catch(() => {})));
    }
    res.status(500).json({ success: false, message: 'Error creating profile', error: error.message });
  }
};

    

// Get a profile by ID
export const getProfileHandler = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await getProfile(profileId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting profile',
      error: error.message
    });
  }
};

// Update a profile
export const updateProfileHandler = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.userId; // ← FROM verifyToken MIDDLEWARE
    
    // 1. FIRST check if profile exists and belongs to user
    const existingProfile = await getProfile(profileId);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // 2. Verify ownership - CRITICAL SECURITY!
    if (existingProfile.userId !== userId) {
      return res.status(403).json({
        success: false, 
        message: 'You can only update your own profiles'
      });
    }

    const updates = {};
    
    // 3. Only include provided fields (partial updates)
    if (req.body.introduction) updates.introduction = req.body.introduction;
    if (req.body.profileSummary) updates.profileSummary = req.body.profileSummary;
    // Add other fields as needed
    
    // 4. Handle file uploads
    const files = req.files || {};
    if (files.profileImage) {
      updates.profileImage = files.profileImage[0].filename;
      
      // Optional: Delete old image file to save space
      if (existingProfile.profileImage) {
        const fs = await import('fs');
        const path = await import('path');
        const oldImagePath = path.join('uploads', existingProfile.profileImage);
        
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    if (files.documents) {
      updates.documents = [
        ...(existingProfile.documents || []),
        ...files.documents.map(doc => doc.filename)
      ];
    }
    
    updates.updatedAt = new Date();
    
    // 5. Now update the profile
    const success = await updateProfile(profileId, updates);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
// Delete a profile
export const deleteProfileHandler = async (req, res) => {
  try {
    const { profileId } = req.params;
    const success = await deleteProfile(profileId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

// Get all profiles for a user
export const getUserProfilesHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const profiles = await getUserProfiles(userId);
    
    res.status(200).json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('Error getting user profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profiles',
      error: error.message
    });
  }
};