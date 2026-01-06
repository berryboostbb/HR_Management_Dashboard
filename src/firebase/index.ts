import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC5t9alZgGw4-IQrsBInVj_5Wj6HVk3rgA",
  authDomain: "hr-mamangement.firebaseapp.com",
  projectId: "hr-mamangement",
  storageBucket: "hr-mamangement.firebasestorage.app",
  messagingSenderId: "469059695994",
  appId: "1:469059695994:web:0d54345267bcba884dd2c3",
  measurementId: "G-0THRPFQ144",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
