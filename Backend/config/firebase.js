
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'student-techer-app.appspot.com'
});

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
