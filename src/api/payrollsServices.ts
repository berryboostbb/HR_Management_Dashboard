import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const generatePayroll = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.GENERATE_PAYROLL, values);
};

export const approvePayroll = (id: string, values: { approvedBy: string }) => {
  return HTTP_CLIENT.put(
    `${ENDPOINTS.APPROVE_PAYROLL.replace(":id", id)}`,
    values
  );
};

export const getAllPayrolls = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_ALL_PAYROLLS);
};

export const getEmployeePayrolls = (employeeId: string) => {
  return HTTP_CLIENT.get(
    ENDPOINTS.GET_EMPLOYEE_PAYROLLS.replace(":employeeId", employeeId)
  );
};

export const generateSalarySlip = (id: string) => {
  return HTTP_CLIENT.post(ENDPOINTS.GENERATE_SALARY_SLIP.replace(":id", id));
};

export const downloadSalarySlip = (id: string) => {
  const url = ENDPOINTS.DOWNLOAD_SALARY_SLIP.replace(":id", id);
  window.open(url, "_blank");
};
