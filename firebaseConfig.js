// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfkdpvrvlcl3i0OqUNFuj_mQYUXEIgh6U",
  authDomain: "games4gaza-272e1.firebaseapp.com",
  projectId: "games4gaza-272e1",
  storageBucket: "games4gaza-272e1.firebasestorage.app",
  messagingSenderId: "740694807694",
  appId: "1:740694807694:web:4d4dedf1f66ecfebcd65df",
  measurementId: "G-YNN3B4FB0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };