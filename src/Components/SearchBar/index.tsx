import { Avatar } from "antd";
import Notification from "../Notifications";
import { useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router-dom";

export default function SearchBar() {
  const { user } = useSelector((state: any) => {
    return state.user;
  });

  const location = useLocation();
  const pathname = location.pathname;

  const routeNames = {
    "/dashboard": "Dashboard",
    "/employees": "Employees",
    "/attendance": "Attendance",
    "/leaves": "Leaves",
    "/events": "Events",
    "/payroll": "Payroll",
    "/payroll/payrollDetails": "Payroll Details",
  } as const;

  const currentRoute = (
    Object.keys(routeNames) as Array<keyof typeof routeNames>
  ).find((path) => matchPath({ path, end: true }, pathname));

  const pageTitle = currentRoute ? routeNames[currentRoute] : "Page";

  return (
    <>
      <div className="bg-[#F7F7F7] md:flex-nowrap flex-wrap md:p-0.5 p-3 rounded-lg w-full items-center gap-5 h-auto flex xl:justify-between lg:justify-start justify-start">
        <p className="pl-0 text-2xl font-medium md:pl-5 w-max">{pageTitle}</p>
        <div className="flex items-center w-full lg:w-auto ">
          <div className="mr-4 cursor-pointer">
            <Notification />
          </div>
          <div className="w-full md:w-62.5 h-14 bg-white rounded-[9px] px-2 flex gap-3 items-center">
            <Avatar src={user?.image} size={40} />
            <div>
              <p className="text-[#0755E9] capitalize text-sm leading-3.5 w-37.5 truncate">
                {user?.role}
              </p>
              <p className="text-heading text-sm leading-3.5">{user?.name}</p>
              <p className="text-[12px] text-[#979797] leading-3">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
