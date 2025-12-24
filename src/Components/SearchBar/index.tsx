import { Avatar } from "antd";
import Notification from "../Notifications";
import { useSelector } from "react-redux";

export default function SearchBar() {
  const { user } = useSelector((state: any) => state.user);

  return (
    <>
      <div className="bg-[#F7F7F7] px-4  rounded-lg w-full xl:h-20 h-37.5 md:h-20 flex xl:justify-end lg:justify-start justify-end">
        <div className="flex flex-wrap items-center w-full lg:w-auto ">
          <div className="mr-4 cursor-pointer">
            <Notification />
          </div>
          <div className="w-full md:w-62.5 h-14 bg-white rounded-xl px-2 flex gap-3 items-center">
            <Avatar src={user?.image} size={40} />
            <div>
              <p className="text-[#0755E9] text-sm leading-3.5 w-37.5 truncate">
                {user?.employeeRole}
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
