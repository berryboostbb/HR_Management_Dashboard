import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import ImagePicker from "../../Components/ImagePicker";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomTextarea from "../../Components/CustomTextarea";
import DatePicker from "../../Components/DatePicker";
import { TbEdit } from "react-icons/tb";
import { useFormik } from "formik";
import { EventSchema } from "../../utils/contant";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvents,
} from "../../api/eventsServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useQuery } from "@tanstack/react-query";
import { RiAlertFill } from "react-icons/ri";
import dayjs from "dayjs";
export default function Events() {
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);

  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["AllEvents"],
    queryFn: () => getAllEvents(),
    staleTime: 5 * 60 * 1000,
  });
  let AllEvents = data?.data;

  useEffect(() => {
    document.title = "HR-Management | Events";
  }, []);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      coverImage: editing?.coverImage || "",
      date: editing?.date ? dayjs(editing.date) : null,
      heading: editing?.heading || "",
      overview: editing?.overview || "",
      category: editing?.category || "",
    },
    validationSchema: EventSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editing) {
        updateEvents(editing._id, values)
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
        createEvent(values)
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
    deleteEvent(editing._id)
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
  return (
    <>
      {" "}
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-108px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-start justify-end  gap-4">
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
            <p className="text-base font-medium text-white">Add Events</p>
          </button>
        </div>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] overflow-y-auto mt-4 p-4 rounded-lg 2xl:h-[calc(79.4vh-0px)] xl:h-[calc(56vh-0px)] "
        >
          <p className="text-sm text-[#7d7d7d] leading-[100%]">Events List</p>
          <div className="my-4 flex flex-wrap gap-5 items-center">
            {isLoading || isFetching ? (
              <div className="w-full flex justify-center items-center py-10">
                <Spin indicator={antIcon22} />
              </div>
            ) : AllEvents && AllEvents.length > 0 ? (
              AllEvents.map((e: any, index: number) => (
                <div
                  key={e._id || index}
                  className="bg-white rounded-2xl w-[calc(50%-10px)] group h-150 flex flex-col overflow-hidden"
                >
                  <div className="p-4 flex-1">
                    <p className="text-[#131313] text-[32px] font-medium border-b-2 w-max border-[#0755E9]">
                      {e.heading}
                    </p>
                    <p className="mt-5 text-base text-[#7d7d7d]">
                      {e.overview}
                    </p>
                  </div>

                  <div className="relative h-100 overflow-hidden">
                    <img
                      src={e.coverImage}
                      className="w-full h-full object-cover rounded-b-lg"
                      alt={e.heading}
                    />
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white flex justify-center items-center cursor-pointer rounded-full h-12 w-12">
                        <button
                          onClick={() => {
                            setEditing(e);
                            setOpenModel(true);
                          }}
                        >
                          <TbEdit className="text-blue-500" size={22} />
                        </button>
                      </div>
                      <div className="bg-white flex justify-center items-center cursor-pointer rounded-full h-12 w-12">
                        <button
                          onClick={() => {
                            setEditing(e);
                            setDeleteConfirmation(true);
                          }}
                        >
                          <Icon
                            color="#E90761"
                            height="18"
                            width="24"
                            icon="mingcute:delete-fill"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full py-10">
                No events found.
              </p>
            )}
          </div>
        </div>
      </div>
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
                {editing ? "Update Event" : "Add Event"}
              </p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <ImagePicker
                placeholder="Upload Cover Photos"
                label="Cover Photos"
                fileType="Manage MR"
                type="image"
                value={formik.values.coverImage}
                onChange={(val: any) => formik.setFieldValue("coverImage", val)}
              />
              {formik.touched.coverImage &&
                formik.errors.coverImage &&
                typeof formik.errors.coverImage === "string" && (
                  <div className="text-xs text-red-500">
                    * {formik.errors.coverImage}
                  </div>
                )}
              <DatePicker
                label="Date"
                placeholder="Select the Date"
                value={formik.values.date}
                onChange={(date) => formik.setFieldValue("date", date)}
              />
              {formik.touched.date &&
                formik.errors.date &&
                typeof formik.errors.date === "string" && (
                  <div className="text-xs text-red-500">
                    * {formik.errors.date}
                  </div>
                )}
              <CustomSelect
                placeholder="Category"
                value={formik.values.category}
                options={["Office Staff", "Field Staff", "HR"]}
                onChange={(val) => formik.setFieldValue("category", val)}
              />
              {formik.touched.category &&
                formik.errors.category &&
                typeof formik.errors.category === "string" && (
                  <div className="text-xs text-red-500">
                    * {formik.errors.category}
                  </div>
                )}
              <CustomInput
                label="Heading"
                placeholder="Write the Heading"
                value={formik.values.heading}
                onChange={formik.handleChange}
                name="heading"
              />
              {formik.touched.heading &&
                formik.errors.heading &&
                typeof formik.errors.heading === "string" && (
                  <div className="text-xs text-red-500">
                    * {formik.errors.heading}
                  </div>
                )}
              <CustomTextarea
                label="Overview Detail"
                placeholder="Write the Overview Detail"
                value={formik.values.overview}
                onChange={formik.handleChange}
                name="overview"
              />{" "}
              {formik.touched.overview &&
                formik.errors.heading &&
                typeof formik.errors.overview === "string" && (
                  <div className="text-xs text-red-500">
                    * {formik.errors.overview}
                  </div>
                )}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-14 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center text-white font-medium"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editing ? (
                    "Update Event"
                  ) : (
                    "Add Event"
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
                Are you sure you want to delete this <strong>Event</strong>?
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
