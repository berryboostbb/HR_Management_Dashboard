import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import {
  approvePayroll,
  generatePayroll,
  getAllPayrolls,
  updatePayroll,
} from "../../api/payrollsServices";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import { payrollSchema } from "../../utils/contant";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useDebounce } from "../../Components/Debounce";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

const tableHeaders = [
  "Employee ID",
  "Employee Name",
  "Position",
  "Present Days",
  "Gross Salary",
  "Net Pay",
  "Payroll Status",
  "Action",
];

export default function Payroll() {
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const { data, refetch, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: [
      "Payrolls",
      debouncedSearchId,
      debouncedSearchName,
      selectedMonthYear,
    ],
    queryFn: () =>
      getAllPayrolls(
        debouncedSearchId,
        debouncedSearchName,
        selectedMonthYear.month,
        selectedMonthYear.year
      ),
    placeholderData: (previousData) => previousData,
  });

  const handleApprove = (rowData: any) => {
    if (rowData?.payrollStatus === "Approved") {
      notifyError("Payroll is already approved.");
      return;
    }

    approvePayroll(rowData._id)
      .then(() => {
        notifySuccess("Payroll approved successfully");
        refetch();
      })
      .catch((error) => {
        console.error(error);
        notifyError("Failed to approve payroll.");
      });
  };

  const handleGoToDetails = (row: any[]) => {
    console.log("Clicked row data:", row);
    const rowData = data?.data?.find((v: any) => v.employeeId === row[0]);

    if (rowData) {
      navigate("/payroll/payrollDetails", {
        state: { rowData },
      });
    }
  };
  console.log("🚀 ~ Payroll ~  data?.data:", data?.data);
  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.employeeName,
      v.position || "-",
      v.presentDays,
      v.grossSalary,
      v.netPay,
      <span
        key={v._id + "-status"}
        className={`px-3 py-0.5 rounded-sm font-medium text-sm border ${
          v.payrollStatus === "Pending"
            ? "text-[#0755E9] border-[#0755E9]"
            : v.payrollStatus === "Approved"
            ? "text-green-600 border-green-600"
            : "text-gray-600 border-gray-400"
        }`}
      >
        {v.payrollStatus}
      </span>,
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative"
      >
        <Icon
          icon="ph:dots-three-outline-vertical-duotone"
          className="text-2xl text-[#0755E9] cursor-pointer"
          onClick={() => setOpenActionId(openActionId === v._id ? null : v._id)}
        />

        {openActionId === v._id && (
          <div className="absolute right-0 z-50 w-40 mt-2 bg-white rounded-lg shadow-lg">
            <div
              onClick={() => {
                setEditing(v);
                setOpenModel(true);
                setOpenActionId(null);
              }}
              className="px-4 py-2 text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2"
            >
              Edit
            </div>
            <div
              onClick={() => {
                setEditing(v);
              }}
              className="px-4 py-2 text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2"
            >
              Share Slip
            </div>{" "}
            <div
              onClick={() => {
                handleApprove(v);
                setOpenActionId(null);
              }}
              className="px-4 py-2 text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2"
            >
              Approved
            </div>{" "}
            <div
              onClick={() => {
                setEditing(v);
              }}
              className="px-4 py-2 text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2"
            >
              Print
            </div>
          </div>
        )}
      </div>,
    ]) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId: editing?.employeeId || "",
      employeeName: editing?.employeeName || "",
      position: editing?.position || "",
      month: editing?.month || "",
      year: editing?.year || "",
      presentDays: editing?.presentDays || 0,
      approvedLeaves: editing?.approvedLeaves || 0,
      basicSalary: editing?.basicSalary || 0,
      allowances: {
        medical: editing?.allowances?.medical || 0,
        transport: editing?.allowances?.transport || 0,
        others: editing?.allowances?.others || 0,
      },
      deductions: {
        pf: editing?.deductions?.pf || 0,
        loan: editing?.deductions?.loan || 0,
        advanceSalary: editing?.deductions?.advanceSalary || 0,
        tax: editing?.deductions?.tax || 0,
        others: editing?.deductions?.others || 0,
      },
    },
    validationSchema: payrollSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editing) {
        updatePayroll(editing._id, values)
          .then(() => {
            notifySuccess("Payroll updated successfully");
            setOpenModel(false);
            setEditing(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Payroll.");
          })
          .finally(() => setLoading(false));
      } else {
        generatePayroll(values)
          .then(() => {
            notifySuccess("Payroll generated successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to generate payroll.");
          })
          .finally(() => setLoading(false));
      }
    },
  });

  useEffect(() => {
    document.title = "HR-Management | Payroll";
  }, []);
  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-5 xl:flex-nowrap">
          <MonthYearPicker
            value={selectedMonthYear}
            onChange={(val) => setSelectedMonthYear(val)}
          />{" "}
          <div className="flex flex-wrap items-center w-full gap-5 md:gap-4 md:w-auto">
            <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
              <SearchById value={searchId} onChange={setSearchId} />
              <SearchByName value={searchName} onChange={setSearchName} />
            </div>
            <button
              onClick={() => {
                setOpenModel(true);
                setEditing(null);
              }}
              className="h-10 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-base font-medium text-white">Add Payroll</p>
            </button>
          </div>
        </div>
        <div className="bg-[#E5EBF7] p-4 mt-4 rounded-xl 2xl:h-[calc(79.4vh-0px)] xl:h-[calc(69.4vh-0px)]">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth w-full overflow-x-auto bg-white rounded-xl 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={tableHeaders}
              data={tableData}
              isFetching={isFetching}
              handleGoToDetail={handleGoToDetails}
            />
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="relative p-6 bg-white mx-3 rounded-xl w-250 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">
                {editing ? "Update Payroll" : "Add Payroll"}
              </p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 space-y-4 min-w-70">
                  <CustomInput
                    label="Employee ID"
                    placeholder="Enter Employee ID"
                    name="employeeId"
                    value={formik.values.employeeId}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Employee Name"
                    placeholder="Enter Employee Name"
                    name="employeeName"
                    value={formik.values.employeeName}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Position"
                    placeholder="Enter Position"
                    name="position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Month"
                    placeholder="Enter Month"
                    name="month"
                    value={formik.values.month}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Year"
                    placeholder="Enter Year"
                    name="year"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Present Days"
                    placeholder="Enter Present Days"
                    name="presentDays"
                    value={formik.values.presentDays}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Approved Leaves"
                    placeholder="Enter Approved Leaves"
                    name="approvedLeaves"
                    value={formik.values.approvedLeaves}
                    onChange={formik.handleChange}
                  />
                  <CustomInput
                    label="Basic Salary"
                    placeholder="Enter Basic Salary"
                    name="basicSalary"
                    value={formik.values.basicSalary}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="flex-1 space-y-4 min-w-70">
                  <h3 className="text-lg font-semibold">Allowances</h3>
                  {Object.keys(formik.values.allowances).map((key) => (
                    <CustomInput
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      placeholder={`Enter ${key}`}
                      name={`allowances.${key}`}
                      value={
                        formik.values.allowances[
                          key as keyof typeof formik.values.allowances
                        ]
                      }
                      onChange={formik.handleChange}
                    />
                  ))}

                  <h3 className="mt-4 text-lg font-semibold">Deductions</h3>
                  {Object.keys(formik.values.deductions).map((key) => (
                    <CustomInput
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      placeholder={`Enter ${key}`}
                      name={`deductions.${key}`}
                      value={
                        formik.values.deductions[
                          key as keyof typeof formik.values.deductions
                        ]
                      }
                      onChange={formik.handleChange}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-14 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center text-white font-medium"
                >
                  {isloading ? (
                    <Spin
                      indicator={
                        <Loading3QuartersOutlined
                          style={{ fontSize: 24, color: "white" }}
                          spin
                        />
                      }
                    />
                  ) : editing ? (
                    "Update Payroll"
                  ) : (
                    "Generate Payroll"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

interface MonthYearPickerProps {
  value: { month: string; year: number };
  onChange: (val: { month: string; year: number }) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleMonthChange = (month: string) => {
    onChange({ ...value, month });
  };

  const handleYearChange = (year: number) => {
    onChange({ ...value, year });
  };

  return (
    <div className="relative inline-block w-full h-10 lg:w-45">
      <div
        className="flex items-center justify-between px-3 py-2 text-sm text-[#131313] border border-[#0755E9] rounded-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:calendar" width={20} height={20} color="#0755E9" />
          <span>{`${value.month}-${value.year}`}</span>
        </div>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          width={20}
          height={20}
        />
      </div>

      {open && (
        <div className="absolute z-50 flex w-full gap-2 p-3 mt-1 text-xs bg-[#E5EBF7] rounded shadow-lg">
          <select
            className="flex-1 p-1 border border-[#0755E9] rounded"
            value={value.month}
            onChange={(e) => handleMonthChange(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="flex-1 p-1 border-[#0755E9] border rounded"
            value={value.year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
