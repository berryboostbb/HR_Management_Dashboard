// import { FaShareSquare } from "react-icons/fa";
// import { FaArrowLeft } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
// import { downloadSalarySlip } from "../../api/payrollsServices";
// import { useState } from "react";
// import Calender from "../../assets/calender.svg";
// import { notifyError, notifySuccess } from "../../Components/Toast";
// import { Loading3QuartersOutlined } from "@ant-design/icons";
// import { Spin } from "antd";

// import Logo from "../../assets/logo.svg";

// export default function PayrollDetails() {
//   const [isloading, setLoading] = useState(false);
//   const location = useLocation();
//   const payroll = location.state?.data;
//   console.log("🚀 ~ PayrollDetails ~ payroll:", payroll);
//   const navigate = useNavigate();
//   const handleGOBack = () => {
//     navigate("/payroll");
//   };

//   const handleDownloadSalarySlip = async () => {
//     if (!payroll?._id) return;

//     try {
//       setLoading(true); // start loading

//       const response = await downloadSalarySlip(payroll._id);

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `salary-slip-${payroll.employeeId}-${payroll.month}-${payroll.year}.pdf`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       notifySuccess("Salary slip downloaded successfully"); // success notification
//     } catch (error) {
//       console.error("Failed to download salary slip", error);
//       notifyError("Failed to download salary slip");
//     } finally {
//       setLoading(false); // stop loading
//     }
//   };
//   const antIcon = (
//     <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
//   );
//   return (
//     <div className="bg-[#F7F7F7] md:h-[calc(100vh-109px)] h-auto rounded-xl p-4">
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <div className="flex gap-3">
//           <div
//             onClick={handleGOBack}
//             className="h-11 w-11 cursor-pointer rounded-lg border-[#D2D2D2] border flex justify-center items-center"
//           >
//             <FaArrowLeft size={16} color="#000000" />
//           </div>
//           <button
//             onClick={handleDownloadSalarySlip}
//             className="h-12 w-full md:w-50 bg-[#fff] border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
//           >
//             <img src={Calender} alt="download" className="w-5 h-5" />
//             <p className="text-base font-medium text-[#0755E9]">
//               December-2025
//             </p>
//           </button>
//           <p className="text-base font-medium text-[#000] pt-3">
//             Working Days: 26
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <div className="h-12 w-[50px] bg-[#0755E9] rounded-md flex items-center justify-center">
//             <FaShareSquare className="w-5 h-5 text-[#fff]" />
//           </div>

//           <button
//             onClick={handleDownloadSalarySlip}
//             className="h-12 w-full md:w-50 bg-[#fff] border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
//           >
//             {isloading ? (
//               <Spin indicator={antIcon} />
//             ) : (
//               <>
//                 <p className="text-base font-medium text-[#0755E9]">
//                   Salary Structure
//                 </p>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//       <div className="w-full h-[540px] bg-white rounded-xl border border-[#0755E9] p-4 text-sm mt-3">
//         <div className="flex h-[75px] items-center justify-between border border-[#0755E9] rounded-lg overflow-hidden">
//           <div className="flex items-center gap-3 p-3 w-1/3 mx-3">
//             <img src={Logo} alt="logo" className="w-[60px] h-[60px]" />
//             <p className="text-[16px]">Himmel Pharma</p>
//           </div>

//           <div className="text-center w-1/3 border-l border-r py-7 border-[#0755E9] p-3">
//             <p className="text-[24px]">Salary Slip</p>
//             <p className="text-[16px] text-black">November 2025</p>
//           </div>

//           <div className="w-1/3 bg-[#FFDDE5] p-9 text-center font-medium">
//             Confidential
//           </div>
//         </div>
//         <div className="border border-[#0755E9] h-auto rounded-lg mt-3 p-4 grid grid-cols-2 gap-4">
//           <div className="">
//             <p className="flex items-center ">
//               <span className="text-[#7D7D7D] min-w-[130px]">
//                 Employee Name:
//               </span>
//               <span className="font-semibold">Cristofor Schleifer</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">Employee ID:</span>
//               <span className="font-semibold">NSM-007</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">Position:</span>
//               <span className="font-semibold">Area Sales Manager</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">
//                 Employee Type:
//               </span>
//               <span className="font-semibold">Field Staff</span>
//             </p>
//           </div>

//           <div className="">
//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">
//                 Working Days:
//               </span>
//               <span className="font-semibold">26</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">Leaves:</span>
//               <span className="font-semibold">02</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">
//                 Present Days:
//               </span>
//               <span className="font-semibold">21</span>
//             </p>

