import { db } from '../config/firebase.js';

const profilesCollection = db.collection('profiles');

export const createProfile = async (profileData) => {
  try {
    const profileRef = await profilesCollection.add({
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return profileRef.id;
  } catch (error) {
    throw new Error('Error creating profile: ' + error.message);
  }
};

export const getProfile = async (profileId) => {
  try {
    const profileDoc = await profilesCollection.doc(profileId).get();
    if (!profileDoc.exists) {
      return null;
    }
    return { id: profileDoc.id, ...profileDoc.data() };
  } catch (error) {
    throw new Error('Error getting profile: ' + error.message);
  }
};

export const updateProfile = async (profileId, updateData) => {
  try {
    await profilesCollection.doc(profileId).update({
      ...updateData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    throw new Error('Error updating profile: ' + error.message);
  }
};

export const deleteProfile = async (profileId) => {
  try {
    await profilesCollection.doc(profileId).delete();
    return true;
  } catch (error) {
    throw new Error('Error deleting profile: ' + error.message);
  }
};

export const getUserProfiles = async (userId) => {
  try {
    const profilesSnapshot = await profilesCollection
      .where('userId', '==', userId)
      .get();
    
    const profiles = [];
    profilesSnapshot.forEach(doc => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles;
  } catch (error) {
    throw new Error('Error getting user profiles: ' + error.message);
  }
};