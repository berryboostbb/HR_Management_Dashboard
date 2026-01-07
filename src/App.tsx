import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import Routes from "./Routes";
import { setupInterceptors } from "./utils/httpClient";
import { useNavigate } from "react-router-dom";

function App() {
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();
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
  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 w-full py-2 text-sm text-center text-white bg-red-600 md:text-base z-9999">
          ⚠️ Internet connection lost. Please check your network.
        </div>
      )}

      <div>
        <Routes />
      </div>
    </>
  );
}

export default App;
