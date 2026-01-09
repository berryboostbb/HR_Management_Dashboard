export const BASE_URL = "http://localhost:5001";
// export const BASE_URL =
//   "https://hr-management-backend-85d6dc3117a3.herokuapp.com";

export const ENDPOINTS = {
  //   -----------Accounts-------------

  ACCOUNTS_LOGIN: "/auth/login",
  ACCOUNTS_LOGOUT: "/auth/logout",
  ACCOUNTS_GETALL: "/auth/getAllUsers",
  ACCOUNTS_UPDATE: "/auth/updateUser",
  ACCOUNTS_DELETE: "/auth/deleteUser",
  ACCOUNTS_ADD: "/auth/register",
  ACCOUNTS_BIRTHDAY: "/auth/birthdays",
  ACCOUNTS_ROLE: "/auth/getRoles",
  ACCOUNTS_UPDATEPASSWORD: "/auth/updatePassword",

  //   ---------------Attendance----------

  ATTENDANCE_GETALL: "/attendance/getAllAttendance",
  ATTENDANCE_UPDATE: "/attendance/UpdateAttendance",
  ATTENDANCE_SUMMARY: "/attendance/getAttendanceSummary",
  ATTENDANCE_UpdateAttendanceAdmin: "/attendance/updateAttendanceAdmin",
  ATTENDANCE_DAILYATTENDENCE: "/attendance/createDailyAttendance",
  ATTENDANCE_GETATTENDANCEGRAPH: "/attendance/getMonthlyAttendanceGraph",
  ATTENDANCE_UPDATECOMPANYTIMING: "/attendance/setCompanyTiming",
  ATTENDANCE_COMPANYTIMING: "/attendance/getCompanyTiming",

  //   -----------UploadFIle-------------

  UPLOAD_FILE: "/upload/uploadFile",

  //   -----------Leaves-------------
  LEAVES_UPDATE: "/leave/updateLeave",
  LEAVES_DELETE: "/leave/deleteLeave",
  LEAVES_APPLY: "/leave/apply",
  LEAVES_GET_ALL: "/leave/getAllLeaves",
  LEAVES_APPROVE: "/leave/updateLeaveStatus",

  //   -----------GENERATE_PAYROLL-------------

  GENERATE_PAYROLL: "/payroll/generatePayroll",
  APPROVE_PAYROLL: "/payroll/approve/:id",
  UPDATE_PAYROLL: "/payroll/updatePayroll",
  GET_ALL_PAYROLLS: "/payroll/getAllPayrolls",
  GET_EMPLOYEE_PAYROLLS: "/payroll/employee",
  GENERATE_SALARY_SLIP: "/payroll/generateSalarySlip",
  DOWNLOAD_SALARY_SLIP: "/payroll/salarySlip",

  //   -----------Leaves-------------

  EVENTS_CREATE: "/events/createEvent",
  EVENTS_GET_ALL: "/events/getAllEvents",
  EVENTS_GET_SINGLE: "/events/getEventById",
  EVENTS_UPDATE: "/events/updateEvent",
  EVENTS_DELETE: "/events/deleteEvent",
};
