import { Icon } from "@iconify/react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { downloadSalarySlip } from "../../api/payrollsServices";
import { useState } from "react";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
export default function PayrollDetails() {
  const [isloading, setLoading] = useState(false);
  const location = useLocation();
  const payroll = location.state?.payroll;
  const navigate = useNavigate();
  const handleGOBack = () => {
    navigate("/payroll");
  };

  const handleDownloadSalarySlip = async () => {
    if (!payroll?._id) return;

    try {
      setLoading(true); // start loading

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

      notifySuccess("Salary slip downloaded successfully"); // success notification
    } catch (error) {
      console.error("Failed to download salary slip", error);
      notifyError("Failed to download salary slip");
    } finally {
      setLoading(false); // stop loading
    }
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border-[#D2D2D2] border flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Payroll Details
          </p>
        </div>
        <button
          onClick={handleDownloadSalarySlip}
          className="h-13.75 w-full md:w-55 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
        >
          {isloading ? (
            <Spin indicator={antIcon} />
          ) : (
            <>
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-base font-medium text-white">
                Generate Salary Slip
              </p>
            </>
          )}
        </button>
      </div>{" "}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(78vh-0px)] xl:h-[calc(64vh-0px)] mt-4 overflow-y-auto scrollbar-none"
      ></div>
    </div>
  );
}
