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
  gender: Yup.string().required("Gender is Required"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("phoneNumber is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  role: Yup.string().required("role is required"),

  employeeType: Yup.string().required("Employee role is required"),

  image: Yup.string().url("Invalid image URL").required("Image is required"),

  department: Yup.string().required("Department is required"),

  joiningDate: Yup.mixed().required("Joining date is required"),

  salaryStructure: Yup.object({
    basic: Yup.number().min(0).required("Basic salary is required"),

    incentive: Yup.object({
      flue: Yup.number().min(0).required(),
      medical: Yup.number().min(0).required(),
      others: Yup.number().min(0).required(),
      deductions: Yup.number().min(0).required(),
    }),

    tax: Yup.number().min(0).required("Tax is required"),
  }),

  loanPF: Yup.object({
    loan: Yup.number().min(0).required("Loan amount is required"),
    pf: Yup.number().min(0).required("PF amount is required"),
  }),

  DOB: Yup.mixed().required("Date of birth is required"),

  employeeStatus: Yup.string()
    .oneOf(["Active", "Inactive"])
    .required("Employee status is required"),
  leaveEntitlements: Yup.object({
    casualLeave: Yup.number().min(0).required(),
    sickLeave: Yup.number().min(0).required(),
    annualLeave: Yup.number().min(0).required(),
    maternityLeave: Yup.number().min(0).required(),
    paternityLeave: Yup.number().min(0).required(),
  }),
});

export const payrollSchema = Yup.object({
  employeeId: Yup.string().required("Employee ID is required"),
  employeeName: Yup.string().required("Employee Name is required"),
  month: Yup.string().required("Month is required"),
  year: Yup.number().required("Year is required"),
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

  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date"),

  endDate: Yup.date()
    .required("End date is required")
    .typeError("Invalid end date")
    .min(Yup.ref("startDate"), "End date cannot be before start date"),

  reason: Yup.string()
    .max(500, "Reason cannot exceed 500 characters")
    .nullable(),
});
