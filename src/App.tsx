import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import Routes from "./Routes";
import { useSelector } from "react-redux";
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";

// import { useNavigate } from "react-router-dom";
// import { setupInterceptors } from "./utils/httpClient";

function App() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="bg-red-600 text-sm md:text-base text-white text-center py-2 fixed top-0 w-full z-[9999]">
          ⚠️ Internet connection lost. Please check your network.
        </div>
      )}

      <div>
        {/* <AuthRoutes /> */}

        <Routes />
      </div>
    </>
  );
}

export default App;
