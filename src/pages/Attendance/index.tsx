import { useQuery } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
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
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";

import type { AxiosResponse } from "axios";
import { useDebounce } from "../../Components/Debounce";

const titles = [
  "Employee Id",
  "Employee Name",
  "Employee Role",
  "Date",
  "CheckIn",
  "CheckOut",
  "Checkout Location",
  "Action",
];

const optionStatus = ["Present", "Late", "Absent", "Half-day", "On Leave"];

export default function Attendance() {
  useEffect(() => {
    document.title = "HR-Management | Attendance";
  }, []);

  const [activeTab, setActiveTab] = useState<"Field Staff" | "Office Staff">(
    "Field Staff"
  );

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);

  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);

  const searchValue = debouncedSearchId || debouncedSearchName;

  const { data, refetch } = useQuery<AxiosResponse<any>>({
    queryKey: ["Attendance", searchValue],
    queryFn: () => getAllAttendance(searchValue),
    placeholderData: (previousData) => previousData,
  });
  const filteredData = data?.data?.filter((v: any) => {
    if (activeTab === "Office Staff") return v.employeeRole === "Office Staff";
    if (activeTab === "Field Staff") return v.employeeRole === "Field Staff";
    return true;
  });

  const tableData =
    filteredData?.map((v: any) => [
      v.employeeId,
      v.employeeName,
      v.employeeRole,
      v.date ? dayjs(v.date).format("YYYY-MM-DD") : "--",
      v.checkIn?.time ? dayjs(v.checkIn.time).format("HH:mm") : "--",
      v.checkOut?.time ? dayjs(v.checkOut.time).format("HH:mm") : "--",
      v.checkOut?.location?.address || "--",
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
        .catch(() => notifyError("Failed to update Attendance"))
        .finally(() => setLoading(false));
    },
  });

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
      <div className="flex gap-4 justify-between flex-wrap-reverse">
        <div className="flex gap-2">
          {["Field Staff", "Office Staff"].map((role) => (
            <div
              key={role}
              onClick={() => setActiveTab(role as any)}
              className={`cursor-pointer rounded-t-2xl h-14 flex justify-center items-center w-30 ${
                activeTab === role
                  ? "bg-[#E5EBF7] text-black"
                  : "bg-white text-[#7d7d7d]"
              }`}
            >
              <p className="text-sm font-medium">{role}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <SearchById value={searchId} onChange={setSearchId} />
          <SearchByName value={searchName} onChange={setSearchName} />
        </div>
      </div>
      <div
        className={`bg-[#E5EBF7] p-4 rounded-xl 2xl:h-[calc(79vh-0px)] xl:h-[calc(56vh-0px)]  ${
          activeTab === "Field Staff" ? "rounded-tl-none" : ""
        }`}
      >
        <p className="text-[#7D7D7D] font-medium text-sm">Employee’s List</p>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="bg-white mt-2 rounded-xl overflow-y-auto"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
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
                  className="h-13.75 md:w-50 w-full bg-[#0755E9] text-white rounded-md flex justify-center items-center"
                >
                  {isloading ? <Spin indicator={antIcon} /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
