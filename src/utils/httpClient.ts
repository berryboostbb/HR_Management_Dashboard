// utils/axiosConfig.ts
import axios from "axios";
import { store } from "../redux/store";
import { setIsLoggedIn } from "../redux/userSlice";
import { notifyError } from "../Components/Toast";
import { BASE_URL } from "../api/endPoints";

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
});

let isSessionExpiredHandled = false;

export const setupInterceptors = (navigate: (path: string) => void) => {
  // REQUEST INTERCEPTOR
  HTTP_CLIENT.interceptors.request.use(
    (config) => {
      const token = store.getState().user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // automatically add token
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  HTTP_CLIENT.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401 && !isSessionExpiredHandled) {
        isSessionExpiredHandled = true;

        // Logout user
        store.dispatch(setIsLoggedIn(false));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        notifyError("Your session has expired. Please log in again.");
        navigate("/"); // redirect to login

        setTimeout(() => {
          isSessionExpiredHandled = false;
        }, 2000);
      }

      if (status === 403) {
        notifyError("You do not have permission to perform this action.");
      }

      if (status === 500) {
        notifyError("Server error — please try again later.");
      }

      return Promise.reject(error);
    }
  );
};
