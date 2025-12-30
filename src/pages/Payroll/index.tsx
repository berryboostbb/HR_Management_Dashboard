import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import {
  generatePayroll,
  getAllPayrolls,
  updatePayroll,
} from "../../api/payrollsServices";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import { payrollSchema } from "../../utils/contant";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { TbEdit } from "react-icons/tb";
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
  "Month",
  "Year",
  "Present Days",
  "Approved Leaves",
  "Basic Salary",
  // "Medical Allowance",
  // "Transport Allowance",
  // "Other Allowance",
  // "PF Deduction",
  // "Loan Deduction",
  // "Advance Salary Deduction",
  // "Tax Deduction",
  // "Other Deduction",
  "Gross Salary",
  "Net Pay",
  "Payroll Status",
  "Action",
  "View",
];

export default function Payroll() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);

  const { data, refetch } = useQuery<AxiosResponse<any>>({
    queryKey: ["Payrolls", debouncedSearchId, debouncedSearchName],
    queryFn: () => getAllPayrolls(debouncedSearchId, debouncedSearchName),
    placeholderData: (previousData) => previousData,
  });
  const handleGoToDetails = (v: any) => {
    navigate("/payroll/payrollDetails", { state: { data: v } });
  };
  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.employeeName,
      v.position || "-",
      v.month,
      v.year,
      v.presentDays,
      v.approvedLeaves,
      v.basicSalary,
      // v.allowances?.medical,
      // v.allowances?.transport,
      // v.allowances?.others,
      // v.deductions?.pf,
      // v.deductions?.loan,
      // v.deductions?.advanceSalary,
      // v.deductions?.tax,
      // v.deductions?.others,
      v.grossSalary,
      v.netPay,
      v.payrollStatus,
      <div className="flex items-center gap-2" key={v._id}>
        <TbEdit
          onClick={() => {
            setOpenModel(true);
            setEditing(v);
          }}
          size={18}
          className="cursor-pointer text-[#0755E9]"
        />
      </div>,
      <p
        onClick={() => {
          handleGoToDetails(v);
        }}
      >
        Details
      </p>,
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

  // const antIcon = (
  //   <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  // );

  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-end w-full gap-5 md:gap-4 md:w-auto">
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

        <div className="bg-[#E5EBF7] p-4 mt-4 rounded-xl 2xl:h-[calc(79.4vh-0px)] xl:h-[calc(69.4vh-0px)]">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth w-full overflow-x-auto bg-white rounded-xl 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={tableHeaders} data={tableData} />
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
