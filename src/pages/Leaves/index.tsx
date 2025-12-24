import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllLeaves, updateLeavesStatus } from "../../api/leaveServices";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useSelector } from "react-redux";

const titles = [
  "Employee Id",
  "Leave Type",
  "Start Date",
  "End Date",
  "Reason",
  "Approved By",
  "Status",
];
export default function Leaves() {
  useEffect(() => {
    document.title = "HR-Management | Leaves";
  }, []);
  const { data, refetch } = useQuery({
    queryKey: ["Leaves"],
    queryFn: getAllLeaves,
    staleTime: 5 * 60 * 1000,
  });

  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.leaveType,
      v.startDate ? dayjs(v.startDate).format("YYYY-MM-DD") : "--",
      v.endDate ? dayjs(v.endDate).format("YYYY-MM-DD") : "--",
      v.reason,
      v?.approvedBy || "Not Approved",
      <StatusDropdown
        key={v._id}
        initialValue={v.status || "Pending"}
        order={v}
        onStatusChange={async (orderId, status, approvedBy) => {
          try {
            await updateLeavesStatus(orderId, { status, approvedBy });
            notifySuccess("Status Updated Successfully");
            refetch();
          } catch (error: any) {
            notifyError("Failed to update status: " + error.message);
          }
        }}
      />,
    ]) || [];

  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-heading font-medium text-[22px] sm:text-[24px]">
          Leaves
        </p>
      </div>
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(77.8vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
      >
        {" "}
        <CustomTable titles={titles} data={tableData} />
      </div>
    </div>
  );
}
interface StatusDropdownProps {
  initialValue: "Pending" | "Approved" | "Rejected";
  order: any;
  onStatusChange: (orderId: string, status: string, approvedBy: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  initialValue,
  order,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(initialValue);
  const { user } = useSelector((state: any) => state.user);

  const handleApproveClick = () => {
    const approvedBy = user?.employeeId;
    onStatusChange(order._id, "Approved", approvedBy);
    setStatus("Approved");
    setOpen(false);
  };

  const handleRejectClick = () => {
    const approvedBy = user?.employeeId;
    onStatusChange(order._id, "Rejected", approvedBy);
    setStatus("Rejected");
    setOpen(false);
  };

  const statusStyles: { [key: string]: string } = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="relative w-40">
      <div
        onClick={() => setOpen(!open)}
        className={`border p-2 rounded cursor-pointer flex justify-between items-center ${statusStyles[status]}`}
      >
        {status}
        <Icon icon="formkit:down" height={20} width={20} />
      </div>

      {open && status === "Pending" && (
        <div className="absolute left-0 z-20 w-full mt-1 bg-white border rounded shadow">
          <div
            onClick={handleApproveClick}
            className="flex justify-between p-2 cursor-pointer hover:bg-gray-100"
          >
            <span className="text-green-800">Approve</span>
          </div>
          <div
            onClick={handleRejectClick}
            className="flex justify-between p-2 cursor-pointer hover:bg-gray-100"
          >
            <span className="text-red-800">Reject</span>
          </div>
        </div>
      )}
    </div>
  );
};
