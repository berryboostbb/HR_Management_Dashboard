// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC5t9alZgGw4-IQrsBInVj_5Wj6HVk3rgA",
  authDomain: "hr-mamangement.firebaseapp.com",
  projectId: "hr-mamangement",
  storageBucket: "hr-mamangement.appspot.com",
  messagingSenderId: "469059695994",
  appId: "1:469059695994:web:0d54345267bcba884dd2c3",
});

const messaging = firebase.messaging();
