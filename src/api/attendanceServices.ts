import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const getAllAttendance = (search?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_GETALL, {
    params: search ? { search } : {},
  });
};

export const updateAttendance = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_APPROVE}/${id}`, values);
};
