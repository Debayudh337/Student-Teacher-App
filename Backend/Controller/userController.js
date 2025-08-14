import { db } from '../firebase.js';

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId; 

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.json({ success: false, message: "No user found" });
    }

    const userData = userDoc.data();

    return res.json({
      success: true,
      userData: {
        name: userData.name,
        isVerified: userData.isVerified
      }
    });

  } catch (error) {
    console.error("Error getting user:", error);
    return res.json({ success: false, message: "Error fetching user data" });
  }
};
