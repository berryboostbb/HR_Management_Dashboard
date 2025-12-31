import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      title: "Attendance Approved",
      message: "Attendance for Mr. Umair has been approved",
    },
    {
      title: "Check-In Recorded",
      message: "Mr. Sarah Khan checked in successfully",
    },
    {
      title: "Check-Out Recorded",
      message: "Mr. Sarah Khan checked out successfully",
    },
    {
      title: "Attendance Updated",
      message: "Attendance record updated for Mr. Bilal Hassan",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="w-8 h-8 cursor-pointer bg-[#0755E9] rounded-full flex items-center justify-center relative"
      >
        <FaBell className="text-white text-[16px]" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 bg-[#FF7631] text-white text-[10px] font-bold p-1 rounded-full"></span>
        )}
      </div>

      <div
        className={`absolute lg:left-1/2 left-0 lg:-translate-x-1/2 mt-2 md:w-98 w-[320px] bg-white shadow-xl rounded-xl overflow-hidden z-50 transform transition-all duration-300 ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex justify-center">
          <div className="border-t w-20 border-[#0755E9] mt-2"></div>
        </div>
        <div className="p-3 font-medium border-b border-[#7d7d7d]">
          Notifications
        </div>
        <div className="p-4 space-y-2">
          {notifications.length > 0 ? (
            notifications.map((note, i) => (
              <div
                key={i}
                className="p-3 flex items-center justify-between text-sm border border-[#E5EBF7] rounded-md bg-[#f7f7f7] transition"
              >
                <div className="flex items-center gap-4 ">
                  <div className="relative">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                      <span className="text-xs font-semibold text-[#0755E9]">
                        N
                      </span>
                    </div>
                    <div className="absolute top-0 border border-[#E5EBF7] left-3 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="text-xs font-semibold text-[#0755E9]">
                        N
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[14px] text-heading font-medium">
                      {note.title}
                    </p>
                    <p className="text-[11px] text-[#7d7d7d]">{note.message}</p>
                  </div>
                </div>

                <div
                  className="border border-[#D2D2D2] h-10 rounded-lg flex justify-center items-center"
                  style={{ minWidth: "2.5rem" }}
                >
                  <HiDotsHorizontal className="text-heading" size={18} />
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-sm text-[#7d7d7d] text-center">
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
