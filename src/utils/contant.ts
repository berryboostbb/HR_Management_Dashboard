import * as Yup from "yup";

export interface SidebarLink {
  name: string;
  path?: string;
  icon: string;
  children?: {
    name: string;
    path: string;
  }[];
}
export const defaultLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "material-symbols:dashboard-rounded",
  },
  {
    name: "Employees",
    icon: "material-symbols:manage-accounts-rounded",
    path: "/employees",
  },

  {
    name: "Attendance",
    icon: "clarity:employee-group-solid",
    path: "/attendance",
  },

  {
    name: "Leaves",
    path: "/leaves",
    icon: "material-symbols:holiday-village-rounded",
  },
  {
    name: "Events",
    path: "/events",
    icon: "bi:calendar2-event-fill",
  },
  {
    name: "Payroll",
    path: "/payroll",
    icon: "ph:scroll-fill",
  },
];

// Schema
export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
export const employeeSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  gender: Yup.string().required("Gender is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string().min(8).required("Password is required"),
  role: Yup.string().required("Role is required"),
  employeeType: Yup.string().required("Employee type is required"),
  image: Yup.string().required("Image is required"),
  department: Yup.string().required("Department is required"),
  DOB: Yup.mixed().required("Date of Birth is required"),
  joiningDate: Yup.mixed().required("Joining date is required"),
  employeeStatus: Yup.string().required("Employee Status is required"),

  // ✅ THIS IS THE KEY FIX
  leaveMultiSelect: Yup.array()
    .min(1, "At least one leave must be selected")
    .required("At least one leave must be selected"),
});

export const payrollSchema = Yup.object({
  employeeId: Yup.string().required("Employee ID is required"),
  employeeName: Yup.string().required("Employee Name is required"),
  position: Yup.string().required("Position Name is required"),
  month: Yup.string().required("Month is required"),
  year: Yup.number().required("Year is required"),
  approvedLeaves: Yup.number().required("Approved Leaves is required"),
  presentDays: Yup.number().required("Present Days is required"),
  basicSalary: Yup.number().required("Basic Salary is required"),
  totalWorkingDays: Yup.number().required("Total Working Days is required"),
  allowances: Yup.object({
    medical: Yup.number().required("Medical Allowance is required"),
    transport: Yup.number().required("Transport Allowance is required"),
    others: Yup.number().required("Other Allowance is required"),
  }),
  deductions: Yup.object({
    pf: Yup.number().required("PF is required"),
    loan: Yup.number().required("Loan is required"),
    advanceSalary: Yup.number().required("Advance Salary is required"),
    tax: Yup.number().required("Tax is required"),
    others: Yup.number().required("others deduction is required"),
  }),
});

export const EventSchema = Yup.object().shape({
  coverImage: Yup.string()
    .required("Cover image is required")
    .url("Cover image must be a valid URL"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Please select a valid date"),
  heading: Yup.string()
    .required("Heading is required")
    .min(5, "Heading must be at least 5 characters")
    .max(100, "Heading can't exceed 100 characters"),
  overview: Yup.string().required("Overview is required"),
  category: Yup.string().required("Category is required"),
});

export const LeaveSchema = Yup.object().shape({
  employeeId: Yup.string().required("Employee ID is required"),

  employeeName: Yup.string().required("Employee name is required"),

  leaveType: Yup.string().required("Leave type is required"),

  endDate: Yup.date().required("End date is required"),

  reason: Yup.string().required("Reason is required"),
});
