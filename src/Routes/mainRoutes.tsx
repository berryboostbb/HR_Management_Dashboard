import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Events from "../pages/Events";
import PayrollDetails from "../pages/Payroll/payrollDetails";
import Employee from "../pages/Employee";
const DashBoard = lazy(() => import("../pages/Dashboard"));
const Leaves = lazy(() => import("../pages/Leaves"));
const Payroll = lazy(() => import("../pages/Payroll"));
const Salary = lazy(() => import("../pages/Salary"));
const Attendance = lazy(() => import("../pages/Attendance"));

export default function MainRoutes() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <p className="text-4xl font-medium">Loading-----</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/events" element={<Events />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/payroll/payrollDetails" element={<PayrollDetails />} />
        <Route path="/salary" element={<Salary />} />
      </Routes>
    </Suspense>
  );
}
