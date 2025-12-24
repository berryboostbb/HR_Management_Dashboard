export const BASE_URL = "http://localhost:5001";

export const ENDPOINTS = {
  //   -----------Accounts-------------
  ACCOUNTS_LOGIN: "/admin/login",
  ACCOUNTS_LOGOUT: "/admin/logoutAdmin",
  ACCOUNTS_GETALL: "/admin/getAllAdmins",
  ACCOUNTS_UPDATE: "/admin/updateAdmin",
  ACCOUNTS_DELETE: "/admin/deleteAdmin",
  ACCOUNTS_ADD: "/admin/register",

  //   ---------------Attendance----------
  ATTENDANCE_GETALL: "/attendance/getAllAttendance",
  ATTENDANCE_UPDATE: "/attendance/UpdateAttendance",
  //   -----------UploadFIle-------------
  UPLOAD_FILE: "/upload/uploadFile",

  //   -----------Leaves-------------
  LEAVES_GET_ALL: "/leave/getAllLeaves",
  LEAVES_APPROVE: "/leave/updateLeaveStatus",

  //   -----------GENERATE_PAYROLL-------------

  GENERATE_PAYROLL: "/payroll/generatePayroll",
  APPROVE_PAYROLL: "/payroll/approve/:id",
  GET_ALL_PAYROLLS: "/payroll/getAllPayrolls",
  GET_EMPLOYEE_PAYROLLS: "/payroll/employee/:id",
  GENERATE_SALARY_SLIP: "/payroll/generateSalarySlip/:id",
  DOWNLOAD_SALARY_SLIP: "/payroll/salarySlip/:id",
};
