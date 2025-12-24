import { useQuery } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";
import {
  getAllAttendance,
  updateAttendance,
} from "../../api/attendanceServices";
import dayjs, { Dayjs } from "dayjs";
import { TbEdit } from "react-icons/tb";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import CustomSelect from "../../Components/Select";
import TimePicker from "../../Components/TimePicker";
import DatePicker from "../../Components/DatePicker";
import { useFormik } from "formik";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notifyError, notifySuccess } from "../../Components/Toast";

const titles = [
  "Employee Id",
  "Employee Role",
  "Date",
  "CheckIn",
  "CheckOut",
  "Status",
  "Action",
];

const optionStatus = ["Present", "Late", "Absent", "Half-day", "On Leave"];

export default function Attendance() {
  useEffect(() => {
    document.title = "HR-Management | Attendance";
  }, []);
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["Attendance"],
    queryFn: getAllAttendance,
    staleTime: 5 * 60 * 1000,
  });

  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.employeeRole,
      v.date ? dayjs(v.date).format("YYYY-MM-DD") : "--",
      v.checkIn?.time ? dayjs(v.checkIn.time).format("HH:mm") : "--",
      v.checkOut?.time ? dayjs(v.checkOut.time).format("HH:mm") : "--",
      v.status,
      <TbEdit
        key={v._id}
        size={18}
        className="cursor-pointer text-[#0755E9]"
        onClick={() => {
          setEditing(v);
          setOpenModel(true);
        }}
      />,
    ]) || [];

  const formik = useFormik<{
    date: Dayjs | null;
    status: string;
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
  }>({
    enableReinitialize: true,
    initialValues: {
      date: editing?.date ? dayjs(editing.date) : null,
      status: editing?.status || "",
      checkIn: editing?.checkIn?.time ? dayjs(editing.checkIn.time) : null,
      checkOut: editing?.checkOut?.time ? dayjs(editing.checkOut.time) : null,
    },
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        status: values.status,
        checkIn: values.checkIn ? { time: values.checkIn.toISOString() } : null,
        checkOut: values.checkOut
          ? { time: values.checkOut.toISOString() }
          : null,
      };

      updateAttendance(editing._id, payload)
        .then(() => {
          notifySuccess("Attendance updated successfully");
          setOpenModel(false);
          setEditing(null);
          formik.resetForm();
          refetch();
        })
        .catch((error) => {
          console.error(error);
          notifyError("Failed to update Attendance.");
        })
        .finally(() => setLoading(false));
    },
  });
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
        <p className="text-heading font-medium text-[24px]">Attendance</p>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(77.8vh-0px)] xl:h-[calc(53vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative p-6 bg-white rounded-xl w-200">
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">Update Attendance</p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="flex gap-6">
                {/* LEFT */}
                <div className="w-1/2 space-y-4">
                  <DatePicker
                    label="Date"
                    value={formik.values.date}
                    onChange={(date) => formik.setFieldValue("date", date)}
                  />

                  <CustomSelect
                    placeholder="Status"
                    value={formik.values.status}
                    options={optionStatus}
                    onChange={(val: string) =>
                      formik.setFieldValue("status", val)
                    }
                  />
                </div>
                <div className="w-1/2 space-y-4">
                  <TimePicker
                    label="Check In"
                    value={formik.values.checkIn}
                    onChange={(time) => formik.setFieldValue("checkIn", time)}
                  />

                  <TimePicker
                    label="Check Out"
                    value={formik.values.checkOut}
                    onChange={(time) => formik.setFieldValue("checkOut", time)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="h-13.75 md:w-50 w-full bg-[#0755E9] text-white rounded-md gap-3 cursor-pointer flex justify-center items-center"
                >
                  {isloading ? <Spin indicator={antIcon} /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
