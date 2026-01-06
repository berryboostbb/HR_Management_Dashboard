import { getToken } from "firebase/messaging";
import { messaging } from "../firebase"; // corrected import

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);
    if (permission !== "granted") return null;

    // register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey:
        "BEGrhMnGLc3lc_74BpAjFF945tfrkKrdBQGZq3lYLVIpzKvSJJ4fXCszT3CIaQzI26qSnj-TcsuVsW6FwHRPLOs", // from Firebase console
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);
    return token;
  } catch (error) {
    console.error("FCM error:", error);
    return null;
  }
};
