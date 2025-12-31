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
  const location = useLocation();
  const { rowData } = location.state || {};
  console.log("🚀 ~ PayrollDetails ~ rowData:", rowData);
  const navigate = useNavigate();
  const [isloading, setLoading] = useState(false);
  const handleGOBack = () => navigate("/payroll");

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4 max-[564px]:gap-2">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto max-[564px]:gap-2">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <button className="h-12 flex-1 md:flex-none md:w-50 max-[564px]:w-full bg-white border border-[#0755E9] rounded-md gap-2 flex justify-center items-center">
            <img src={Calender} alt="download" className="w-5 h-5" />
            <p className="text-base font-medium text-[#0755E9]">
              {rowData?.month}-{rowData?.year}
            </p>
          </button>

          {/* <p className="text-base font-medium text-[#000] pt-3 md:pt-0">
            Working Days: 26
          </p> */}
        </div>

        <div className="flex flex-wrap w-full gap-2 md:w-auto">
          <div className="h-12 w-12 md:w-12.5 bg-[#0755E9] cursor-pointer  rounded-md flex items-center justify-center">
            <FaShareSquare className="w-5 h-5 text-white" />
          </div>

          <button className="h-12 flex-1 md:flex-none md:w-50 bg-white border border-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center">
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

      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="w-full bg-white rounded-xl border h-[calc(79vh-0px)] overflow-y-auto border-[#0755E9] p-4 mt-3"
      >
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between border border-[#0755E9] rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 p-4 md:w-1/3">
            <img src={Logo} alt="logo" className="w-15 h-15" />
            <p className="max-[564px] text-base">Himmel Pharma</p>
          </div>

          <div className="text-center md:w-1/3 border-t md:border-t-0 md:border-l md:border-r py-4 md:py-7 border-[#0755E9] px-28">
            <p className="text-[24px] max-[564px]:text-[18px]">Salary Slip</p>
            <p className="text-[16px] max-[564px]:text-[14px] text-black">
              {rowData?.month} {rowData?.year}
            </p>
          </div>

          <div className="w-full md:w-1/3 flex justify-center items-center bg-[#FFDDE5] p-4  text-center">
            <p className="text-[20px]">Confidential</p>
          </div>
        </div>

        <div className="border border-[#0755E9]  h-auto rounded-lg mt-3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Employee Name:
              </span>
              <span className="font-medium"> {rowData?.employeeId}</span>
            </p>
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Employee ID:
              </span>
              <span className="font-medium"> {rowData?.employeeName}</span>
            </p>
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Position:
              </span>
              <span className="font-medium"> {rowData?.position}</span>
            </p>
            {/* <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] min-w-32.5">Employee Type:</span>
              <span className="font-medium"> {rowData?.year}</span>
            </p> */}{" "}
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Working Days:
              </span>
              <span className="font-medium"> {rowData?.totalWorkingDays}</span>
            </p>
          </div>

          <div className="">
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Leaves:
              </span>
              <span className="font-medium"> {rowData?.approvedLeaves}</span>
            </p>
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Present Days:
              </span>
              <span className="font-medium"> {rowData?.presentDays}</span>
            </p>
            <p className="flex items-center text-xs lg:text-sm">
              <span className="text-[#7D7D7D] md:min-w-32.5 min-w-25">
                Payroll Status:
              </span>
              <span className="px-2 py-0.5 text-xs border border-[#0755E9] text-[#0755E9] rounded">
                {rowData?.payrollStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#0755E9] rounded-lg mt-2">
          <div className="min-w-150 grid grid-cols-4 bg-[#E5EBF7] text-[#7D7D7D] text-start p-2 rounded-t-md text-sm">
            <p>Description</p>
            <p>Earnings</p>
            <p>Deductions</p>
            <p>Total</p>
          </div>
          <div className="p-4 space-y-1 text-sm min-w-140 md:text-base">
            {[
              {
                desc: "Basic Salary",
                earn: rowData.basicSalary,
                ded: "-",
                total: rowData.basicSalary,
              },
              {
                desc: "Medical Allowance",
                earn: rowData.allowances.medical,
                ded: "-",
                total: rowData.basicSalary + rowData.allowances.medical,
              },
              {
                desc: "Others Allowance",
                earn: rowData.allowances.others,
                ded: "-",
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others,
              },
              {
                desc: "Transport Allowance",
                earn: rowData.allowances.transport,
                ded: "-",
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport,
              },
              {
                desc: "Loan Deduction",
                earn: "-",
                ded: rowData.deductions.loan,
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport -
                  rowData.deductions.loan,
              },
              {
                desc: "Tax Deduction",
                earn: "-",
                ded: rowData.deductions.tax,
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport -
                  rowData.deductions.loan -
                  rowData.deductions.tax,
              },
              {
                desc: "Other Deduction",
                earn: "-",
                ded: rowData.deductions.others,
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport -
                  rowData.deductions.loan -
                  rowData.deductions.tax -
                  rowData.deductions.others,
              },
              {
                desc: "Advance Salary Deduction",
                ded: rowData.deductions.advanceSalary,
                earn: "-",
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport -
                  rowData.deductions.loan -
                  rowData.deductions.tax -
                  rowData.deductions.others -
                  rowData.deductions.advanceSalary,
              },
              {
                desc: "PF Deduction",
                ded: rowData.deductions.pf,
                earn: "-",
                total:
                  rowData.basicSalary +
                  rowData.allowances.medical +
                  rowData.allowances.others +
                  rowData.allowances.transport -
                  rowData.deductions.loan -
                  rowData.deductions.tax -
                  rowData.deductions.others -
                  rowData.deductions.advanceSalary -
                  rowData.deductions.pf,
              },
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 py-1 min-w-150">
                <p>{item.desc}</p>
                <p className="text-start">{item.earn}</p>
                <p
                  className={`text-start ${
                    item.ded !== "-" ? "text-red-500" : ""
                  }`}
                >
                  {item.ded}
                </p>
                <p className="text-start">{item.total}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#0755E9] rounded-lg mt-2 flex flex-col-2 md:flex-row justify-between items-center p-4 font-semibold bg-[#E5EBF7] text-sm md:text-base">
          <p>Net Payable</p>
          <p className="text-center md:text-right">Rs:{rowData.netPay}/</p>
        </div>
      </div>
    </div>
  );
}
