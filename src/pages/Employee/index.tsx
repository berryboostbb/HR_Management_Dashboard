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
import { AdminSchema } from "../../utils/contant";
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

  const { data, refetch } = useQuery<AxiosResponse<any>>({
    queryKey: ["Accounts", searchValue],
    queryFn: () => getAllAccounts(searchValue),
    placeholderData: (prev) => prev,
  });
  const { data: Role } = useQuery({
    queryKey: ["Role"],
    queryFn: () => getRole(),
    staleTime: 5 * 60 * 1000,
  });
  console.log("🚀 ~ Employee ~ Role:", Role);
  const filteredData = data?.data?.filter((v: any) => {
    if (activeTab === "Office Staff") return v.employeeType === "Office Staff";
    if (activeTab === "Field Staff") return v.employeeType === "Field Staff";
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
        roleObj?.title || "-",
        <div
          className={`px-2 py-0.5 w-max rounded-sm text-sm font-medium border ${
            v?.employeeStatus === "Active"
              ? "text-[#0755E9] border-[#0755E9]"
              : "text-[#E90761] border-[#E90761]"
          }`}
        >
          {v?.employeeStatus}
        </div>,

        // <div className="flex items-center gap-2" key={v._id}>
        //   <TbEdit
        //     onClick={() => {
        //       setOpenModel(true);
        //       setEditing(v);
        //     }}
        //     size={18}
        //     className="cursor-pointer text-[#0755E9]"
        //   />
        //   <Icon
        //     color="#E90761"
        //     height="18"
        //     width="20"
        //     icon="mingcute:delete-fill"
        //     onClick={() => {
        //       setDeleteConfirmation(true);
        //       setEditing(v);
        //     }}
        //   />
        // </div>,
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
    validationSchema: AdminSchema,
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
  console.log("🚀 ~ Employee ~ formik:", formik.errors);
  console.log("🚀 ~ Employee ~ formik values:", formik.values);
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

  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap-reverse items-center justify-between w-full gap-4 md:w-auto">
          <div className="flex gap-4">
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
          <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-2">
            <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
              <SearchById value={searchId} onChange={setSearchId} />
              <SearchByName value={searchName} onChange={setSearchName} />
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
          className={`bg-[#E5EBF7] p-4 rounded-xl 2xl:h-[calc(79.4vh-0px)] xl:h-[calc(56vh-0px)] ${
            activeTab === "Field Staff" ? "rounded-tl-none" : "rounded-tl-xl"
          }`}
        >
          <p className="text-[#7D7D7D] font-medium text-sm">Employees List</p>
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth bg-white rounded-xl mt-2 2xl:h-[calc(73vh-0px)] xl:h-[calc(54vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable data={tableData} titles={titles} />
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="relative p-6 bg-white rounded-xl w-250 max-h-[90vh] overflow-y-auto"
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
                  <CustomInput
                    label="Name"
                    placeholder="Enter name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                  />
                  <CustomSelect
                    placeholder="Select Gender"
                    value={formik.values.gender}
                    options={["Male", "Female"]}
                    onChange={(val) => formik.setFieldValue("gender", val)}
                  />
                  <CustomInput
                    label="Email"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    name="email"
                  />
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

                  <CustomSelect
                    placeholder="Select Employee Role"
                    options={roleOptions} // display titles
                    value={
                      roleData.find((r: any) => r.value === formik.values.role)
                        ?.title || null
                    }
                    onChange={(selectedTitle) => {
                      const selectedRole = roleData.find(
                        (r: any) => r.title === selectedTitle
                      );
                      formik.setFieldValue("role", selectedRole?.value || "");
                    }}
                  />
                  <CustomSelect
                    placeholder="Select Employee Type"
                    value={formik.values.employeeType}
                    options={["Office Staff", "Field Staff"]}
                    onChange={(val) =>
                      formik.setFieldValue("employeeType", val)
                    }
                  />
                  <CustomInput
                    label="Department"
                    placeholder="Enter department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    name="department"
                  />
                  <DatePicker
                    label="Joining Date"
                    value={formik.values.joiningDate}
                    onChange={(date) =>
                      formik.setFieldValue("joiningDate", date)
                    }
                  />
                  <DatePicker
                    label="DOB"
                    value={formik.values.DOB}
                    onChange={(date) => formik.setFieldValue("DOB", date)}
                  />
                  <CustomSelect
                    placeholder="Select status"
                    value={formik.values.employeeStatus}
                    options={["Active", "Inactive"]}
                    onChange={(val) =>
                      formik.setFieldValue("employeeStatus", val)
                    }
                  />
                  <CustomInput
                    label="Phone No"
                    placeholder="Enter Phone No"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    name="phoneNumber"
                  />
                </div>
                <div className="flex-1 space-y-4 min-w-70">
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
                  <CustomInput
                    label="Incentive - Flue"
                    type="number"
                    value={formik.values.salaryStructure.incentive.flue}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "salaryStructure.incentive.flue",
                        Number(e.target.value)
                      )
                    }
                  />
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
                  <CustomInput
                    label="Loan"
                    type="number"
                    value={formik.values.loanPF.loan}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "loanPF.loan",
                        Number(e.target.value)
                      )
                    }
                  />
                  <CustomInput
                    label="PF"
                    type="number"
                    value={formik.values.loanPF.pf}
                    onChange={(e) =>
                      formik.setFieldValue("loanPF.pf", Number(e.target.value))
                    }
                  />
                  <ImagePicker
                    label="Upload Image"
                    placeholder="Upload Image Here..."
                    fileType="Manage MR"
                    type="image"
                    value={formik.values.image}
                    onChange={(val: any) => formik.setFieldValue("image", val)}
                  />
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
                  />
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