//             <p className="flex items-center">
//               <span className="text-[#7D7D7D] min-w-[130px]">
//                 Payroll Status:
//               </span>
//               <span className="px-2 py-0.5 text-xs border border-[#0755E9] text-[#0755E9] rounded">
//                 Draft
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 h-[42px] text-[#7D7D7D] bg-[#E5EBF7] p-4 text-center py-2 rounded-md font-medium mt-2">
//           <p className="relative right-18">Description</p>
//           <p>Earnings</p>
//           <p>Deductions</p>
//           <p>Total</p>
//         </div>

//         <div className="border border-[#0755E9] rounded-lg mt-2 p-4 space-y-1">
//           <div className="grid grid-cols-4 py-1">
//             <p>Basic Salary</p>
//             <p className="text-center">60,000</p>
//             <p className="text-center">-</p>
//             <p className="text-center">Rs. 60,000</p>
//           </div>

//           <div className="grid grid-cols-4 py-1">
//             <p>Allowance</p>
//             <p className="text-center">20,000</p>
//             <p className="text-center">-</p>
//             <p className="text-center">Rs. 80,000</p>
//           </div>

//           <div className="grid grid-cols-4 py-1">
//             <p>Loan Deduction</p>
//             <p className="text-center">-</p>
//             <p className="text-center text-red-500">8,000</p>
//             <p className="text-center">Rs. 72,000</p>
//           </div>

//           <div className="grid grid-cols-4 py-1">
//             <p>Tax Deduction</p>
//             <p className="text-center">-</p>
//             <p className="text-center text-red-500">1,800</p>
//             <p className="text-center">Rs. 70,200</p>
//           </div>

//           <div className="grid grid-cols-4 py-1">
//             <p>Other Deduction</p>
//             <p className="text-center">-</p>
//             <p className="text-center text-red-500">1,400</p>
//             <p className="text-center">Rs. 68,800</p>
//           </div>
//         </div>

//         <div className="border border-[#0755E9] rounded-lg mt-2 flex justify-between items-center p-4 font-semibold bg-[#E5EBF7]">
//           <p>Net Payable</p>
//           <p className="relative right-20">Rs. 68,800</p>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />;

  return (
    <div className="bg-[#F7F7F7] min-h-screen md:h-[calc(100vh-109px)] rounded-xl p-4 md:p-6">
      {/* Header Buttons */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <button
            onClick={handleDownloadSalarySlip}
            className="h-12 flex-1 md:flex-none md:w-50 bg-white border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            <img src={Calender} alt="download" className="w-5 h-5" />
            <p className="text-base font-medium text-[#0755E9]">December-2025</p>
          </button>

          <p className="text-base font-medium text-[#000] pt-3 md:pt-0">
            Working Days: 26
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="h-12 w-12 md:w-[50px] bg-[#0755E9] rounded-md flex items-center justify-center">
            <FaShareSquare className="w-5 h-5 text-white" />
          </div>

          <button
            onClick={handleDownloadSalarySlip}
            className="h-12 flex-1 md:flex-none md:w-50 bg-white border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            {isloading ? (
              <Spin indicator={antIcon} />
            ) : (
              <p className="text-base font-medium text-[#0755E9]">Salary Structure</p>
            )}
          </button>
        </div>
      </div>

      {/* Salary Slip Container */}
      <div className="w-full bg-white rounded-xl border border-[#0755E9] p-4 mt-3">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between border border-[#0755E9] rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 p-3 md:w-1/3">
            <img src={Logo} alt="logo" className="w-[60px] h-[60px]" />
            <p className="text-[16px]">Himmel Pharma</p>
          </div>

          <div className="text-center md:w-1/3 border-t md:border-t-0 md:border-l md:border-r py-4 md:py-7 border-[#0755E9] px-3">
            <p className="text-[24px]">Salary Slip</p>
            <p className="text-[16px] text-black">November 2025</p>
          </div>

          <div className="w-full md:w-1/3 bg-[#FFDDE5] p-4 md:p-9 text-center font-medium">
            Confidential
          </div>
        </div>

        {/* Employee Info */}
        <div className="border border-[#0755E9] h-auto rounded-lg mt-3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Employee Name:</span>
              <span className="font-semibold">Cristofor Schleifer</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Employee ID:</span>
              <span className="font-semibold">NSM-007</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Position:</span>
              <span className="font-semibold">Area Sales Manager</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Employee Type:</span>
              <span className="font-semibold">Field Staff</span>
            </p>
          </div>

          <div>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Working Days:</span>
              <span className="font-semibold">26</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Leaves:</span>
              <span className="font-semibold">02</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Present Days:</span>
              <span className="font-semibold">21</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#7D7D7D] min-w-[130px]">Payroll Status:</span>
              <span className="px-2 py-0.5 text-xs border border-[#0755E9] text-[#0755E9] rounded">
                Draft
              </span>
            </p>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 md:grid-cols-4 h-[42px] text-[#7D7D7D] bg-[#E5EBF7] p-2 text-center rounded-md mt-2 text-sm md:text-base">
          <p>Description</p>
          <p>Earnings</p>
          <p>Deductions</p>
          <p>Total</p>
        </div>

        {/* Table Rows */}
        <div className="border border-[#0755E9] rounded-lg mt-2 p-4 space-y-1 text-sm md:text-base">
          {[
            { desc: "Basic Salary", earn: "60,000", ded: "-", total: "Rs. 60,000" },
            { desc: "Allowance", earn: "20,000", ded: "-", total: "Rs. 80,000" },
            { desc: "Loan Deduction", earn: "-", ded: "8,000", total: "Rs. 72,000" },
            { desc: "Tax Deduction", earn: "-", ded: "1,800", total: "Rs. 70,200" },
            { desc: "Other Deduction", earn: "-", ded: "1,400", total: "Rs. 68,800" },
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 py-1">
              <p>{item.desc}</p>
              <p className="text-center">{item.earn}</p>
              <p className={`text-center ${item.ded !== "-" ? "text-red-500" : ""}`}>{item.ded}</p>
              <p className="text-center">{item.total}</p>
            </div>
          ))}
        </div>

        {/* Net Payable */}
        <div className="border border-[#0755E9] rounded-lg mt-2 flex flex-col md:flex-row justify-between items-center p-4 font-semibold bg-[#E5EBF7] text-sm md:text-base">
          <p>Net Payable</p>
          <p className="text-center md:text-right">Rs. 68,800</p>
        </div>
      </div>
    </div>
  );
}
