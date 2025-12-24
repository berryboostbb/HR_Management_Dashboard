import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const getAllAttendance = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_GETALL);
};
export const updateAttendance = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_APPROVE}/${id}`, values);
};
