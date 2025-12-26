import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const getAllLeaves = (search?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.LEAVES_GET_ALL, {
    params: search ? { search } : {},
  });
};
export const updateLeavesStatus = (
  id: string,
  values: { status: string; approvedBy: string }
) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_APPROVE}/${id}`, values);
};
