import { FaArrowLeft, FaUserTie } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-[#F7F7F7] h-[calc(100vh-110px)] rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div
          onClick={() => navigate("/employees")}
          className="h-11 w-11 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
        >
          <FaArrowLeft size={16} />
        </div>
        <h2 className="text-[20px] font-semibold">Employee Details</h2>
      </div>

      <div className="bg-white rounded-xl border border-[#0755E9] p-4 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="h-24 w-24 rounded-full bg-[#E5EBF7] flex items-center justify-center">
            <FaUserTie size={40} className="text-[#0755E9]" />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-8">
            <div>
              <h3 className="text-[14px] font-semibold">Cristofor Schleifer</h3>
              <p className="text-[#0755E9] text-[12px]">NSM-007</p>
            </div>
            <button
              onClick={() => setIsEdit(true)}
              className={`
    h-11 px-4 rounded-md border text-sm transition cursor-pointer
    ${
      isEdit
        ? "bg-[#0755E9] text-white border-[#0755E9]" // active state
        : "bg-transparent text-[#0755E9] border-[#0755E9] hover:bg-[#0755E9] hover:text-white"
    } // default
  `}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div>
            <h4 className="text-[16px]  mb-3">Personal Information</h4>
            <div className="flex flex-col gap-4">
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  DOB
                </span>
                <span className="ml-auto">March 28-1948</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Select Gender
                </span>
                <span className="ml-auto">Male</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Phone Number
                </span>
                <span className="ml-auto">0322-1234567</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Email
                </span>
                <span className="ml-auto">ammankberryboost@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[16px] mb-3">Employee Detail</h4>
            <div className="flex flex-col gap-4">
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Emplolyee Status
                </span>
                <span className="ml-auto">Active</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Employee Type
                </span>
                <span className="ml-auto">Office Staff</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Joining Date
                </span>
                <span className="ml-auto">September 19, 2025</span>
              </div>

              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-8 translate-y-1 text-[#7D7D7D] text-sm bg-white border-3 border-white">
                  Select Position
                </span>
                <span className="ml-auto">National Sales Manager</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full md:w-1/2">
          <h4 className="text-[16px] mb-3">Password</h4>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 border border-[#0755E9] rounded-md p-3 text-sm">
              <span className="absolute left-3 -top-2 text-[#7D7D7D] text-xs bg-white px-1">
                Password
              </span>
              <span>**********</span>
            </div>
            <button
              onClick={() => setIsActive(true)}
              className={`
        h-11 px-4 rounded-md border text-sm transition cursor-pointer
        ${
          isActive
            ? "bg-[#0755E9] text-white border-[#0755E9]"
            : "bg-transparent text-[#0755E9] border-[#0755E9] hover:bg-[#0755E9] hover:text-white"
        }
      `}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div>
            <h4 className="text-[16px] mb-3">Payroll Information</h4>
            <div className="flex flex-col gap-4">
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Basic Salary
                </span>
                <span className="ml-auto">Rs. 60,000</span>
              </div>
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Allowances
                </span>
                <span className="ml-auto">Rs. 20,000</span>
              </div>
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Net Salary
                </span>
                <span className="ml-auto">Rs. 68,800</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[16px] mb-3">Contact Information</h4>
            <div className="flex flex-col gap-4">
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Email
                </span>
                <span className="ml-auto font-medium">employee@email.com</span>
              </div>
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Phone
                </span>
                <span className="ml-auto font-medium">+92 300 1234567</span>
              </div>
              <div className="relative border border-[#0755E9] rounded-md p-3 text-sm">
                <span className="absolute left-3 -mt-6 bg-white text-[#7D7D7D] text-sm px-1">
                  Address
                </span>
                <span className="ml-auto font-medium">Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[14px] font-medium mb-2">Leaves</p>

          <div className="border border-[#0755E9] rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-7">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#0755E9]"
                />
                <span className="w-24">Annual Leaves</span>
                <input
                  type="text"
                  value="10"
                  className="w-14 h-7 border rounded text-center"
                />
              </div>

              <div className="flex items-center gap-7">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#0755E9]"
                />
                <span className="w-24">Sick Leaves</span>
                <input
                  type="text"
                  value="05"
                  className="w-14 h-7 border rounded text-center"
                />
              </div>

              <div className="flex items-center gap-7">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#0755E9]"
                />
                <span className="w-24">Casual Leaves</span>
                <input
                  type="text"
                  value="10"
                  className="w-14 h-7 border rounded text-center"
                />
              </div>

              <div className="flex items-center gap-7">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="accent-[#0755E9]"
                />
                <span className="w-24 text-gray-400">Maternity Leaves</span>
                <input
                  type="text"
                  value="0"
                  disabled
                  className="w-14 h-7 border rounded text-center bg-gray-100"
                />
              </div>
            </div>
          </div>
          {isEdit && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setIsSaved(false);
                }}
                className="
          px-4 py-2 rounded-md border border-[#0755E9]
          text-[#0755E9] bg-transparent text-sm
          hover:bg-[#0755E9] hover:text-white
          transition cursor-pointer
        "
              >
                Cancel
              </button>

              <button
                onClick={() => setIsSaved(true)}
                className={`
          px-4 py-2 rounded-md border text-sm transition cursor-pointer
          ${
            isSaved
              ? "bg-[#0755E9] text-white border-[#0755E9]"
              : "bg-transparent text-[#0755E9] border-[#0755E9] hover:bg-[#0755E9] hover:text-white"
          } // default
        `}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
