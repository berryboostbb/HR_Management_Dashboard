import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import {
  addAccount,
  deleteAccount,
  getAllAccounts,
  getRole,
  updateAccount,
} from "../../api/adminServices";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { IoMdCloseCircle } from "react-icons/io";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { RiAlertFill } from "react-icons/ri";
import CustomTable from "../../Components/CustomTable";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import DatePicker from "../../Components/DatePicker";
import { Icon } from "@iconify/react";
import ImagePicker from "../../Components/ImagePicker";
import MultiSelect from "../../Components/MultiSelect";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useDebounce } from "../../Components/Debounce";
import type { AxiosResponse } from "axios";
import { employeeSchema } from "../../utils/contant";

export interface SelectedOption {
  label: string;
  amount: number;
}

const leaveOptions = [
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
];

const titles = [
  "Employees Id",
  "Employees Name",
  "Phone No.",
  "Joining Date",
  "Role",
  "Status",
  "Action",
];

export default function Employee() {
  useEffect(() => {
    document.title = "HR-Management | Employees";
  }, []);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<"Field Staff" | "Office Staff">(
    "Field Staff"
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);
  const searchValue = debouncedSearchId || debouncedSearchName;

  const { data, refetch, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: ["Accounts", searchValue],
    queryFn: () => getAllAccounts(searchValue),
    placeholderData: (prev) => prev,
  });

  const { data: Role } = useQuery({
    queryKey: ["Role"],
    queryFn: () => getRole(),
    staleTime: 5 * 60 * 1000,
  });
  const filteredData = data?.data?.filter((v: any) => {
    if (activeTab === "Office Staff") return v.employeeType === "Office Staff";
    if (activeTab === "Field Staff") return v.employeeType === "Field Staff";
    if (activeTab === "Admin") return v.employeeType === "Admin";
    return true;
  });

  const leaveLabelMap: any = {
    "Casual Leave": "casualLeave",
    "Sick Leave": "sickLeave",
    "Annual Leave": "annualLeave",
    "Maternity Leave": "maternityLeave",
    "Paternity Leave": "paternityLeave",
  };

  const objectToMultiSelect = (leave: any) =>
    Object.keys(leaveLabelMap)
      .map((label) => ({ label, amount: leave?.[leaveLabelMap[label]] || 0 }))
      .filter((v) => v.amount > 0);

  const multiSelectToObject = (arr: SelectedOption[]) => {
    const result: any = {
      casualLeave: 0,
      sickLeave: 0,
      annualLeave: 0,
      maternityLeave: 0,
      paternityLeave: 0,
    };
    arr.forEach((item) => {
      result[leaveLabelMap[item.label]] = item.amount;
    });
    return result;
  };

  const tableData =
    filteredData?.map((v: any) => {
      const roleObj = Role?.data?.find((r: any) => r.value === v.role);
      return [
        v?.employeeId,
        v?.name,
        v?.phoneNumber,
        v?.joiningDate ? dayjs(v.joiningDate).format("YYYY-MM-DD") : "-",
        <p className="capitalize">{roleObj?.title || v?.role}</p>,
        <div
          className={`px-2 py-0.5 w-max rounded-sm text-sm font-medium border ${
            v?.employeeStatus === "Active"
              ? "text-[#0755E9] border-[#0755E9]"
              : "text-[#E90761] border-[#E90761]"
          }`}
        >
          {v?.employeeStatus}
        </div>,
        <div className="relative">
          <Icon
            icon="ph:dots-three-outline-vertical-duotone"
            className="text-2xl text-[#0755E9] cursor-pointer"
            onClick={() =>
              setOpenActionId(openActionId === v._id ? null : v._id)
            }
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
                <TbEdit size={16} />
                Edit
              </div>
              <div
                onClick={() => handleToggleStatus(v)}
                className="px-4 py-2 text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2"
              >
                {v.employeeStatus === "Active" ? (
                  <>
                    <Icon icon="mdi:account-cancel-outline" />
                    Inactivate
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:account-check-outline" />
                    Activate
                  </>
                )}
              </div>
            </div>
          )}
        </div>,
      ];
    }) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editing?.name || "",
      gender: editing?.gender || "",
      email: editing?.email || "",
      password: editing?.password || "",
      phoneNumber: editing?.phoneNumber || "",
      role: editing?.role || "",
      employeeType: editing?.employeeType || "",
      department: editing?.department || "",
      joiningDate: editing?.joiningDate ? dayjs(editing.joiningDate) : null,
      DOB: editing?.DOB ? dayjs(editing.DOB) : null,
      employeeStatus: editing?.employeeStatus || "",
      salaryStructure: {
        basic: editing?.salaryStructure?.basic || 0,
        incentive: {
          flue: editing?.salaryStructure?.incentive?.flue || 0,
          medical: editing?.salaryStructure?.incentive?.medical || 0,
          others: editing?.salaryStructure?.incentive?.others || 0,
          deductions: editing?.salaryStructure?.incentive?.deductions || 0,
        },
        tax: editing?.salaryStructure?.tax || 0,
      },
      loanPF: {
        loan: editing?.loanPF?.loan || 0,
        pf: editing?.loanPF?.pf || 0,
      },
      image: editing?.image || "",
      leaveMultiSelect: objectToMultiSelect(
        editing?.leaveEntitlements || {
          casualLeave: 0,
          sickLeave: 0,
          annualLeave: 0,
          maternityLeave: 0,
          paternityLeave: 0,
        }
      ), // UI
      leaveEntitlements: editing?.leaveEntitlements || {
        // For validation & submission
        casualLeave: 0,
        sickLeave: 0,
        annualLeave: 0,
        maternityLeave: 0,
        paternityLeave: 0,
      },
    },
    validationSchema: employeeSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        name: values.name,
        gender: values.gender,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        role: values.role,
        employeeType: values.employeeType,
        department: values.department,
        joiningDate: values.joiningDate,
        DOB: values.DOB,
        employeeStatus: values.employeeStatus,
        salaryStructure: values.salaryStructure,
        loanPF: values.loanPF,
        image: values.image,
        leaveEntitlements: multiSelectToObject(values.leaveMultiSelect), // convert array to object
      };

      const action = editing
        ? updateAccount(editing._id, payload)
        : addAccount(payload);

      action
        .then(() => {
          notifySuccess(
            editing
              ? "Employee updated successfully"
              : "Employee added successfully"
          );
          setOpenModel(false);
          setEditing(null);
          formik.resetForm();
          refetch();
        })
        .catch(() => {
          notifyError(
            editing ? "Failed to update Employee." : "Failed to add Employee."
          );
        })
        .finally(() => setLoading(false));
    },
  });
  const handleDelete = () => {
    if (!editing?._id) return;
    setLoadingDelete(true);
    deleteAccount(editing._id)
      .then(() => {
        notifySuccess("Employee deleted successfully");
        setDeleteConfirmation(false);
        setEditing(null);
        refetch();
      })
      .catch(() => notifyError("Failed to delete Employee. Please try again."))
      .finally(() => setLoadingDelete(false));
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const roleData = Role?.data || [];

  const roleOptions = roleData.map((r: any) => r.title);
  const handleToggleStatus = (employee: any) => {
    const newStatus =
      employee.employeeStatus === "Active" ? "Inactive" : "Active";

    updateAccount(employee._id, { employeeStatus: newStatus })
      .then(() => {
        notifySuccess(`Employee ${newStatus} successfully`);
        refetch();
        setOpenActionId(null);
      })
      .catch(() => notifyError("Failed to update status"));
  };

  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap-reverse items-center justify-between w-full gap-4 xl:flex-nowrap md:w-auto">
          <div className="flex flex-wrap w-full gap-4 mb-4 xl:w-auto md:mb-0 ">
            {["Field Staff", "Office Staff", "Admin"].map((role) => (
              <div
                key={role}
                onClick={() => setActiveTab(role as any)}
                className={`cursor-pointer rounded-t-2xl rounded-b-2xl md:rounded-b-none h-10 md:h-14 flex justify-center items-center sm:w-30 w-full ${
                  activeTab === role
                    ? "bg-[#E5EBF7] text-black"
                    : "bg-white text-[#7d7d7d]"
                }`}
              >
                <p className="text-xs font-medium lg:text-sm">{role}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center w-auto gap-5 xl:flex-nowrap md:gap-4">
            <div className="flex flex-wrap items-center w-full gap-3 lg:w-auto md:flex-nowrap">
              <div className="w-full md:w-60 lg:w-80 xl:w-50 2xl:w-80">
                <SearchById value={searchId} onChange={setSearchId} />
              </div>
              <div className="w-full md:w-60 lg:w-80 xl:w-50 2xl:w-80">
                <SearchByName value={searchName} onChange={setSearchName} />
              </div>
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setOpenModel(true);
              }}
              className="h-10 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-base font-medium text-white">Add Employee</p>
            </button>
          </div>
        </div>
        <div
          className={`bg-[#E5EBF7] p-4 rounded-xl 2xl:h-[calc(79.4vh-0px)] xl:h-[calc(69.5vh-0px)] ${
            activeTab === "Field Staff"
              ? "md:rounded-tl-none :rounded-tl-2xl "
              : "rounded-tl-xl"
          }`}
        >
          <p className="text-[#7D7D7D] font-medium text-sm">Employees List</p>
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth bg-white rounded-xl mt-2 2xl:h-[calc(73vh-0px)] xl:h-[calc(60vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable
              data={tableData}
              titles={titles}
              isFetching={isFetching}
            />
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="relative p-6 bg-white rounded-xl mx-3 w-250 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">
                {editing ? "Update Employee" : "Add Employee"}
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
                  <div>
                    <CustomInput
                      label="Name"
                      placeholder="Enter name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      name="name"
                    />
                    {formik.touched.name &&
                      formik.errors.name &&
                      typeof formik.errors.name === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.name}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomSelect
                      placeholder="Select Gender"
                      value={formik.values.gender}
                      options={["Male", "Female"]}
                      onChange={(val) => formik.setFieldValue("gender", val)}
                    />
                    {formik.touched.gender &&
                      formik.errors.gender &&
                      typeof formik.errors.gender === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.gender}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Email"
                      placeholder="Enter email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      name="email"
                    />
                    {formik.touched.email &&
                      formik.errors.email &&
                      typeof formik.errors.email === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.email}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <div className="relative w-full">
                      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className="rounded-md w-full h-14 pr-15 px-3 py-2 text-sm outline-none border-[#0755E9] border-[0.5px]"
                      />
                      <span
                        className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <FiEye style={{ fontSize: "20px" }} />
                        ) : (
                          <FiEyeOff style={{ fontSize: "20px" }} />
                        )}
                      </span>
                    </div>
                    {formik.touched.password &&
                      formik.errors.password &&
                      typeof formik.errors.password === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.password}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomSelect
                      placeholder="Select Employee Role"
                      options={roleOptions} // display titles
                      value={
                        roleData.find(
                          (r: any) => r.value === formik.values.role
                        )?.title || null
                      }
                      onChange={(selectedTitle) => {
                        const selectedRole = roleData.find(
                          (r: any) => r.title === selectedTitle
                        );
                        formik.setFieldValue("role", selectedRole?.value || "");
                      }}
                    />{" "}
                    {formik.touched.role &&
                      formik.errors.role &&
                      typeof formik.errors.role === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.role}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomSelect
                      placeholder="Select Employee Type"
                      value={formik.values.employeeType}
                      options={["Office Staff", "Field Staff"]}
                      onChange={(val) =>
                        formik.setFieldValue("employeeType", val)
                      }
                    />{" "}
                    {formik.touched.employeeType &&
                      formik.errors.employeeType &&
                      typeof formik.errors.employeeType === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.employeeType}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Department"
                      placeholder="Enter department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      name="department"
                    />
                    {formik.touched.department &&
                      formik.errors.department &&
                      typeof formik.errors.department === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.department}
                        </div>
                      )}
                  </div>
                  <div>
                    <DatePicker
                      label="Joining Date"
                      value={formik.values.joiningDate}
                      onChange={(date) =>
                        formik.setFieldValue("joiningDate", date)
                      }
                    />
                    {formik.touched.joiningDate &&
                      formik.errors.joiningDate &&
                      typeof formik.errors.joiningDate === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.joiningDate}
                        </div>
                      )}
                  </div>
                  <div>
                    <DatePicker
                      label="DOB"
                      value={formik.values.DOB}
                      onChange={(date) => formik.setFieldValue("DOB", date)}
                    />
                    {formik.touched.DOB &&
                      formik.errors.DOB &&
                      typeof formik.errors.DOB === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.DOB}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomSelect
                      placeholder="Select status"
                      value={formik.values.employeeStatus}
                      options={["Active", "Inactive"]}
                      onChange={(val) =>
                        formik.setFieldValue("employeeStatus", val)
                      }
                    />{" "}
                    {formik.touched.employeeStatus &&
                      formik.errors.employeeStatus &&
                      typeof formik.errors.employeeStatus === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.employeeStatus}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Phone No"
                      placeholder="Enter Phone No"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      name="phoneNumber"
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber &&
                      typeof formik.errors.phoneNumber === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.phoneNumber}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex-1 space-y-4 min-w-70">
                  <div>
                    <CustomInput
                      label="Basic Salary"
                      type="number"
                      value={formik.values.salaryStructure.basic}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.basic",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <CustomInput
                    label="Flue"
                    type="number"
                    value={formik.values.salaryStructure.incentive.flue}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "salaryStructure.incentive.flue",
                        Number(e.target.value)
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched(
                        "salaryStructure.incentive.flue",
                        true
                      )
                    }
                  />
                  {formik.errors.salaryStructure?.incentive?.flue && (
                    <div className="text-xs text-red-500">
                      * {String(formik.errors.salaryStructure.incentive.flue)}
                    </div>
                  )}

                  <div>
                    <CustomInput
                      label="Incentive - Medical"
                      type="number"
                      value={formik.values.salaryStructure.incentive.medical}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.incentive.medical",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Incentive - Others"
                      type="number"
                      value={formik.values.salaryStructure.incentive.others}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.incentive.others",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Incentive - Others"
                      type="number"
                      value={formik.values.salaryStructure.incentive.others}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.incentive.others",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Deductions"
                      type="number"
                      value={formik.values.salaryStructure.incentive.deductions}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.incentive.deductions",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="Tax"
                      type="number"
                      value={formik.values.salaryStructure.tax}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.tax",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.salaryStructure &&
                      formik.errors.salaryStructure &&
                      typeof formik.errors.salaryStructure === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.salaryStructure}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomInput
                      label="PF"
                      type="number"
                      value={formik.values.loanPF.pf}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "loanPF.pf",
                          Number(e.target.value)
                        )
                      }
                    />
                    {formik.touched.loanPF &&
                      formik.errors.loanPF &&
                      typeof formik.errors.loanPF === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.loanPF}
                        </div>
                      )}
                  </div>
                  <div>
                    <ImagePicker
                      label="Upload Image"
                      placeholder="Upload Image Here..."
                      fileType="Manage MR"
                      type="image"
                      value={formik.values.image}
                      onChange={(val: any) =>
                        formik.setFieldValue("image", val)
                      }
                    />
                    {formik.touched.image &&
                      formik.errors.image &&
                      typeof formik.errors.image === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.image}
                        </div>
                      )}
                  </div>
                  <div>
                    <MultiSelect
                      placeholder="Select leave"
                      options={leaveOptions}
                      value={formik.values.leaveMultiSelect}
                      onChange={(val) => {
                        formik.setFieldValue("leaveMultiSelect", val);
                        formik.setFieldValue(
                          "leaveEntitlements",
                          multiSelectToObject(val)
                        );
                      }}
                    />{" "}
                    {formik.touched.leaveMultiSelect &&
                      formik.errors.leaveMultiSelect &&
                      typeof formik.errors.leaveMultiSelect === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.leaveMultiSelect}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="h-14 md:w-48 w-full cursor-pointer bg-[#0755E9] text-white rounded-md flex justify-center items-center gap-2"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editing ? (
                    "Update Employee"
                  ) : (
                    "Add Employee"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-auto p-6 overflow-x-auto bg-white shadow-xl rounded-xl w-125">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="mt-5 text-xl font-semibold text-primary">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Employee</strong>?
              </p>
            </div>
            <div className="flex justify-between gap-4 mt-5">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="py-2 bg-gray-200 rounded cursor-pointer px-7 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2 bg-[#E90761] cursor-pointer text-white rounded"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
