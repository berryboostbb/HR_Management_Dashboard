import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function PayrollDetails() {
  const location = useLocation();
  const rowData = location.state?.rowData;

  console.log("Received Payroll Data:", rowData);
  const navigate = useNavigate();
  const handleGOBack = () => {
    navigate("/payroll");
  };
  useEffect(() => {
    document.title = "HR-Management | Payroll Details";
  }, []);

  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-109px)] h-auto rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border-[#D2D2D2] border flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>
        </div>
      </div>{" "}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(77.5vh-0px)] xl:h-[calc(64vh-0px)] mt-4 overflow-y-auto scrollbar-none"
      ></div>
    </div>
  );
}
