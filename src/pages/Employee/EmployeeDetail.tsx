import { FaArrowLeft } from "react-icons/fa";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IoMdCloseCircle } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "../../api/adminServices";
import { notifyError, notifySuccess } from "../../Components/Toast";

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
  leaveEntitlements: {
    annualLeave: { total: number; consumed: number };
    casualLeave: { total: number; consumed: number };
    maternityLeave: { total: number; consumed: number };
    paternityLeave: { total: number; consumed: number };
    sickLeave: { total: number; consumed: number };
  };
}

export default function EmployeeDetails() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const { rowData } = (location.state as { rowData: EmployeeData }) || {};
  const navigate = useNavigate();
  const handleUpdatePassword = async () => {
    try {
      await updatePassword(rowData._id, { password });
      notifySuccess("Password updated successfully!");
      setPassword("");
      setOpenModel(false);
    } catch (err: any) {
      console.error(err);
      notifyError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
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
          <button
            onClick={() => setOpenModel(true)}
            className="px-4 text-sm bg-[#0755E9] text-white border-[#0755E9] transition border rounded-md cursor-pointer h-11"
          >
            Change Password
          </button>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-white rounded-xl border border-[#0755E9] p-4 flex-1 overflow-y-auto"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="h-24 p-4 w-24 rounded-full bg-[#E5EBF7] flex items-center justify-center">
              <img src={rowData.image} alt="Profile" className="rounded-full" />
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

          <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2">
            <div>
              <h4 className="text-[16px]  mb-3">Personal Information</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">DOB:</p>
                  <p className="text-[#131313] font-medium">
                    {dayjs(rowData.DOB).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">Gender:</p>
                  <p className="text-[#131313] font-medium">{rowData.gender}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Phone Number:</p>
                  <p className="text-[#131313] font-medium">
                    {rowData.phoneNumber}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Email:</p>
                  <p className="text-[#131313] font-medium">{rowData.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[16px] mb-3">Employee Detail</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Emplolyee Status:
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.employeeStatus}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Employee Type:
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.employeeType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Joining Date:</p>

                  <p className="text-[#131313] font-medium">
                    {dayjs(rowData.joiningDate).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Department :</p>
                  <p className="text-[#131313] font-medium">
                    {rowData.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2">
            <div>
              <h4 className="text-[16px] mb-3">Payroll Information</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Basic Salary :
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.salaryStructure.basic}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Flue Allowance :
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.salaryStructure.incentive.flue}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Medical Allowance:
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.salaryStructure.incentive.medical}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Others Allowance:
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.salaryStructure.incentive.others}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Loan:</p>
                  <p className="text-[#131313] font-medium">
                    {rowData.loanPF.loan}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm">
                    {" "}
                    Provident Funds:
                  </p>
                  <p className="text-[#131313] font-medium">
                    {rowData.loanPF.loan}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className=" text-[#7D7D7D] w-30 text-sm"> Net Salary:</p>
                  <p className="text-[#131313] font-medium">
                    {rowData.salaryStructure.basic}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[16px] mb-3">Leaves Information</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-[#7D7D7D]">
                  <p className="text-sm w-30">Annual Leaves:</p>
                  <p className="font-medium ">
                    Total:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.annualLeave.total}
                    </span>{" "}
                  </p>
                  <p className="font-medium ">
                    Consumed:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.annualLeave.consumed}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[#7D7D7D]">
                  <p className="text-sm w-30">Casual Leaves:</p>
                  <p className="font-medium ">
                    Total:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.casualLeave.total}
                    </span>{" "}
                  </p>
                  <p className="font-medium ">
                    Consumed:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.casualLeave.consumed}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[#7D7D7D]">
                  <p className="text-sm w-30">Maternity Leaves:</p>
                  <p className="font-medium ">
                    Total:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.maternityLeave.total}
                    </span>{" "}
                  </p>
                  <p className="font-medium ">
                    Consumed:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.maternityLeave.consumed}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[#7D7D7D]">
                  <p className="text-sm w-30">Paternity Leaves:</p>
                  <p className="font-medium ">
                    Total:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.paternityLeave.total}
                    </span>{" "}
                  </p>
                  <p className="font-medium ">
                    Consumed:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.paternityLeave.consumed}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[#7D7D7D]">
                  <p className="text-sm w-30">Sick Leaves:</p>
                  <p className="font-medium ">
                    Total:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.sickLeave.total}
                    </span>{" "}
                  </p>
                  <p className="font-medium ">
                    Consumed:{" "}
                    <span className="text-[#131313]">
                      {rowData.leaveEntitlements.sickLeave.consumed}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="relative p-6 bg-white rounded-xl mx-3 w-150 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">Update Password</p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>
            <div>
              {" "}
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
                  className="rounded-md w-full h-14 pr-15 px-3 py-2 text-sm outline-none border-[#0755E9] border-[0.5px]"
                />

                <span
                  className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <FiEye style={{ fontSize: "20px" }} />
                  ) : (
                    <FiEyeOff style={{ fontSize: "20px" }} />
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="px-4 py-2 cursor-pointer rounded-md bg-[#0755E9] text-white"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
