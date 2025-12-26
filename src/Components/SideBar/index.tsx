import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { Icon } from "@iconify/react";
import { setIsLoggedIn } from "../../redux/userSlice";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import Logo from "../../assets/Brand.png";
import { HTTP_CLIENT } from "../../utils/httpClient";
import { store } from "../../redux/store";
import { notifyError, notifySuccess } from "../Toast";

export default function SideBar({ link }: any) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    const { token } = store.getState().user;

    HTTP_CLIENT.post(
      "/admin/logoutAdmin",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        store.dispatch(setIsLoggedIn(false));
        notifySuccess("Successfully logged out");
        navigate("/");
      })
      .catch((err: any) => {
        console.error(
          "🚀 ~ handleLogout ~ err:",
          err.response?.data?.message || err.message
        );
        notifyError(err.response?.data?.message || "Logout failed");
      });
  };

  return (
    <>
      {isOpen ? (
        <button
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          className="xl:hidden fixed top-6 rounded-full bg-white p-3 right-8 z-50 text-xl text-[#0755E9]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaTimes />
        </button>
      ) : (
        <button
          className="xl:hidden absolute top-6 rounded-full bg-white p-3 right-8 z-50 text-xl text-[#0755E9]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
      )}

      <aside
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className={`fixed xl:relative top-0 left-0 h-full overflow-y-auto xl:h-[calc(100vh-32px)] bg-[#F7F7F7] xl:w-[320px] lg:w-65 md:w-65 sm:w-50 w-[320px] p-2 flex flex-col xl:rounded-xl rounded-tr-xl rounded-br-xl transition-transform z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
      >
        <div className="flex items-center gap-2">
          <img src={Logo} className="h-auto w-125" alt="logo" />
        </div>

        <p className="text-[#979797] text-sm font-normal mt-7.5">MENU</p>

        <nav
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex xl:h-[70%] 2xl:h-[80%] overflow-y-auto flex-col gap-0 mt-4"
        >
          {link.map((item: any, index: number) => {
            const hasChildren = item.children && item.children.length > 0;
            const isDropdownOpen = openDropdown === item.name;
            const isActive = hasChildren
              ? item.children.some((child: any) =>
                  location.pathname.startsWith(child.path)
                )
              : location.pathname.startsWith(item.path);

            return (
              <div key={index} className="relative w-full">
                <p
                  onClick={() => {
                    if (hasChildren) {
                      toggleDropdown(item.name);
                    } else {
                      setOpenDropdown(null);
                      onClick(item.path);
                    }
                  }}
                  className={`cursor-pointer text-heading py-2 h-12 text-sm flex items-center gap-2 rounded-xl transition relative ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 h-12 w-2 bg-[#0755E9] rounded-r-lg"></span>
                  )}
                  {item.name == "Secondary Sale" ? (
                    <span
                      className={`pl-5 ${
                        isActive ? "text-[#0755E9]" : "text-[#7d7d7d]"
                      }`}
                    >
                      <Icon
                        style={{ transform: "scaleX(-1)" }}
                        icon={item.icon}
                        width="20"
                        height="20"
                      />
                    </span>
                  ) : (
                    <span
                      className={`pl-5 ${
                        isActive ? "text-[#0755E9]" : "text-[#7d7d7d]"
                      }`}
                    >
                      <Icon icon={item.icon} width="20" height="20" />
                    </span>
                  )}

                  <span className="text-sm">{item.name}</span>
                  {hasChildren && (
                    <span
                      className={`ml-auto pr-4 ${
                        isActive ? "text-[#0755E9]" : "text-[#7d7d7d]"
                      }`}
                    >
                      {isDropdownOpen ? (
                        <IoChevronUpOutline size={16} />
                      ) : (
                        <IoChevronDownOutline size={16} />
                      )}
                    </span>
                  )}
                </p>
                {hasChildren && isDropdownOpen && (
                  <div>
                    <div className="pl-5 pr-4 py-2 flex flex-col  mt-2 bg-[#E5EBF7] rounded-xl">
                      {item.children.map((child: any, idx: number) => {
                        const isChildActive = location.pathname.startsWith(
                          child.path
                        );

                        return (
                          <div
                            key={child.path}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`h-7
                              ${
                                isChildActive
                                  ? " border-[#0755E9]  border-l-2"
                                  : " border-[#7D7D7D] border-l-2"
                              }
                            `}
                            ></div>
                            <p
                              key={idx}
                              onClick={() => onClick(child.path)}
                              className={`cursor-pointer text-sm py-1 pl-3 hover:bg-[#F7F7F7] rounded-md w-full
                              ${
                                isChildActive
                                  ? "text-heading font-medium"
                                  : "text-[#7d7d7d]"
                              }
                            `}
                            >
                              {child.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          onClick={handleLogout}
          className="flex items-center gap-3 pl-5 mt-auto mb-2 text-base font-normal cursor-pointer text-heading"
        >
          <Icon
            icon="clarity:logout-solid"
            width="20"
            height="20"
            color="#7d7d7d"
          />
          <p>Logout</p>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-30 xl:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
