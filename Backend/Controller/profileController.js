import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getUserProfiles
} from '../models/profileModel.js';

import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create a new profile
export const createProfileHandler = async (req, res) => {
  try {
    const {
      userId,
      basicInfo,
      subjects,
      introduction,
      outcomes,
      markSheets,
      certificates,
      profileSummary
    } = req.body;

    // Handle file uploads
    const files = req.files || {};
    const profileImage = files.profileImage ? files.profileImage[0] : null;
    const documents = files.documents || [];

    const profileData = {
      userId,
      basicInfo: JSON.parse(basicInfo || '{}'),
      subjects: JSON.parse(subjects || '[]'),
      introduction,
      outcomes: JSON.parse(outcomes || '[]'),
      markSheets: JSON.parse(markSheets || '[]'),
      certificates: JSON.parse(certificates || '[]'),
      profileSummary,
      profileImage: profileImage ? profileImage.filename : null,
      documents: documents.map(doc => doc.filename),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const profileId = await createProfile(profileData);
    
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profileId
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating profile',
      error: error.message
    });
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
    const updates = req.body;
    
    // Handle file uploads if any
    const files = req.files || {};
    if (files.profileImage) {
      updates.profileImage = files.profileImage[0].filename;
    }
    if (files.documents) {
      updates.documents = files.documents.map(doc => doc.filename);
    }
    
    updates.updatedAt = new Date();
    
    const success = await updateProfile(profileId, updates);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
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