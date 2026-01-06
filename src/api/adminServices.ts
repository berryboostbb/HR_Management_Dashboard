import { HTTP_CLIENT } from "../utils/httpClient";
import { getFCMToken } from "../utils/notifications";
import { ENDPOINTS } from "./endPoints";

export const adminLogin = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const fcmToken = await getFCMToken();
    console.log("🚀 ~ adminLogin ~ fcmToken:", fcmToken);

    const response = await HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGIN, {
      ...values,
      fcmToken,
    });

    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const adminLogout = () => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGOUT);
};
export const addAccount = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_ADD, values);
};

export const getAllAccounts = (search?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_GETALL, {
    params: search ? { search } : {},
  });
};
export const getBirthday = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_BIRTHDAY);
};
export const getRole = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_ROLE);
};
export const updateAccount = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.ACCOUNTS_UPDATE}/${id}`, values);
};

export const deleteAccount = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.ACCOUNTS_DELETE}/${id}`);
};

export const updatePassword = (id: string, values: { password: string }) => {
  return HTTP_CLIENT.patch(
    `${ENDPOINTS.ACCOUNTS_UPDATEPASSWORD}/${id}`,
    values
  );
};
