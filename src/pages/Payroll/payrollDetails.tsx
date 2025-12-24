import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";
export default function PayrollDetails() {
  const location = useLocation();
  const payroll = location.state?.payroll;
  console.log("🚀 ~ PayrollDetails ~ payroll:", payroll);
  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-heading font-medium text-[22px] sm:text-[24px]">
          Payroll Details
        </p>
        <button className="h-13.75 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center">
          <Icon icon="mingcute:add-fill" height="20" width="20" color="#fff" />
          <p className="text-base font-medium text-white">Generate Salary</p>
        </button>
      </div>{" "}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(78vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
      ></div>
    </div>
  );
}
