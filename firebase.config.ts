// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS6Gd6vlWsfho5424tgu6yX7PpUpwKzOY",
  authDomain: "uservalidation-13295.firebaseapp.com",
  projectId: "uservalidation-13295",
  storageBucket: "uservalidation-13295.appspot.com",
  messagingSenderId: "1064063657406",
  appId: "1:1064063657406:web:568108ee096a7f7a7885ef",
  measurementId: "G-4TXRTRB3J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize Auth

let analytics;
if (typeof window !== "undefined") { // Check if window is available
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);  // Initialize Analytics
    }
  });
}

// Export the initialized instances
export { app, auth, analytics };
