import { FaShareSquare, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { downloadSalarySlip } from "../../api/payrollsServices";
import { useState } from "react";
import Calender from "../../assets/calender.svg";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Logo from "../../assets/logo.svg";

export default function PayrollDetails() {
  const [isloading, setLoading] = useState(false);
  const location = useLocation();
  const payroll = location.state?.data;
  const navigate = useNavigate();

  const handleGOBack = () => navigate("/payroll");

  const handleDownloadSalarySlip = async () => {
    if (!payroll?._id) return;

    try {
      setLoading(true);
      const response = await downloadSalarySlip(payroll._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `salary-slip-${payroll.employeeId}-${payroll.month}-${payroll.year}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      notifySuccess("Salary slip downloaded successfully");
    } catch (error) {
      console.error(error);
      notifyError("Failed to download salary slip");
    } finally {
      setLoading(false);
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <div className="bg-[#F7F7F7] min-h-screen rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4 max-[564px]:gap-2">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto max-[564px]:gap-2">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <button
            onClick={handleDownloadSalarySlip}
            className="h-12 flex-1 md:flex-none md:w-50 max-[564px]:w-full bg-white border border-[#0755E9] rounded-md gap-2 flex justify-center items-center"
          >
            <img src={Calender} alt="download" className="w-5 h-5" />
            <p className="text-base font-medium text-[#0755E9]">
              December-2025
            </p>
          </button>

          {/* <p className="text-base font-medium text-[#000] pt-3 md:pt-0">
            Working Days: 26
          </p> */}
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="h-12 w-12 md:w-12.5 bg-[#0755E9] rounded-md flex items-center justify-center">
            <FaShareSquare className="w-5 h-5 text-white" />
          </div>

          <button
            onClick={handleDownloadSalarySlip}
            className="h-12 flex-1 md:flex-none md:w-50 bg-white border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            {isloading ? (
              <Spin indicator={antIcon} />
            ) : (
              <p className="text-base font-medium text-[#0755E9]">
                Salary Structure
              </p>
            )}
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl border border-[#0755E9] p-4 mt-3">
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between border border-[#0755E9] rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 p-4 md:w-1/3">
            <img src={Logo} alt="logo" className="w-15 h-15" />
            <p className="text-[20px] max-[564px]:text-[16px]">Himmel Pharma</p>
          </div>

          <div className="text-center md:w-1/3 border-t md:border-t-0 md:border-l md:border-r py-4 md:py-7 border-[#0755E9] px-28">
            <p className="text-[24px] max-[564px]:text-[18px]">Salary Slip</p>
            <p className="text-[16px] max-[564px]:text-[14px] text-black">
              November 2025
            </p>
          </div>

          <div className="w-full md:w-1/3 bg-[#FFDDE5] p-4 md:p-9 text-center font-medium">
            <p className="text-[20px] mt-2">Confidential</p>
          </div>
        </div>

        <div className="border border-[#0755E9] h-auto rounded-lg mt-3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Employee Name:</span>
              <span className="font-semibold">Cristofor Schleifer</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Employee ID:</span>
              <span className="font-semibold">NSM-007</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Position:</span>
              <span className="font-semibold">Area Sales Manager</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Employee Type:</span>
              <span className="font-semibold">Field Staff</span>
            </p>
          </div>

          <div>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Working Days:</span>
              <span className="font-semibold">26</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Leaves:</span>
              <span className="font-semibold">02</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Present Days:</span>
              <span className="font-semibold">21</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-32.5">Payroll Status:</span>
              <span className="px-2 py-0.5 text-xs border border-[#0755E9] text-[#0755E9] rounded">
                Draft
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 max-[564px]:grid-cols-4 h-auto text-[#7D7D7D] bg-[#E5EBF7] p-2 text-center rounded-md mt-2 text-sm">
          <p>Description</p>
          <p>Earnings</p>
          <p>Deductions</p>
          <p>Total</p>
        </div>

        <div className="border border-[#0755E9] rounded-lg mt-2 p-4 space-y-1 text-sm md:text-base">
          {[
            {
              desc: "Basic Salary",
              earn: "60,000",
              ded: "-",
              total: "Rs. 60,000",
            },
            {
              desc: "Allowance",
              earn: "20,000",
              ded: "-",
              total: "Rs. 80,000",
            },
            {
              desc: "Loan Deduction",
              earn: "-",
              ded: "8,000",
              total: "Rs. 72,000",
            },
            {
              desc: "Tax Deduction",
              earn: "-",
              ded: "1,800",
              total: "Rs. 70,200",
            },
            {
              desc: "Other Deduction",
              earn: "-",
              ded: "1,400",
              total: "Rs. 68,800",
            },
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 py-1">
              <p>{item.desc}</p>
              <p className="text-center">{item.earn}</p>
              <p
                className={`text-center ${
                  item.ded !== "-" ? "text-red-500" : ""
                }`}
              >
                {item.ded}
              </p>
              <p className="text-center">{item.total}</p>
            </div>
          ))}
        </div>

        <div className="border border-[#0755E9] rounded-lg mt-2 flex flex-col-2 md:flex-row justify-between items-center p-4 font-semibold bg-[#E5EBF7] text-sm md:text-base">
          <p>Net Payable</p>
          <p className="text-center md:text-right">Rs. 68,800</p>
        </div>
      </div>
    </div>
  );
}
