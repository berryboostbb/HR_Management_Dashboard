import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "../../api/adminServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface EmployeeData {
  _id: string;
  employeeId: string;
  image: string;
  name: string;
  DOB: string;
  gender: string;
  phoneNumber: string;
  email: string;
  position: string;
  employeeStatus: string;
  employeeType: string;
  joiningDate: string;
  department: string;
  salaryStructure: {
    basic: number;
    gross: number;
    tax: number;
    incentive: {
      flue: number;
      medical: number;
      others: number;
    };
  };
  loanPF: {
    loan: number;
    pf: number;
  };
  leaveEntitlements?: {
    annualLeave?: { total: number; consumed: number };
    casualLeave?: { total: number; consumed: number };
    maternityLeave?: { total: number; consumed: number };
    paternityLeave?: { total: number; consumed: number };
    sickLeave?: { total: number; consumed: number };
  };
}

export default function EmployeeDetails() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { rowData } = (location.state as { rowData: EmployeeData }) || {};

  if (!rowData) {
    // Data not yet available, or page accessed directly
    return <p>Loading employee data...</p>;
  }

  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      await updatePassword(rowData._id, { password });
      notifySuccess("Password updated successfully!");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      notifyError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Default leaveEntitlements to prevent crashes
  const leaveEntitlements = rowData.leaveEntitlements || {
    annualLeave: { consumed: 0, total: 0 },
    casualLeave: { consumed: 0, total: 0 },
    maternityLeave: { consumed: 0, total: 0 },
    paternityLeave: { consumed: 0, total: 0 },
    sickLeave: { consumed: 0, total: 0 },
  };

  return (
    <>
      <div className="bg-[#F7F7F7] h-[calc(100vh-110px)] rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div
            onClick={() => navigate("/employees")}
            className="h-11 w-11 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <FaArrowLeft size={16} />
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-white rounded-xl shadow-md p-4 flex-1 overflow-y-auto"
        >
          <div className="bg-white rounded-xl border border-[#8FB1FF] p-4 flex-1">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="h-24 p-4 w-24 rounded-full bg-[#E5EBF7] flex items-center justify-center">
                <img
                  src={rowData.image}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>

              <div className="flex items-center justify-between w-full gap-8 md:w-auto">
                <div>
                  <h3 className="text-[14px] font-semibold">{rowData.name}</h3>
                  <p className="text-[#0755E9] text-[12px]">
                    {rowData.employeeId}
                  </p>
                </div>
              </div>
            </div>
            <h4 className="text-[16px]  mb-3">Personal Information</h4>
            <div className="grid grid-cols-4 gap-6 mt-5">
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">DOB:</p>
                <p className="text-[#131313] font-medium">
                  {dayjs(rowData.DOB).format("DD-MM-YYYY")}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">Gender:</p>
                <p className="text-[#131313] font-medium">{rowData.gender}</p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Phone Number:</p>
                <p className="text-[#131313] font-medium">
                  {rowData.phoneNumber}
                </p>
              </div>

              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Email:</p>
                <p className="text-[#131313] font-medium">{rowData.email}</p>
              </div>
            </div>

            <h4 className="text-[16px] mb-3 mt-1">Employee Detail</h4>
            <div className="grid grid-cols-4 gap-6 mt-5 md:grid-cols-4">
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">
                  {" "}
                  Emplolyee Status:
                </p>
                <p className="text-[#131313] font-medium">
                  {rowData.employeeStatus}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Employee Type:</p>
                <p className="text-[#131313] font-medium">
                  {rowData.employeeType}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Joining Date:</p>

                <p className="text-[#131313] font-medium">
                  {dayjs(rowData.joiningDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Department :</p>
                <p className="text-[#131313] font-medium">
                  {rowData.department}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#EEF3FB] rounded-xl p-5">
            <p className="text-sm font-medium text-[#131313] mb-3">Password</p>

            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md w-full h-12 pr-15 px-3 py-2 text-sm outline-none border-[#0755E9] border-[0.5px]"
                />

                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-[#7D7D7D]"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <FiEye style={{ fontSize: "20px" }} />
                  ) : (
                    <FiEyeOff style={{ fontSize: "20px" }} />
                  )}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="px-4 py-2 w-50  flex justify-center items-center h-12 cursor-pointer rounded-md bg-[#0755E9] text-white"
                >
                  {loading ? (
                    <Spin
                      indicator={
                        <Loading3QuartersOutlined
                          style={{ fontSize: 24, color: "white" }}
                          spin
                        />
                      }
                    />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#8FB1FF] rounded-xl p-5">
            <h4 className="text-[16px] mb-3">Salary Structure</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[#7D7D7D] text-sm">Basic Salary</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.basic}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Fuel Allowance</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.incentive.flue}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Medical Allowance</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.incentive.medical}
                </p>
              </div>
            </div>

            <h4 className="text-[16px] mt-4 mb-2">Deductions</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
              <div>
                <p className="text-[#7D7D7D] text-sm">Loan</p>
                <p className="text-[#131313] font-medium">
                  {rowData.loanPF.loan}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Tax</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.tax}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Provident Fund</p>
                <p className="text-[#131313] font-medium">
                  {rowData.loanPF.pf}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#8FB1FF] rounded-xl p-5">
            <h4 className="text-[16px] mb-4 font-medium text-[#2B2B2B]">
              Leaves Information
            </h4>

            <div className="flex flex-wrap gap-y-4 gap-x-6">
              {/* Annual Leaves */}
              <div className="flex items-center justify-between w-full md:w-[48%]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#E5EBF7] flex items-center justify-center">
                    <FaCheck size={12} className="text-[#0755E9]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">Annual Leaves</p>
                    <p className="text-[12px] text-[#7D7D7D]">Used/Total</p>
                  </div>
                </div>
                <div className="border border-[#D9D9D9] rounded px-2 py-0.5 text-[12px] min-w-12.5 text-center">
                  {leaveEntitlements.annualLeave?.consumed ?? 0}/
                  {leaveEntitlements.annualLeave?.total ?? 0}
                </div>
              </div>

              {/* Sick Leaves */}
              <div className="flex items-center justify-between w-full md:w-[48%]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#E5EBF7] flex items-center justify-center">
                    <FaCheck size={12} className="text-[#0755E9]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">Sick Leaves</p>
                    <p className="text-[12px] text-[#7D7D7D]">Used/Total</p>
                  </div>
                </div>
                <div className="border border-[#D9D9D9] rounded px-2 py-0.5 text-[12px] min-w-12.5 text-center">
                  {leaveEntitlements.sickLeave?.consumed ?? 0}/
                  {leaveEntitlements.sickLeave?.total ?? 0}
                </div>
              </div>

              {/* Casual Leaves */}
              <div className="flex items-center justify-between w-full md:w-[48%]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#E5EBF7] flex items-center justify-center">
                    <FaCheck size={12} className="text-[#0755E9]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">Casual Leaves</p>
                    <p className="text-[12px] text-[#7D7D7D]">Used/Total</p>
                  </div>
                </div>
                <div className="border border-[#D9D9D9] rounded px-2 py-0.5 text-[12px] min-w-12.5 text-center">
                  {leaveEntitlements.casualLeave?.consumed ?? 0}/
                  {leaveEntitlements.casualLeave?.total ?? 0}
                </div>
              </div>

              {/* Maternity Leaves */}
              <div className="flex items-center justify-between w-full md:w-[48%]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#FDECEC] flex items-center justify-center">
                    <FaTimes size={12} className="text-[#E53935]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">Maternity Leaves</p>
                    <p className="text-[12px] text-[#7D7D7D]">Used/Total</p>
                  </div>
                </div>
                <div className="border border-[#D9D9D9] rounded px-2 py-0.5 text-[12px] min-w-12.5 text-center text-[#B0B0B0]">
                  {leaveEntitlements.maternityLeave?.consumed ?? 0}/
                  {leaveEntitlements.maternityLeave?.total ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
