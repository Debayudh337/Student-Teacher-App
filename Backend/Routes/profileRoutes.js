import express from 'express';
import {
  createProfileHandler,
  getProfileHandler,
  updateProfileHandler,
  deleteProfileHandler,
  getUserProfilesHandler,
  upload
} from '../controller/profileController.js';
import { verifyToken } from '../middlewares/verifytoken.js';

const router = express.Router();

// Apply token verification to all profile routes
router.use(verifyToken);

// Create a new profile with file upload support
router.post('/', 
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]), 
  createProfileHandler
);

// Get a specific profile - FIXED: Changed to :profileId
router.get('/:profileId', getProfileHandler);

// Update a profile with file upload support - FIXED: Changed to :profileId
router.put('/:profileId', 
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]), 
  updateProfileHandler
);

// Get all profiles for a user
router.get('/user/:id', getUserProfilesHandler);

// Delete a profile
router.delete('/:id', deleteProfileHandler);

export default router;