import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import {
  addAccount,
  deleteAccount,
  getAllAccounts,
  updateAccount,
} from "../../api/adminServices";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { IoMdCloseCircle } from "react-icons/io";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { RiAlertFill } from "react-icons/ri";
import CustomTable from "../../Components/CustomTable";
import { AdminSchema, LoginSchema } from "../../utils/contant";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import DatePicker from "../../Components/DatePicker";
import { Icon } from "@iconify/react";
import ImagePicker from "../../Components/ImagePicker";
import MultiSelect from "../../Components/MultiSelect";
import { FiEye, FiEyeOff } from "react-icons/fi";

const leaveOptions = [
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
];
const titles = [
  "Employee Id",
  "Name",
  "Email",
  "Employee Role",
  "Designation",
  "Joining Date",
  "Status",
  "Action",
];
export default function ManageAccount() {
  useEffect(() => {
    document.title = "HR-Management | Manage Accounts";
  }, []);
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["Accounts"],
    queryFn: getAllAccounts,
    staleTime: 5 * 60 * 1000,
  });
  console.log("🚀 ~ ManageAccount ~ data:", data);

  const tableData =
    data?.data?.map((v: any) => [
      v?.employeeId,
      v?.name,
      v?.email,
      v?.employeeRole,
      v?.designation,
      v?.joiningDate ? dayjs(v.joiningDate).format("YYYY-MM-DD") : "-",
      v?.employeeStatus,
      <div className="flex items-center gap-2" key={v._id}>
        <TbEdit
          onClick={() => {
            setOpenModel(true);
            setEditing(v);
            // setCreateAccount(true);
          }}
          size={18}
          className="cursor-pointer text-[#0755E9]"
        />
        <Icon
          color="#E90761"
          height="18"
          width="20"
          icon="mingcute:delete-fill"
          onClick={() => {
            setDeleteConfirmation(true);
            setEditing(v);
          }}
        />
      </div>,
    ]) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editing?.name || "",
      email: editing?.email || "",
      password: editing?.password || "",
      designation: editing?.designation || "",
      employeeRole: editing?.employeeRole || "",
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
      leaveEntitlements: editing?.leaveEntitlements || [],
    },
    validationSchema: AdminSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editing) {
        updateAccount(editing._id, values)
          .then(() => {
            notifySuccess("Account updated successfully");
            setOpenModel(false);
            setEditing(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Account.");
          })
          .finally(() => setLoading(false));
      } else {
        addAccount(values)
          .then(() => {
            notifySuccess("Account added successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to add Account.");
          })
          .finally(() => setLoading(false));
      }
    },
  });

  const handleDelete = () => {
    if (!editing?._id) return;
    setLoadingDelete(true);
    deleteAccount(editing._id)
      .then(() => {
        notifySuccess("Account deleted successfully");
        setDeleteConfirmation(false);
        setEditing(null);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete Account:", error);
        notifyError("Failed to delete Account. Please try again.");
      })
      .finally(() => setLoadingDelete(false));
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Accounts
          </p>

          <button
            onClick={() => {
              setEditing(null);
              setOpenModel(true);
            }}
            className="h-13.75 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-base font-medium text-white">Add Account</p>
          </button>
        </div>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(75.6vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable data={tableData} titles={titles} />
        </div>
      </div>

      {/* Modal */}
      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="relative p-6 bg-white rounded-xl w-250 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">
                {editing ? "Update Account" : "Add Account"}
              </p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-6">
                {/* Left Column */}
                <div className="flex-1 space-y-4 min-w-70">
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

                  <div className="mt-3">
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
                          <FiEye
                            className="text-primary"
                            style={{ fontSize: "20px" }}
                          />
                        ) : (
                          <FiEyeOff style={{ fontSize: "20px" }} />
                        )}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-xs text-red-500">
                        *
                        {typeof formik.errors.password === "string"
                          ? formik.errors.password
                          : ""}
                      </div>
                    )}
                  </div>

                  {formik.touched.password &&
                    formik.errors.password &&
                    typeof formik.errors.password === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.password}
                      </div>
                    )}
                  <CustomInput
                    label="Designation"
                    placeholder="Enter designation"
                    value={formik.values.designation}
                    onChange={formik.handleChange}
                    name="designation"
                  />
                  {formik.touched.designation &&
                    formik.errors.designation &&
                    typeof formik.errors.designation === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.designation}
                      </div>
                    )}
                  <CustomSelect
                    placeholder="Select role"
                    value={formik.values.employeeRole}
                    options={["Admin", "Office Staff", " Field Staff", "HR"]}
                    onChange={(val) =>
                      formik.setFieldValue("employeeRole", val)
                    }
                  />
                  {formik.touched.employeeRole &&
                    formik.errors.employeeRole &&
                    typeof formik.errors.employeeRole === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.employeeRole}
                      </div>
                    )}
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
                  <CustomSelect
                    placeholder="Select status"
                    value={formik.values.employeeStatus}
                    options={["Active", "Inactive"]}
                    onChange={(val) =>
                      formik.setFieldValue("employeeStatus", val)
                    }
                  />
                  {formik.touched.employeeStatus &&
                    formik.errors.employeeStatus &&
                    typeof formik.errors.employeeStatus === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.employeeStatus}
                      </div>
                    )}
                </div>

                {/* Right Column */}
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
                  {formik.touched.salaryStructure?.basic &&
                    formik.errors.salaryStructure?.basic &&
                    typeof formik.errors.salaryStructure.basic === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.basic}
                      </div>
                    )}
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
                  {formik.touched.salaryStructure?.incentive?.flue &&
                    formik.errors.salaryStructure?.incentive?.flue &&
                    typeof formik.errors.salaryStructure.incentive.flue ===
                      "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.incentive.flue}
                      </div>
                    )}

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
                  {formik.touched.salaryStructure?.incentive?.medical &&
                    formik.errors.salaryStructure?.incentive?.medical &&
                    typeof formik.errors.salaryStructure.incentive.medical ===
                      "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.incentive.medical}
                      </div>
                    )}

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
                  {formik.touched.salaryStructure?.incentive?.others &&
                    formik.errors.salaryStructure?.incentive?.others &&
                    typeof formik.errors.salaryStructure.incentive.others ===
                      "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.incentive.others}
                      </div>
                    )}

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
                  {formik.touched.salaryStructure?.incentive?.deductions &&
                    formik.errors.salaryStructure?.incentive?.deductions &&
                    typeof formik.errors.salaryStructure.incentive
                      .deductions === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.incentive.deductions}
                      </div>
                    )}

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
                  {formik.touched.salaryStructure?.tax &&
                    formik.errors.salaryStructure?.tax &&
                    typeof formik.errors.salaryStructure?.tax === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.salaryStructure.tax}
                      </div>
                    )}

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

                  {formik.touched.loanPF?.loan &&
                    formik.errors.loanPF?.loan &&
                    typeof formik.errors.loanPF?.loan === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.loanPF.loan}
                      </div>
                    )}

                  <CustomInput
                    label="PF"
                    type="number"
                    value={formik.values.loanPF.pf}
                    onChange={(e) =>
                      formik.setFieldValue("loanPF.pf", Number(e.target.value))
                    }
                  />

                  {formik.touched.loanPF?.pf &&
                    formik.errors.loanPF?.pf &&
                    typeof formik.errors.loanPF?.pf === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.loanPF?.pf}
                      </div>
                    )}

                  <ImagePicker
                    label="Upload Image"
                    placeholder="Upload Image Here..."
                    fileType="Manage MR"
                    type="image"
                    value={formik.values.image}
                    onChange={(val: any) => formik.setFieldValue("image", val)}
                  />
                  {formik.touched.image &&
                    formik.errors.image &&
                    typeof formik.errors.image === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.image}
                      </div>
                    )}

                  <MultiSelect
                    placeholder="Select leave"
                    options={leaveOptions}
                    value={formik.values.leaveEntitlements}
                    onChange={(val) =>
                      formik.setFieldValue("leaveEntitlements", val)
                    }
                  />
                  {formik.touched.leaveEntitlements &&
                    formik.errors.leaveEntitlements &&
                    typeof formik.errors.leaveEntitlements === "string" && (
                      <div className="text-xs text-red-500">
                        * {formik.errors.leaveEntitlements}
                      </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="h-14 md:w-48 w-full bg-[#0755E9] text-white rounded-md flex justify-center items-center gap-2"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editing ? (
                    "Update Account"
                  ) : (
                    "Add Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-auto p-6 overflow-x-auto bg-white shadow-xl rounded-xl w-125">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="mt-5 text-xl font-semibold text-primary">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Account</strong>?
              </p>
            </div>
            <div className="flex justify-between gap-4 mt-5">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="py-2 bg-gray-200 rounded px-7 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2 bg-[#E90761] text-white rounded"
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
