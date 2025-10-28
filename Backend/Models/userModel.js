import { db } from "../config/firebase.js";

const userCollection = db.collection('users'); // ✅ Fixed string literal

export const findByEmail = async (email) => {  // ✅ Renamed for consistency
  const existingUser = await userCollection.where('email', '==', email).limit(1).get();
  if (existingUser.empty) return null;

  const doc = existingUser.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const createUser = async (userData) => {
  const userRef = await userCollection.add({
    ...userData,
    createdAt: new Date(),
  });
  return userRef.id;
};

export const updateUser = async (userId, data) => {
  await userCollection.doc(userId).update(data);
  return true;
};

export const deleteUser = async (userId) => {
  await userCollection.doc(userId).delete();
  return true;
};
